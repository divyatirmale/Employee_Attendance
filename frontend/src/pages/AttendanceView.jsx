import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Loader2 } from 'lucide-react';

const AttendanceView = () => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [currentDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await api.get(`/api/attendance/${user.id}?month=${month}&year=${year}`);
      if (res.data.success) {
        setAttendance(res.data.attendance);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const leaveCount = attendance.filter(a => a.status === 'Leave').length;

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const totalDays = daysInMonth(month, year);
  const firstDay = firstDayOfMonth(month, year);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Absent': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'Leave': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      default: return 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Attendance</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your attendance record for each month.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Days Present</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={22} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Days Absent</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Clock size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{leaveCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Days on Leave</div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
            <Loader2 size={24} className="animate-spin mr-3" />
            <span>Loading attendance...</span>
          </div>
        ) : (
          <>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayHeaders.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-lg" />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const d = i + 1;
                const dateStr = new Date(year, month, d).setHours(0, 0, 0, 0);
                const record = attendance.find(a => new Date(a.date).setHours(0, 0, 0, 0) === dateStr);
                const isToday = new Date().setHours(0, 0, 0, 0) === dateStr;

                return (
                  <div
                    key={d}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all
                      ${record ? getStatusStyle(record.status) : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}
                      ${isToday ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                    `}
                  >
                    <span className={`text-sm font-bold ${isToday ? 'text-sky-600 dark:text-sky-400' : ''}`}>
                      {d < 10 ? `0${d}` : d}
                    </span>
                    {record && (
                      <span className="text-[10px] font-medium mt-0.5 uppercase">
                        {record.status.charAt(0)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-emerald-500"></span> Present
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-red-500"></span> Absent
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-blue-500"></span> Leave
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;
