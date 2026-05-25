import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Mail, Calendar, UserCheck, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EmployeesView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/api/auth/employees');

        if (response.data.success) {
          setEmployees(response.data.employees);
        }
      } catch (err) {
        setError("Failed to load employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employee Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view all registered employees.</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <Loader2 size={24} className="animate-spin mr-3" />
            <span className="text-lg">Loading employees...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-500 text-lg">
            {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <UserCheck size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No employees found.</p>
            <p className="text-sm mt-1">Use the "+ Add Employee" button to create one.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100">{emp.name || 'Unnamed Employee'}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">ID: {emp._id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Mail size={14} className="text-slate-400" /> {emp.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-warning inline-flex items-center gap-1">
                        <UserCheck size={12} /> {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar size={14} className="text-slate-400" /> {formatDate(emp.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesView;
