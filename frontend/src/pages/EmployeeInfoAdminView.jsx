import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Search, Save, UserCheck, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EmployeeInfoAdminView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    personal: { bloodGroup: '', dob: '', nationality: 'Indian', maritalStatus: 'Single', religion: '', physicallyChallenged: 'No', hobby: '' },
    address: { current: '', permanent: '', city: '', state: '', pincode: '' },
    education: { degree: '', institute: '', yearOfPassing: '', grade: '' },
    employment: { designation: '', department: '', location: 'Gujarat', joiningDate: '' }
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

  const fetchEmployeeInfo = async (empId) => {
    try {
      const res = await api.get(`/api/employee-info/${empId}`);
      if (res.data.success && res.data.info) {
        setFormData(res.data.info);
      } else {
        setFormData({
          personal: { bloodGroup: '', dob: '', nationality: 'Indian', maritalStatus: 'Single', religion: '', physicallyChallenged: 'No', hobby: '' },
          address: { current: '', permanent: '', city: '', state: '', pincode: '' },
          education: { degree: '', institute: '', yearOfPassing: '', grade: '' },
          employment: { designation: '', department: '', location: 'Gujarat', joiningDate: '' }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    fetchEmployeeInfo(emp._id || emp.id);
  };

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/employee-info/upsert', {
        ...formData,
        employeeId: selectedEmployee._id || selectedEmployee.id
      });

      if (res.data.success) {
        setMessage("Employee info updated successfully! ✅");
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert("Error updating employee info");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Employee Information</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Select an employee to update their personal and professional details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
            {filteredEmployees.map(emp => (
              <li
                key={emp.id || emp._id}
                onClick={() => handleSelectEmployee(emp)}
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

        {/* Info Form */}
        <div className="card lg:col-span-3">
          {selectedEmployee ? (
            <div>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 mb-8">
                <div className="relative">
                  <img
                    src={selectedEmployee.ProfileImage || `https://ui-avatars.com/api/?name=${selectedEmployee.name}&background=random`}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-[3px] border-white dark:border-slate-600 shadow-lg"
                  />
                  <label htmlFor="img-upload" className="absolute -bottom-1 -right-1 bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors">
                    <Briefcase size={12} />
                  </label>
                  <input
                    type="file"
                    id="img-upload"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        const fd = new FormData();
                        fd.append('image', e.target.files[0]);
                        try {
                          const res = await api.post(`/api/auth/upload-image/${selectedEmployee._id || selectedEmployee.id}`, fd, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          if (res.data.success) {
                            setSelectedEmployee(res.data.user);
                            setEmployees(employees.map(emp => (emp._id || emp.id) === (res.data.user._id || res.data.user.id) ? res.data.user : emp));
                            alert("Profile image updated! ✅");
                          }
                        } catch (err) {
                          alert("Error uploading image");
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedEmployee.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Update profile picture and details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {message && (
                  <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium mb-6">
                    {message}
                  </div>
                )}

                {/* Personal Section */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    <UserCheck size={16} /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Blood Group</label>
                      <input type="text" value={formData.personal.bloodGroup} onChange={e => handleInputChange('personal', 'bloodGroup', e.target.value)} placeholder="e.g. O+" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Marital Status</label>
                      <select value={formData.personal.maritalStatus} onChange={e => handleInputChange('personal', 'maritalStatus', e.target.value)} className="input-field">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Nationality</label>
                      <input type="text" value={formData.personal.nationality} onChange={e => handleInputChange('personal', 'nationality', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    <MapPin size={16} /> Address
                  </h4>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Current Address</label>
                    <textarea value={formData.address.current} onChange={e => handleInputChange('address', 'current', e.target.value)} rows="2" className="input-field"></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">City</label>
                      <input type="text" value={formData.address.city} onChange={e => handleInputChange('address', 'city', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">State</label>
                      <input type="text" value={formData.address.state} onChange={e => handleInputChange('address', 'state', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    <GraduationCap size={16} /> Education
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Highest Degree</label>
                      <input type="text" value={formData.education.degree} onChange={e => handleInputChange('education', 'degree', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Institute</label>
                      <input type="text" value={formData.education.institute} onChange={e => handleInputChange('education', 'institute', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Employment Section */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    <Briefcase size={16} /> Employment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Designation</label>
                      <input type="text" value={formData.employment.designation} onChange={e => handleInputChange('employment', 'designation', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Department</label>
                      <input type="text" value={formData.employment.department} onChange={e => handleInputChange('employment', 'department', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={18} /> Save All Changes
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <UserCheck size={64} className="mb-4 opacity-40" />
              <p className="text-lg">Select an employee to manage their records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoAdminView;
