import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Search, Calendar as CalendarIcon, UserCheck, UserMinus, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AttendanceAdminView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    shift: 'GEN',
    workHours: '09:30'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/auth/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (status) => {
    if (!selectedEmployee) return alert("Please select an employee");

    try {
      const res = await api.post('/api/attendance/mark', {
        employeeId: selectedEmployee.id || selectedEmployee._id,
        date: attendanceData.date,
        status: status,
        shift: attendanceData.shift,
        workHours: attendanceData.workHours
      });

      if (res.data.success) {
        setMessage(`Marked ${selectedEmployee.name} as ${status} ✅`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert("Error marking attendance");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Attendance Management</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Mark employees as Present or Absent for specific dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="card p-0 overflow-hidden lg:col-span-1">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Employees</h3>
          </div>
          <div className="px-4 py-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[400px] overflow-y-auto">
            {filteredEmployees.map(emp => (
              <li
                key={emp.id || emp._id}
                onClick={() => setSelectedEmployee(emp)}
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${(selectedEmployee?.id || selectedEmployee?._id) === (emp.id || emp._id)
                  ? 'bg-sky-50 dark:bg-sky-900/20 border-l-[3px] border-l-sky-500'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-[3px] border-l-transparent'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{emp.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mark Form */}
        <div className="card lg:col-span-2">
          {selectedEmployee ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                Mark Attendance for {selectedEmployee.name}
              </h3>

              {message && (
                <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium mb-6">
                  {message}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  value={attendanceData.date}
                  onChange={(e) => setAttendanceData({ ...attendanceData, date: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Shift</label>
                  <select
                    value={attendanceData.shift}
                    onChange={(e) => setAttendanceData({ ...attendanceData, shift: e.target.value })}
                    className="input-field"
                  >
                    <option value="GEN">General (GEN)</option>
                    <option value="MOR">Morning (MOR)</option>
                    <option value="NIG">Night (NIG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Work Hours</label>
                  <input
                    type="text"
                    value={attendanceData.workHours}
                    onChange={(e) => setAttendanceData({ ...attendanceData, workHours: e.target.value })}
                    placeholder="09:30"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleMarkAttendance('Present')}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <UserCheck size={18} /> Mark Present
                </button>
                <button
                  onClick={() => handleMarkAttendance('Absent')}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <UserMinus size={18} /> Mark Absent
                </button>
                <button
                  onClick={() => handleMarkAttendance('Leave')}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <CalendarIcon size={18} /> Mark Leave
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <CalendarIcon size={64} className="mb-4 opacity-40" />
              <p className="text-lg">Select an employee from the left to mark their attendance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdminView;
