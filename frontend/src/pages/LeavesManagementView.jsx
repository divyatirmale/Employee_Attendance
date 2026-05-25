import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useTheme } from '../context/ThemeContext';
import { Check, X, Calendar, User, Loader2 } from 'lucide-react';

const LeavesManagementView = () => {
    const { dark } = useTheme();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/api/leaves');
            if (res.data.success) {
                setLeaves(res.data.leaves);
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await api.put(`/api/leaves/${id}`, { status });
            if (res.data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error("Error updating leave status:", error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className={`animate-spin ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
            <span className={`ml-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading requests...</span>
        </div>
    );

    return (
        <div>
            <header className="mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
                    <Calendar size={22} className="text-violet-500" />
                    Leave Requests Management
                </h2>
                <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Review and manage employee time-off requests.
                </p>
            </header>

            <div className="space-y-3">
                {leaves.length > 0 ? (
                    leaves.map(leave => {
                        const isPending = leave.status === 'Pending';
                        const statusLower = leave.status.toLowerCase();
                        return (
                            <div key={leave._id} className={`card flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                } ${isPending ? '' : 'opacity-75'}`}>
                                <div className="flex-1 min-w-0">
                                    {/* Employee Info */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-gray-700 text-gray-300' : 'bg-violet-50 text-violet-700'
                                            }`}>
                                            <User size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`font-semibold truncate ${dark ? 'text-white' : 'text-gray-800'}`}>
                                                {leave.employeeId?.name || 'Unknown Employee'}
                                            </h4>
                                            <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {leave.employeeId?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Leave Details */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <div className={`flex items-center gap-1.5 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <Calendar size={14} className={dark ? 'text-gray-500' : 'text-gray-400'} />
                                            <span>
                                                <strong className={dark ? 'text-gray-200' : 'text-gray-700'}>{leave.leaveType}:</strong>{' '}
                                                {new Date(leave.fromDate).toLocaleDateString()} — {new Date(leave.toDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {leave.reason && (
                                        <p className={`mt-2 text-sm italic ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            "{leave.reason}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {isPending ? (
                                        <>
                                            <button
                                                onClick={() => updateStatus(leave._id, 'Approved')}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                            >
                                                <Check size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(leave._id, 'Rejected')}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`badge text-sm ${statusLower === 'approved' ? 'badge-success' :
                                                statusLower === 'rejected' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={`card text-center py-16 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <Calendar size={48} className={`mx-auto mb-3 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={dark ? 'text-gray-400' : 'text-gray-500'}>No leave requests found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeavesManagementView;
