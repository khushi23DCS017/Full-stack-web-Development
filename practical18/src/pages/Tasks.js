import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    category: 'General',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, formData);
        toast.success('Task updated successfully');
      } else {
        await axios.post('/api/tasks', formData);
        toast.success('Task created successfully');
      }
      setShowAddModal(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        category: 'General',
        dueDate: ''
      });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <Check size={16} />;
      case 'in-progress': return <Clock size={16} />;
      case 'todo': return <AlertCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and organize your tasks efficiently</p>
          <div className="task-stats">
            <div className="stat-item">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tasks.filter(t => t.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tasks.filter(t => t.status === 'in-progress').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Add New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="form-select"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={64} className="empty-icon" />
            <h3>No tasks found</h3>
            <p>Create your first task or adjust your filters</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`task-card ${task.priority}-priority ${task.status}`}
            >
              <div className="task-header">
                <div className="task-title-section">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-category">{task.category}</div>
                </div>
                <div className="task-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => {
                      setEditingTask(task);
                      setFormData({
                        title: task.title,
                        description: task.description,
                        priority: task.priority,
                        status: task.status,
                        category: task.category,
                        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
                      });
                      setShowAddModal(true);
                    }}
                    title="Edit Task"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn danger-btn"
                    onClick={() => handleDelete(task._id)}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <span 
                  className="priority-badge"
                  style={{ 
                    backgroundColor: getPriorityColor(task.priority) + '20',
                    color: getPriorityColor(task.priority)
                  }}
                >
                  {task.priority}
                </span>
                
                <span className="status-indicator">
                  {getStatusIcon(task.status)}
                  {task.status.replace('-', ' ')}
                </span>
                
                {task.dueDate && (
                  <span className="due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <div className="task-actions-bottom">
                {task.status !== 'completed' && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleStatusChange(task._id, 'completed')}
                  >
                    <Check size={16} />
                    Mark Complete
                  </button>
                )}
                {task.status === 'todo' && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleStatusChange(task._id, 'in-progress')}
                  >
                    <Clock size={16} />
                    Start Task
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-input form-textarea"
                  placeholder="Enter task description"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
