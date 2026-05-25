import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Upload, FileText, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DocumentAdminView = () => {
  const { dark } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    category: 'Qualification',
    name: '',
    fileUrl: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) fetchEmployeeDocuments(selectedEmployee.id || selectedEmployee._id);
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDocuments = async (empId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/documents/${empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setDocuments(res.data.documents);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert("Please select an employee");

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/documents/upload', {
        employeeId: selectedEmployee.id || selectedEmployee._id,
        ...formData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage("Document uploaded successfully! ✅");
        fetchEmployeeDocuments(selectedEmployee.id || selectedEmployee._id);
        setFormData({ ...formData, name: '', fileUrl: '' });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading document");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployeeDocuments(selectedEmployee.id || selectedEmployee._id);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Document Management</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload certificates, reports, and other documents for employees.</p>
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
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                  (selectedEmployee?.id || selectedEmployee?._id) === (emp.id || emp._id) 
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

        {/* Management Form */}
        <div className="card lg:col-span-2">
          {selectedEmployee ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                Documents for {selectedEmployee.name}
              </h3>
              
              {message && (
                <div className="px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-medium mb-6">
                  {message}
                </div>
              )}

              <form onSubmit={handleUpload} className="p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 mb-8">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-5">Upload New Document</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="input-field"
                    >
                      <option value="Qualification">Qualification</option>
                      <option value="Accounts & Statutory">Accounts & Statutory</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Document Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="e.g. BCA Degree" 
                      required 
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">File URL (or Base64)</label>
                  <input 
                    type="text" 
                    value={formData.fileUrl} 
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})} 
                    placeholder="Paste URL here" 
                    required 
                    className="input-field"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary flex items-center gap-2"
                >
                  <Upload size={18} /> Upload Document
                </button>
              </form>

              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Existing Documents</h4>
                {documents.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {documents.map(doc => (
                      <div key={doc._id} className="flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-700 dark:text-slate-200 text-sm">{doc.name}</div>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{doc.category}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDelete(doc._id)} 
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-slate-400 dark:text-slate-500">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <FileText size={64} className="mb-4 opacity-40" />
              <p className="text-lg">Select an employee from the left to manage their documents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAdminView;
