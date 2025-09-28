import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  FolderOpen,
  Plus,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalProjects: 0,
    completionRate: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Dashboard: Current user:', user);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/tasks?limit=5')
      ]);

      setStats(statsResponse.data);
      setRecentTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'todo': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleAddTask = () => {
    navigate('/tasks');
  };

  const handleAddProject = () => {
    navigate('/projects');
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  const handleViewProjects = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">
            Welcome back, <span className="user-name-highlight">{user?.name || 'User'}</span>! 👋
          </h1>
          <p className="dashboard-subtitle">Here's what's happening with your tasks and projects today.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={handleAddTask}>
            <Plus size={20} />
            Quick Add Task
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card stat-card-primary"
        >
          <div className="stat-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+12% this week</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card stat-card-success"
        >
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+5% this week</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card stat-card-warning"
        >
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
            <div className="stat-trend">
              <Clock size={16} />
              <span>Active now</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stat-card stat-card-info"
        >
          <div className="stat-icon">
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalProjects}</div>
            <div className="stat-label">Projects</div>
            <div className="stat-trend">
              <FolderOpen size={16} />
              <span>Active projects</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Recent Tasks</h3>
            <button className="btn btn-sm btn-secondary" onClick={handleAddTask}>
              <Plus size={16} />
              Add Task
            </button>
          </div>
          <div className="card-content">
            {recentTasks.length === 0 ? (
              <div className="empty-state">
                <CheckSquare size={48} className="empty-icon" />
                <p>No tasks yet. Create your first task to get started!</p>
                <button className="btn btn-primary" onClick={handleAddTask}>
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            ) : (
              <div className="task-list">
                {recentTasks.map((task) => (
                  <div key={task._id} className="task-item">
                    <div className="task-info">
                      <h4 className="task-title">{task.title}</h4>
                      <p className="task-description">{task.description}</p>
                    </div>
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
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(task.status) + '20',
                          color: getStatusColor(task.status)
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={handleAddTask}>
                <Plus size={20} />
                <span>New Task</span>
              </button>
              <button className="quick-action-btn" onClick={handleAddProject}>
                <FolderOpen size={20} />
                <span>New Project</span>
              </button>
              <button className="quick-action-btn" onClick={handleViewTasks}>
                <Calendar size={20} />
                <span>View Tasks</span>
              </button>
              <button className="quick-action-btn" onClick={handleViewProjects}>
                <BarChart3 size={20} />
                <span>View Projects</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="card-title">Progress Overview</h3>
        </div>
        <div className="card-content">
          <div className="progress-overview">
            <div className="progress-item">
              <div className="progress-label">
                <span>Completed Tasks</span>
                <span>{stats.completedTasks}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`,
                    backgroundColor: '#10b981'
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>In Progress</span>
                <span>{stats.inProgressTasks}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%`,
                    backgroundColor: '#3b82f6'
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>To Do</span>
                <span>{stats.todoTasks}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${stats.totalTasks > 0 ? (stats.todoTasks / stats.totalTasks) * 100 : 0}%`,
                    backgroundColor: '#6b7280'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
