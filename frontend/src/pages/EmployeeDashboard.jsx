import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { useTheme } from '../context/ThemeContext';
import EngageView from './EngageView';
import TasksView from './TasksView';
import LeaveApplyView from './LeaveApplyView';
import LeaveCalendarView from './LeaveCalendarView';
import HolidayCalendarView from './HolidayCalendarView';
import HelpdeskView from './HelpdeskView';
import PayslipsView from './PayslipsView';
import MyInfoView from './MyInfoView';
import AttendanceView from './AttendanceView';
import DocumentCenterView from './DocumentCenterView';
import PeopleView from './PeopleView';
import SettingsView from './SettingsView';
import {
  Home, MessageSquare, CheckSquare, CreditCard, Calendar, Clock,
  FileText, Users, HelpCircle, Bell, Search, Settings, Sun,
  ChevronDown, ChevronUp, LogOut, Menu, X, Moon, Coffee, ArrowRight
} from 'lucide-react';
import api from '../utils/axios';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Home');
  const [tasks, setTasks] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState(['Leave']);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Close sidebar on tab change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      if (res.data.success) setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const toggleMenu = (label) => {
    setExpandedMenus(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const greeting = time.getHours() < 12 ? 'Morning' : time.getHours() < 17 ? 'Afternoon' : 'Evening';

  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <MessageSquare size={20} />, label: "Engage" },
    { icon: <CheckSquare size={20} />, label: "To do" },
    {
      icon: <CreditCard size={20} />,
      label: "Salary",
      subItems: ["Payslips"]
    },
    {
      icon: <Calendar size={20} />,
      label: "Leave",
      subItems: ["Leave Apply", "Leave Calendar", "Holiday Calendar"]
    },
    {
      icon: <Clock size={20} />,
      label: "Attendance",
      subItems: ["Attendance Info"]
    },
    { icon: <FileText size={20} />, label: "Document Center" },
    { icon: <Users size={20} />, label: "People" },
    { icon: <HelpCircle size={20} />, label: "Helpdesk" },
  ];

  const hasSubItems = (item) => item.subItems && item.subItems.length > 0;
  const isMenuActive = (item) => activeTab === item.label || item.subItems?.includes(activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <>
            {/* Greeting */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
                Good {greeting}, {user?.name || 'Employee'}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                You have {tasks.length} pending tasks for today. Keep up the great work!
              </p>
            </div>

            {/* Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 md:p-8 mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Plan Your Time Off</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  Submit leave requests, check balances, and view holiday calendars in the Leave section.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('Leave Apply')}
                className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0"
              >
                Apply Leave
              </button>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Pending Tasks Card */}
              <div className="card p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-200">Pending Tasks</h4>
                  <button
                    onClick={() => setActiveTab('To do')}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                {tasks.length > 0 ? (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{tasks[0].title}</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{tasks[0].description}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                    <CheckSquare size={40} className="mb-3 opacity-40" />
                    <p className="text-sm">Nothing to review.</p>
                  </div>
                )}
              </div>

              {/* Clock Card */}
              <div className="card p-5 md:p-6 bg-slate-50 dark:bg-slate-800/50">
                <div className="text-center">
                  <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-2">{formatDate(time)}</p>
                  <p className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-1 font-mono">{formatTime(time)}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">General Shift</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium">Shift in progress</p>
                </div>
              </div>

              {/* Upcoming Holidays Card */}
              <div className="card p-5 md:p-6 md:col-span-2 lg:col-span-1">
                <h4 className="text-base md:text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Upcoming Holidays</h4>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-14 h-14 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center shrink-0 font-semibold">
                    <span className="text-lg leading-tight">15</span>
                    <span className="text-[10px] leading-tight">Aug</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-800 dark:text-slate-200">Independence Day</h5>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Saturday</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('Holiday Calendar')}
                  className="mt-3 w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium py-2"
                >
                  View Full Calendar
                </button>
              </div>
            </div>
          </>
        );
      case 'Engage':
        return <EngageView />;
      case 'To do':
        return <TasksView userRole="employee" />;
      case 'Leave Apply':
        return <LeaveApplyView />;
      case 'Leave Calendar':
        return <LeaveCalendarView />;
      case 'Holiday Calendar':
        return <HolidayCalendarView />;
      case 'Helpdesk':
        return <HelpdeskView />;
      case 'Payslips':
        return <PayslipsView />;
      case 'My Info':
        return <MyInfoView />;
      case 'Attendance Info':
        return <AttendanceView />;
      case 'Document Center':
        return <DocumentCenterView />;
      case 'People':
        return <PeopleView />;
      case 'Settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <h2 className="text-2xl font-semibold mb-2">{activeTab} Section</h2>
            <p>This module is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-surface dark:bg-slate-900 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Emerald theme */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-emerald-800 to-emerald-700 dark:from-emerald-950 dark:to-emerald-900 flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
            <Coffee size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">WorkLogix</span>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border-2 border-emerald-400/30">
            {user?.ProfileImage ? (
              <img
                src={user.ProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">Hi {user?.name || 'Employee'}</div>
            <button
              onClick={() => setActiveTab('My Info')}
              className="text-xs text-emerald-300 hover:text-white underline transition-colors mt-0.5"
            >
              View My Info
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => hasSubItems(item) ? toggleMenu(item.label) : setActiveTab(item.label)}
                className={`
                  w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium
                  transition-all duration-200 text-left
                  ${isMenuActive(item)
                    ? 'bg-white/15 text-white border-l-[3px] border-emerald-300'
                    : 'text-white/75 hover:bg-white/8 hover:text-white border-l-[3px] border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {hasSubItems(item) && (
                  expandedMenus.includes(item.label)
                    ? <ChevronUp size={16} className="shrink-0" />
                    : <ChevronDown size={16} className="shrink-0" />
                )}
              </button>

              {/* Sub-menu */}
              {hasSubItems(item) && expandedMenus.includes(item.label) && (
                <div className="bg-black/15 py-1">
                  {item.subItems.map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setActiveTab(sub)}
                      className={`
                        w-full text-left pl-14 pr-4 py-2.5 text-sm transition-all
                        ${activeTab === sub
                          ? 'text-white bg-white/8 font-medium'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/8 transition-all text-sm"
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
            <h1 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveTab('Settings')}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className={`flex-1 overflow-y-auto ${activeTab === 'Engage' || activeTab === 'Leave Apply' ? 'p-0' : 'p-4 md:p-6 lg:p-8'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
