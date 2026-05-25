import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Search, CreditCard, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PayslipAdminView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    month: 'Feb',
    year: 2026,
    earnings: {
      basic: 0,
      hra: 0,
      telephoneAndInternet: 0,
      bonus: 0,
      specialAllowance: 0
    },
    deductions: {
      pf: 0,
      professionalTax: 0
    }
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

  const handleInputChange = (section, field, value) => {
    if (section === 'main') {
      setFormData({ ...formData, [field]: value });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: parseFloat(value) || 0
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert("Please select an employee");

    const basic = formData.earnings.basic || 0;

    const finalEarnings = {
      basic: basic,
      hra: (basic * (formData.earnings.hra || 0)) / 100,
      telephoneAndInternet: (basic * (formData.earnings.telephoneAndInternet || 0)) / 100,
      bonus: (basic * (formData.earnings.bonus || 0)) / 100,
      specialAllowance: (basic * (formData.earnings.specialAllowance || 0)) / 100
    };

    const finalDeductions = {
      pf: (basic * (formData.deductions.pf || 0)) / 100,
      professionalTax: (basic * (formData.deductions.professionalTax || 0)) / 100
    };

    try {
      const res = await api.post('/api/payslips/add', {
        ...formData,
        earnings: finalEarnings,
        deductions: finalDeductions,
        employeeId: selectedEmployee.id || selectedEmployee._id
      });

      if (res.data.success) {
        setMessage("Payslip added successfully! ✅");
        setTimeout(() => {
          setMessage('');
          setSelectedEmployee(null);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      alert("Error adding payslip");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAmount = (field) => {
    return ((formData.earnings.basic * (formData.earnings[field] || 0)) / 100).toFixed(2);
  };
  const calculateDeduction = (field) => {
    return ((formData.earnings.basic * (formData.deductions[field] || 0)) / 100).toFixed(2);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const earningFields = ['basic', 'hra', 'telephoneAndInternet', 'bonus', 'specialAllowance'];
  const deductionFields = ['pf', 'professionalTax'];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Generate Payslips</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Select an employee and enter salary details for the month.</p>
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
                className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-colors ${(selectedEmployee?.id || selectedEmployee?._id) === (emp.id || emp._id)
                    ? 'bg-sky-50 dark:bg-sky-900/20 border-l-[3px] border-l-sky-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-[3px] border-l-transparent'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{emp.email}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
              </li>
            ))}
          </ul>
        </div>

        {/* Payslip Form */}
        <div className="card lg:col-span-2">
          {selectedEmployee ? (
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                Salary Details for {selectedEmployee.name}
              </h3>

              {message && (
                <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium mb-6">
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => handleInputChange('main', 'month', e.target.value)}
                    className="input-field"
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('main', 'year', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                  <h4 className="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-600">
                    Earnings
                  </h4>
                  {earningFields.map(field => (
                    <div key={field} className="mb-4">
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        {field.replace(/([A-Z])/g, ' $1').toUpperCase()} {field !== 'basic' && '(%)'}
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={formData.earnings[field]}
                          onChange={(e) => handleInputChange('earnings', field, e.target.value)}
                          className="input-field flex-1"
                          placeholder={field !== 'basic' ? "Enter %" : "Enter amount"}
                        />
                        {field !== 'basic' && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap min-w-[70px] text-right">
                            = ₹{calculateAmount(field)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-600">
                    Deductions
                  </h4>
                  {deductionFields.map(field => (
                    <div key={field} className="mb-4">
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        {field.replace(/([A-Z])/g, ' $1').toUpperCase()} (%)
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={formData.deductions[field]}
                          onChange={(e) => handleInputChange('deductions', field, e.target.value)}
                          className="input-field flex-1"
                          placeholder="Enter %"
                        />
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap min-w-[70px] text-right">
                          = ₹{calculateDeduction(field)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-8"
              >
                Create Payslip
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <CreditCard size={48} className="mb-4 opacity-40" />
              <p className="text-lg">Select an employee from the left to manage their payslip.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayslipAdminView;
