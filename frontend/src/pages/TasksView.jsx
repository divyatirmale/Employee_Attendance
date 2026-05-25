import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import {
  Plus,
  Search,
  MoreVertical,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TasksView = ({ userRole }) => {
  const { dark } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const [activeTab, setActiveTab] = useState('Tasks');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
    if (userRole === 'admin') {
      fetchEmployees();
    }
  }, [userRole]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/auth/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication error: Please log out and log in again.");
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/tasks/${editingId}` : '/api/tasks';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(editingId ? "Task updated successfully! ✅" : "Task added successfully! ✅");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
          setEditingId(null);
          fetchTasks();
        }, 1500);
      } else {
        alert(`Server Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network Error: Could not connect to the server.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, { status });
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await api.delete(`/api/tasks/${id}`);
      if (res.data.success) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || task.assignedTo || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setEditingId(task._id);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'Review') {
      return task.status === 'In Review' && matchesSearch;
    }
    return task.status !== 'In Review' && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge badge-success';
      case 'In Progress': return 'badge badge-info';
      case 'In Review': return 'badge badge-warning';
      default: return 'badge';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 self-start">
          <button
            onClick={() => setActiveTab('Tasks')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'Tasks'
              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('Review')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'Review'
              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
          >
            Review
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add new task
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <Loader2 size={24} className="animate-spin mr-3" />
            <span className="text-lg">Loading tasks...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <CheckCircle2 size={64} className="mb-4 opacity-30" />
            <h3 className="text-lg font-medium">{activeTab === 'Review' ? 'No tasks in review' : 'No tasks found'}</h3>
            <p className="text-sm mt-1">
              {activeTab === 'Review'
                ? 'There are currently no tasks waiting for review.'
                : "You haven't added any tasks yet. Start by creating a new task."}
            </p>
            {activeTab === 'Tasks' && (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4">
                Add new task
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Assignee</th>
                  {userRole === 'admin' && <th>Created By</th>}
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">{task.title}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 max-w-[200px] truncate">{task.description}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-semibold">
                          {task.assignedTo?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    {userRole === 'admin' && (
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-semibold">
                            {task.createdBy?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300">{task.createdBy?.name || 'Unknown'}</span>
                        </div>
                      </td>
                    )}
                    <td>
                      <span className={`badge text-xs ${task.priority === 'High' ? 'badge-danger' :
                        task.priority === 'Medium' ? 'badge-warning' : 'badge'
                        }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar size={14} />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        className="text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(task)}
                          title="Edit Task"
                          className="p-1.5 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          title="Delete Task"
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <AlertCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Task Slideover Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 h-full shadow-2xl overflow-y-auto animate-[slideInRight_0.25s_ease-out]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {editingId ? 'Edit Task' : 'Add Task'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingId(null); setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' }); }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {successMsg && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-sm font-semibold text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAddTask} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Task Name*</label>
                <input
                  type="text"
                  placeholder="e.g. Collect documents"
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="input-field"
                />
              </div>

              {userRole === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Assignee</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id || emp._id} value={emp.id || emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <label
                      key={p}
                      className={`flex-1 px-4 py-2.5 rounded-lg border-2 cursor-pointer text-center text-sm font-medium transition-all ${newTask.priority === p
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
                        : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={newTask.priority === p}
                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Description</label>
                <textarea
                  placeholder="Write a description..."
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="input-field"
                  rows={4}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
