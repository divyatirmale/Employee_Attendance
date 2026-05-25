import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Plus, X, MoreVertical, MessageSquare, Loader2, Search } from 'lucide-react';

const HelpdeskView = () => {
    const { dark } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('Active');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [search, setSearch] = useState('');
    const [newTicket, setNewTicket] = useState({
        category: '',
        subject: '',
        description: '',
        priority: 'Medium'
    });

    useEffect(() => {
        fetchTickets();
        const handleClickOutside = () => setOpenMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTickets(res.data.tickets);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/tickets/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTickets();
            setOpenMenuId(null);
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const handleDeleteTicket = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTickets();
            setOpenMenuId(null);
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/tickets/add', newTicket, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setShowModal(false);
                setNewTicket({ category: '', subject: '', description: '', priority: 'Medium' });
                fetchTickets();
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets
        .filter(t => t.status === activeTab)
        .filter(t => search ? (t.subject?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase())) : true);

    const priorityBadge = (priority) => {
        const styles = {
            High: 'badge badge-danger',
            Medium: 'badge badge-warning',
            Low: 'badge badge-info'
        };
        return styles[priority] || 'badge badge-info';
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Helpdesk</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Submit and track your support requests.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Plus size={18} /> New Request
                </button>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
                    <button
                        onClick={() => setActiveTab('Active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Active' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('Closed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Closed' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        Closed
                    </button>
                </div>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map(ticket => (
                        <div key={ticket._id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <MessageSquare size={20} className="text-sky-600 dark:text-sky-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {ticket.category}
                                        </span>
                                        <span className={priorityBadge(ticket.priority || 'Medium')}>
                                            {ticket.priority || 'Medium'}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{ticket.subject}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{ticket.description}</p>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === ticket._id ? null : ticket._id);
                                            }}
                                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {openMenuId === ticket._id && (
                                            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                                                {ticket.status === 'Active' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(ticket._id, 'Closed')}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        Mark as Closed
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(ticket._id, 'Active')}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        Reopen Ticket
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteTicket(ticket._id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    Delete Ticket
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="card flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="opacity-40" />
                        </div>
                        <p className="text-lg">No {activeTab.toLowerCase()} tickets found.</p>
                        {activeTab === 'Active' && (
                            <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
                                Create New Request
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">New Request</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                                <select
                                    required
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Select Category...</option>
                                    <option value="IT Support">IT Support</option>
                                    <option value="HR Inquiry">HR Inquiry</option>
                                    <option value="Payroll">Payroll</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Subject line..."
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description *</label>
                                <textarea
                                    required
                                    placeholder="Describe your issue..."
                                    rows={4}
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    className="input-field resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Submitting...</span>
                                    ) : 'Submit'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpdeskView;
