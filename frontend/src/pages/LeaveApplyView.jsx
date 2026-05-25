import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Info, X, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveApplyView = () => {
    const { dark } = useTheme();
    const [leaveData, setLeaveData] = useState({
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
    });
    const [activeTab, setActiveTab] = useState('Apply');
    const [leaves, setLeaves] = useState([]);
    const [msg, setMsg] = useState('');
    const [showBanner, setShowBanner] = useState(true);
    const [loading, setLoading] = useState(false);

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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(leaveData.fromDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("You cannot apply for leave on a past date. Please select a future date.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/api/leaves/apply', leaveData);
            if (res.data.success) {
                setMsg(res.data.message);
                setLeaveData({ leaveType: '', fromDate: '', toDate: '', reason: '' });
                fetchLeaves();
                setTimeout(() => setMsg(''), 4000);
            }
        } catch (error) {
            console.error("Error applying leave:", error);
            alert("Failed to apply leave. Please check server connection.");
        } finally {
            setLoading(false);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'badge badge-success';
            case 'Rejected': return 'badge badge-danger';
            default: return 'badge badge-warning';
        }
    };

    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const historyLeaves = leaves.filter(l => l.status !== 'Pending');

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leave Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Apply for leave and track your requests.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit mb-8">
                {['Apply', 'Pending', 'History'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        {tab}
                        {tab === 'Pending' && pendingLeaves.length > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full">
                                {pendingLeaves.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Apply Tab */}
            {activeTab === 'Apply' && (
                <div className="space-y-6">
                    {/* Info Banner */}
                    {showBanner && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
                            <Info size={20} className="text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-sky-700 dark:text-sky-300">
                                    Leave is earned by an employee and granted by the employer to take time off work.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="p-1 rounded hover:bg-sky-200 dark:hover:bg-sky-800/50 text-sky-500 dark:text-sky-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Apply Form */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Applying for Leave</h3>

                        {msg && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm mb-6">
                                <CheckCircle size={16} />
                                {msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Leave type *</label>
                                    <select
                                        required
                                        value={leaveData.leaveType}
                                        onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Select type</option>
                                        <option value="Casual Leave">Casual Leave</option>
                                        <option value="Sick Leave">Sick Leave</option>
                                        <option value="Paid Leave">Paid Leave</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">From date *</label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={leaveData.fromDate}
                                        onChange={(e) => setLeaveData({ ...leaveData, fromDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">To date *</label>
                                    <input
                                        type="date"
                                        required
                                        min={leaveData.fromDate || new Date().toISOString().split('T')[0]}
                                        value={leaveData.toDate}
                                        onChange={(e) => setLeaveData({ ...leaveData, toDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reason *</label>
                                <textarea
                                    placeholder="Enter a reason for your leave..."
                                    required
                                    rows={3}
                                    value={leaveData.reason}
                                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                                    className="input-field resize-none"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? (
                                        <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Submitting...</span>
                                    ) : 'Submit'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setLeaveData({ leaveType: '', fromDate: '', toDate: '', reason: '' })}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Pending Tab */}
            {activeTab === 'Pending' && (
                <div className="card">
                    {pendingLeaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                            <Clock size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">No pending leave requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingLeaves.map(leave => (
                                <div key={leave._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-100">{leave.leaveType}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={statusBadge(leave.status)}>{leave.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'History' && (
                <div className="card">
                    {historyLeaves.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                            <Calendar size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">No leave history found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {historyLeaves.map(leave => (
                                <div key={leave._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${leave.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                            {leave.status === 'Approved' ? (
                                                <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <XCircle size={20} className="text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-100">{leave.leaveType}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={statusBadge(leave.status)}>{leave.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaveApplyView;
