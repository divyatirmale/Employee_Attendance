import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EmployeesView from './EmployeesView';
import TasksView from './TasksView';
import LeavesManagementView from './LeavesManagementView';
import HelpdeskAdminView from './HelpdeskAdminView';
import PayslipAdminView from './PayslipAdminView';
import EmployeeInfoAdminView from './EmployeeInfoAdminView';
import AttendanceAdminView from './AttendanceAdminView';
import DocumentAdminView from './DocumentAdminView';
import AdminManagementView from './AdminManagementView';
import { 
  Users, Calendar, Clock, CheckSquare, CreditCard,
  PieChart, Bell, Search, LogOut, ShieldCheck, FileText,
  HelpCircle, MessageSquare, Shield, Menu, X, Sun, Moon,
  UserPlus
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'Overview') {
      fetchTasks();
      fetchLeaves();
      fetchTickets();
    }
  }, [activeTab]);

  // Close sidebar on tab change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setTickets(res.data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setLeaves(res.data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/leaves/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) fetchLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const allMenuItems = [
    { icon: <PieChart size={20} />, label: "Overview" },
    { icon: <Users size={20} />, label: "Employees" },
    { icon: <Clock size={20} />, label: "Attendance" },
    { icon: <Calendar size={20} />, label: "Leave Requests" },
    { icon: <CreditCard size={20} />, label: "Salary" },
    { icon: <FileText size={20} />, label: "Document Center" },
    { icon: <CheckSquare size={20} />, label: "Tasks & Reviews" },
    { icon: <Users size={20} />, label: "People Info" },
    { icon: <HelpCircle size={20} />, label: "Helpdesk" },
    { icon: <Shield size={20} />, label: "Admin Management" },
  ];

  const menuItems = allMenuItems.filter(item => {
    if (!user.permissions || user.permissions.length === 0) return true;
    return user.permissions.includes(item.label);
  });

  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const activeTickets = tickets.filter(t => t.status === 'Active');

  const statCards = [
    { icon: <Users size={28} />, bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-600 dark:text-sky-400', label: 'Total Employees', value: '124' },
    { icon: <Clock size={28} />, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Present Today', value: '112' },
    { icon: <Calendar size={28} />, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'Pending Leaves', value: pendingLeavesCount },
    { icon: <CheckSquare size={28} />, bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', label: 'Pending Reviews', value: '14' },
  ];

  return (
    <div className="flex h-screen bg-surface dark:bg-slate-900 overflow-hidden">
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-sidebar flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <ShieldCheck size={28} className="text-primary-400" />
          <span className="text-xl font-bold text-white tracking-wide">WorkLogix</span>
        </div>
        
        {/* Profile */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-primary-500/20 text-primary-300 flex items-center justify-center font-semibold text-lg border-2 border-primary-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
            <div className="text-xs text-sidebar-text mt-0.5">
              {(!user.permissions || user.permissions.length === 0) ? 'System Admin' : 'Restricted Admin'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.label)}
              className={`
                w-full flex items-center gap-3 px-5 py-3 text-sm font-medium
                transition-all duration-200 text-left
                ${activeTab === item.label
                  ? 'bg-white/15 text-white border-l-[3px] border-primary-400'
                  : 'text-sidebar-text hover:bg-white/8 hover:text-white border-l-[3px] border-transparent'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-text hover:text-white hover:bg-white/8 transition-all text-sm"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsAddEmployeeOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <UserPlus size={16} />
              <span className="hidden md:inline">Add Employee</span>
            </button>
            {/* Mobile add button */}
            <button 
              onClick={() => setIsAddEmployeeOpen(true)}
              className="sm:hidden p-2 bg-sky-600 text-white rounded-lg"
            >
              <UserPlus size={18} />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {activeTab === 'Employees' ? (
            <EmployeesView />
          ) : activeTab === 'Attendance' ? (
            <AttendanceAdminView />
          ) : activeTab === 'Tasks & Reviews' ? (
            <TasksView userRole="admin" />
          ) : activeTab === 'Leave Requests' ? (
            <LeavesManagementView />
          ) : activeTab === 'Helpdesk' ? (
            <HelpdeskAdminView />
          ) : activeTab === 'Salary' ? (
            <PayslipAdminView />
          ) : activeTab === 'Document Center' ? (
            <DocumentAdminView />
          ) : activeTab === 'People Info' ? (
            <EmployeeInfoAdminView />
          ) : activeTab === 'Admin Management' ? (
            <AdminManagementView />
          ) : activeTab === 'Overview' ? (
            <>
              {/* WELCOME BANNER */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Welcome back, Admin!
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                  Here is what's happening across your employees today.
                </p>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {statCards.map((stat, idx) => (
                  <div key={idx} className="card p-4 md:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                        <span className={stat.text}>{stat.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MANAGEMENT PANELS */}
              <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
                
                {/* Helpdesk */}
                <div className="card p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white">Recent Helpdesk Requests</h3>
                    <button 
                      onClick={() => setActiveTab('Helpdesk')}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activeTickets.length > 0 ? (
                      activeTickets.slice(0, 3).map(ticket => (
                        <div key={ticket._id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                              <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{ticket.subject}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.employeeId?.name} • {ticket.category}</p>
                            </div>
                          </div>
                          <span className={`badge text-[10px] px-2 py-0.5 ${
                            (ticket.priority || 'Medium').toLowerCase() === 'high' 
                              ? 'badge-rejected' 
                              : (ticket.priority || 'Medium').toLowerCase() === 'low'
                              ? 'badge-approved'
                              : 'badge-pending'
                          }`}>
                            {ticket.priority || 'Medium'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                        No active tickets.
                      </div>
                    )}
                  </div>
                </div>

                {/* Leave Requests */}
                <div className="card p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white">Recent Leave Requests</h3>
                    <button 
                      onClick={() => setActiveTab('Leave Requests')}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      Manage All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {leaves.filter(l => l.status === 'Pending').length > 0 ? (
                      leaves.filter(l => l.status === 'Pending').slice(0, 3).map(leave => (
                        <div key={leave._id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0 text-sm font-semibold text-pink-600 dark:text-pink-400">
                              {leave.employeeId?.name ? leave.employeeId.name.charAt(0).toUpperCase() : 'L'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                {leave.employeeId?.name || 'Employee'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {leave.leaveType} ({new Date(leave.fromDate).toLocaleDateString()})
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => updateStatus(leave._id, 'Approved')}
                            className="btn-primary text-xs px-3 py-1.5 rounded-md shrink-0"
                          >
                            Approve
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                        No pending requests.
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Management - full width */}
                <div className="card p-5 md:p-6 lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-white">Employee Task Assignments</h3>
                    <button 
                      onClick={() => setActiveTab('Tasks & Reviews')}
                      className="btn-primary text-sm px-4 py-2 rounded-lg self-start"
                    >
                      View All Tasks
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks.length > 0 ? (
                      tasks.slice(0, 5).map(task => (
                        <div key={task._id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{task.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Assigned to: {task.assignedTo?.name || 'Unassigned'} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <span className={`badge shrink-0 ${
                            task.status?.toLowerCase() === 'completed' ? 'badge-approved' :
                            task.status?.toLowerCase() === 'in-progress' ? 'badge-present' :
                            'badge-pending'
                          }`}>
                            {task.status || 'Pending'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                        <CheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                        No tasks assigned yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <h2 className="text-xl font-semibold">{activeTab} Module - Coming Soon</h2>
            </div>
          )}
        </div>
      </main>

      <AddEmployeeModal 
        isOpen={isAddEmployeeOpen} 
        onClose={() => setIsAddEmployeeOpen(false)} 
      />
    </div>
  );
};

export default AdminDashboard;