import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FolderOpen, 
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject._id}`, formData);
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', formData);
        toast.success('Project created successfully');
      }
      setShowAddModal(false);
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        color: '#3B82F6'
      });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${projectId}`);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Organize your work into projects and track progress</p>
          <div className="project-stats">
            <div className="stat-item">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{projects.filter(p => p.status === 'active').length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{projects.filter(p => p.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Create Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={64} className="empty-icon" />
            <h3>No projects yet</h3>
            <p>Create your first project to organize your tasks</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Create Project
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="project-card"
              style={{ borderLeftColor: project.color }}
            >
              <div className="project-header">
                <div className="project-icon" style={{ backgroundColor: project.color }}>
                  <FolderOpen size={20} />
                </div>
                <div className="project-actions">
                  <button
                    className="action-btn"
                    onClick={() => {
                      setEditingProject(project);
                      setFormData({
                        name: project.name,
                        description: project.description,
                        color: project.color
                      });
                      setShowAddModal(true);
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDelete(project._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="project-content">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-meta">
                  <div className="project-stats">
                    <div className="stat">
                      <Calendar size={16} />
                      <span>0 Tasks</span>
                    </div>
                    <div className="stat">
                      <Calendar size={16} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="project-footer">
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: '0%',
                        backgroundColor: project.color
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">0% Complete</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Project Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProject(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  placeholder="Enter project name"
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
                  placeholder="Enter project description"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Project Color</label>
                <div className="color-picker">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
