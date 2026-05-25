import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Search, User, Loader2 } from 'lucide-react';

const LeaveCalendarView = () => {
    const { dark } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterType, setFilterType] = useState('My Team');
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
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

    const getLeaveCounts = () => {
        const counts = {};
        leaves.forEach(leave => {
            const from = new Date(leave.fromDate);
            if (from.getMonth() === currentDate.getMonth() && from.getFullYear() === currentDate.getFullYear()) {
                const day = from.getDate();
                counts[day] = (counts[day] || 0) + 1;
            }
        });
        return counts;
    };

    const leaveCounts = getLeaveCounts();

    const filteredTransactions = leaves.filter(l => {
        const d = new Date(l.fromDate);
        const matchesMonth = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        if (searchTerm) {
            const name = l.employeeId?.name?.toLowerCase() || '';
            return matchesMonth && name.includes(searchTerm.toLowerCase());
        }
        return matchesMonth;
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leave Calendar</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View team leave schedules at a glance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="input-field w-32"
                    >
                        <option value="Me">Me</option>
                        <option value="My Team">Team</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2 card">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {months[month]} {year}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <Loader2 size={24} className="animate-spin mr-3" />
                            <span>Loading calendar...</span>
                        </div>
                    ) : (
                        <>
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                                {days.map(day => (
                                    <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square rounded-lg" />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const d = i + 1;
                                    const now = new Date();
                                    const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                                    const count = leaveCounts[d];

                                    return (
                                        <div
                                            key={d}
                                            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all relative
                        ${isToday ? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-950/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}
                        ${count ? 'border-l-4 border-l-amber-500 dark:border-l-amber-400' : ''}
                      `}
                                        >
                                            <span className={`text-sm font-semibold ${isToday ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {d < 10 ? `0${d}` : d}
                                            </span>
                                            {count > 0 && (
                                                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="w-3 h-3 rounded bg-amber-500"></span> Team on Leave
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="w-3 h-3 rounded bg-red-400"></span> Restricted Holiday
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="w-3 h-3 rounded bg-emerald-500"></span> General Holiday
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar - Transactions */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                            Leave Transactions ({filteredTransactions.length})
                        </h4>
                    </div>

                    <div className="relative mb-4">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Employee"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            <Loader2 size={20} className="animate-spin" />
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Days</th>
                                        <th>From-To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map(leave => (
                                        <tr key={leave._id}>
                                            <td>
                                                <div>
                                                    <div className="font-medium text-slate-800 dark:text-slate-100">
                                                        {leave.employeeId?.name || 'Employee'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 dark:text-slate-500">
                                                        #{leave.employeeId?._id?.slice(-5).toUpperCase() || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                    {Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    {new Date(leave.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="text-xs text-slate-400 dark:text-slate-500">{leave.leaveType}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                            <User size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">No team members are on leave in {months[month]}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveCalendarView;
