import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, Clock, AlertCircle, User, MessageSquare, Loader2 } from 'lucide-react';

const HelpdeskAdminView = () => {
    const { dark } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/api/tickets');
            if (res.data.success) {
                setTickets(res.data.tickets);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await api.put(`/api/tickets/${id}`, { status });
            if (res.data.success) {
                fetchTickets();
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const getPriorityStyle = (priority) => {
        const p = (priority || 'Medium').toLowerCase();
        if (p === 'high' || p === 'urgent') return 'badge-danger';
        if (p === 'medium') return 'badge-warning';
        return 'badge-info';
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className={`animate-spin ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
            <span className={`ml-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading tickets...</span>
        </div>
    );

    return (
        <div>
            <header className="mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
                    <MessageSquare size={22} className="text-purple-500" />
                    Helpdesk Management
                </h2>
                <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Monitor and resolve employee support requests.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tickets.length > 0 ? (
                    tickets.map(ticket => {
                        const isActive = ticket.status === 'Active';
                        return (
                            <div key={ticket._id} className={`card relative overflow-hidden ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                } ${isActive ? '' : 'opacity-75'}`}>
                                {/* Status indicator bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 ${isActive ? 'bg-amber-400' : 'bg-emerald-500'
                                    }`} />

                                <div className="flex items-center justify-between mb-3">
                                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <User size={13} />
                                        <span>{ticket.employeeId?.name || 'User'}</span>
                                    </div>
                                    <span className={`badge text-xs ${getPriorityStyle(ticket.priority)}`}>
                                        {ticket.priority || 'Medium'}
                                    </span>
                                </div>

                                <h4 className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
                                    {ticket.subject}
                                </h4>
                                <p className={`text-sm mb-4 line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {ticket.description}
                                </p>

                                <div className={`flex items-center justify-between pt-3 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                                    <div className={`flex items-center gap-1.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <MessageSquare size={13} />
                                        <span>{ticket.category}</span>
                                    </div>

                                    {isActive ? (
                                        <button
                                            onClick={() => updateStatus(ticket._id, 'Closed')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                        >
                                            <CheckCircle size={14} /> Mark Resolved
                                        </button>
                                    ) : (
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            <CheckCircle size={14} /> Resolved
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={`col-span-full card text-center py-16 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <Clock size={48} className={`mx-auto mb-3 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={dark ? 'text-gray-400' : 'text-gray-500'}>No support requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpdeskAdminView;
