import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Search, User, Mail, Calendar, MapPin, Star, Filter, Loader2 } from 'lucide-react';

const PeopleView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Everyone');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
        if (res.data.employees.length > 0) {
          setSelectedEmployee(res.data.employees[0]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.id || emp._id).toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'Starred') {
      return matchesSearch && emp.isStarred;
    }

    return matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className={`animate-spin ${dark ? 'text-gray-400' : 'text-gray-400'}`} />
      <span className={`ml-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading directory...</span>
    </div>
  );

  return (
    <div>
      <h3 className={`text-lg font-bold mb-5 ${dark ? 'text-white' : 'text-gray-800'}`}>Team Members</h3>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar - List */}
        <div className={`card p-0 overflow-hidden lg:w-72 shrink-0 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Tabs */}
          <div className={`flex border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('Starred')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'Starred'
                  ? 'text-sky-600 border-b-2 border-sky-600 dark:text-sky-400 dark:border-sky-400'
                  : `${dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`
                }`}
            >Starred</button>
            <button
              onClick={() => setActiveTab('Everyone')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'Everyone'
                  ? 'text-sky-600 border-b-2 border-sky-600 dark:text-sky-400 dark:border-sky-400'
                  : `${dark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`
                }`}
            >Everyone</button>
          </div>

          {/* Search */}
          <div className={`relative m-3 ${dark ? 'border-gray-700' : ''}`}>
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Enter Emp. Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`input-field pl-8 pr-8 text-sm ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
            <Filter size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>

          {/* Employee List */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(emp => {
                const isActive = (selectedEmployee?.id || selectedEmployee?._id) === (emp.id || emp._id);
                return (
                  <div
                    key={emp.id || emp._id}
                    onClick={() => setSelectedEmployee(emp)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isActive
                        ? `${dark ? 'bg-sky-900/30 border-l-2 border-sky-500' : 'bg-sky-50 border-l-2 border-sky-500'}`
                        : `${dark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} border-l-2 border-transparent`
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${dark ? 'bg-gray-600 text-gray-200' : 'bg-sky-100 text-sky-700'
                      }`}>
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{emp.name}</div>
                      <div className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        #{(emp.id || emp._id).substring((emp.id || emp._id).length - 5).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`px-4 py-8 text-center text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                No employees found
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Details */}
        <div className="flex-1">
          {selectedEmployee ? (
            <div className={`card ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b dark:border-gray-700">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                  <User size={48} className={dark ? 'text-gray-500' : 'text-gray-400'} />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className={`text-2xl font-bold flex items-center gap-2 justify-center sm:justify-start ${dark ? 'text-white' : 'text-gray-800'}`}>
                    {selectedEmployee.name} <Star size={16} className="text-amber-400 fill-amber-400" />
                  </h2>
                  <div className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-mono ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                    #{(selectedEmployee.id || selectedEmployee._id).substring((selectedEmployee.id || selectedEmployee._id).length - 5).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="mb-5">
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  CONTACT DETAILS
                </h4>
                <div className={`flex items-center justify-between py-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-sm">Extension No</span>
                  <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                </div>
                <div className={`flex items-center justify-between py-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-sm">Email</span>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedEmployee.email || '-'}</span>
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  CATEGORY
                </h4>
                <div className={`flex items-center justify-between py-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-sm flex items-center gap-1.5"><MapPin size={14} /> Location</span>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Gujarat</span>
                </div>
                <div className={`flex items-center justify-between py-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="text-sm">Role</span>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedEmployee.role || 'Employee'}</span>
                </div>
              </div>

              {/* Other Information */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  OTHER INFORMATION
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${dark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <label className={`text-xs block mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Joining Date</label>
                    <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {selectedEmployee.createdAt
                        ? new Date(selectedEmployee.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '01 Oct, 2022'}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${dark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <label className={`text-xs block mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Date Of Birth</label>
                    <span className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {selectedEmployee.birthday || '25 Aug'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`card text-center py-16 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <User size={64} className={`mx-auto mb-4 ${dark ? 'text-gray-700' : 'text-gray-200'}`} />
              <p className={dark ? 'text-gray-400' : 'text-gray-500'}>Select an employee to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleView;
