import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import { FileText, CreditCard, Eye, Download, Search, Loader2, ArrowLeft, FolderOpen } from 'lucide-react';

const DocumentCenterView = () => {
    const { user } = useAuth();
    const { dark } = useTheme();
    const [activeTab, setActiveTab] = useState('main');
    const [documents, setDocuments] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (activeTab === 'documents') fetchDocuments();
        if (activeTab === 'payslips') fetchPayslips();
    }, [activeTab]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/documents/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setDocuments(res.data.documents);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayslips = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/payslips/employee/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setPayslips(res.data.payslips);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const categories = ["Qualification", "Accounts & Statutory", "Personal", "Other"];

    // Main Hub View
    if (activeTab === 'main') {
        return (
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Document Center</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Access all your documents and payslips in one place.</p>
                    </div>
                </div>

                {/* Banner */}
                <div className="card mb-8 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border-sky-200 dark:border-sky-800">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">We've got it sorted for you!</h3>
                            <p className="text-slate-600 dark:text-slate-400">All documents are now in one place. Request a new letter if you don't find the one you're looking for.</p>
                        </div>
                        <div className="flex-shrink-0">
                            <FolderOpen size={80} className="text-sky-400 dark:text-sky-500 opacity-60" />
                        </div>
                    </div>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => setActiveTab('documents')}
                        className="card text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                                <FileText size={24} className="text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">Documents</h4>
                                <span className="text-sm text-sky-600 dark:text-sky-400 font-medium">View All →</span>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('payslips')}
                        className="card text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                <CreditCard size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">Payslips</h4>
                                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">View All →</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    // Documents List View
    if (activeTab === 'documents') {
        const filteredDocs = search
            ? documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()))
            : documents;

        return (
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setActiveTab('main'); setSearch(''); }}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Documents</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Document Center / Documents</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10 w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="card">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <Loader2 size={24} className="animate-spin mr-3" />
                            <span>Loading documents...</span>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">No documents found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {categories.map(cat => {
                                const catDocs = filteredDocs.filter(d => d.category === cat);
                                if (catDocs.length === 0) return null;
                                return (
                                    <div key={cat}>
                                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                                            {cat}
                                        </h3>
                                        <div className="space-y-2">
                                            {catDocs.map(doc => (
                                                <div
                                                    key={doc._id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <FileText size={18} className="text-slate-400 flex-shrink-0" />
                                                        <span className="text-slate-700 dark:text-slate-300 truncate">{doc.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                                        <button
                                                            onClick={() => window.open(doc.fileUrl)}
                                                            className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(doc.fileUrl, doc.name)}
                                                            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Payslips List View
    if (activeTab === 'payslips') {
        return (
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveTab('main')}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payslips</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Document Center / Payslips</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <Loader2 size={24} className="animate-spin mr-3" />
                            <span>Loading payslips...</span>
                        </div>
                    ) : payslips.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                            <CreditCard size={48} className="mb-4 opacity-50" />
                            <p className="text-lg">No payslips available.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payslips.map(ps => (
                                <div
                                    key={ps._id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                            <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                                                {ps.month} {ps.year}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                Payroll for the month of {ps.month} {ps.year}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                        <button
                                            className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 transition-colors"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default DocumentCenterView;
