import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { Shield, UserPlus, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminManagementView = () => {
    const { dark } = useTheme();
    const [admins, setAdmins] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        permissions: []
    });

    const sections = [
        "Overview", "Employees", "Attendance", "Leave Requests",
        "Salary", "Document Center", "Tasks & Reviews", "Reports",
        "Settings", "People Info", "Helpdesk", "Admin Management"
    ];

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/api/auth/admins');
            if (res.data.success) {
                setAdmins(res.data.admins);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (section) => {
        setNewAdmin(prev => {
            const newPermissions = prev.permissions.includes(section)
                ? prev.permissions.filter(p => p !== section)
                : [...prev.permissions, section];
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/register-admin', newAdmin);
            if (res.data.success) {
                alert("Admin account created successfully!");
                setIsModalOpen(false);
                setNewAdmin({ name: '', email: '', password: '', permissions: [] });
                fetchAdmins();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Error creating admin");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-lg">
                Loading admin data...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Configure system access and manage administrator accounts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 self-start"
                >
                    <UserPlus size={18} />
                    Create New Admin
                </button>
            </div>

            {/* Admins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {admins.map(admin => (
                    <div key={admin._id} className="card">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold flex-shrink-0">
                                {admin.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{admin.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{admin.email}</p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Access</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {admin.permissions && admin.permissions.length > 0 ? (
                                    admin.permissions.map(p => (
                                        <span key={p} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">
                                            {p}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                                        Full System Administrator Access (All sections enabled)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-[fadeIn_0.2s_ease-out]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">New Admin Account</h2>
                                <p className="text-slate-500 dark:text-slate-400">Provide basic details and set section-level permissions.</p>
                            </div>

                            <form onSubmit={handleCreateAdmin}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
                                    <input
                                        className="input-field"
                                        type="text"
                                        placeholder="Enter full name"
                                        required
                                        value={newAdmin.name}
                                        onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
                                        <input
                                            className="input-field"
                                            type="email"
                                            placeholder="admin@worklogix.com"
                                            required
                                            value={newAdmin.email}
                                            onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Temporary Password</label>
                                        <input
                                            className="input-field"
                                            type="password"
                                            placeholder="********"
                                            required
                                            value={newAdmin.password}
                                            onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-5">
                                        Define Section Access
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {sections.map(section => (
                                            <label
                                                key={section}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${newAdmin.permissions.includes(section)
                                                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
                                                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newAdmin.permissions.includes(section)}
                                                    onChange={() => handlePermissionChange(section)}
                                                    className="sr-only"
                                                />
                                                <span>{section}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Create Account & Assign Rights
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementView;
