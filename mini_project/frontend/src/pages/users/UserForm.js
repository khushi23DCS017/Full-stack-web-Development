import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { userAPI } from '../../utils/api';
import { withErrorHandling } from '../../utils/errorHandler';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import LoadingState from '../../components/ui/LoadingState';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await withErrorHandling(
        () => userAPI.getUserById(id),
        { customErrorMessage: 'Failed to fetch user details' }
      );
      
      const userData = response.data.data;
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '', // Don't populate password field for security
        role: userData.role,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove empty password field when editing
      const dataToSubmit = {...formData};
      if (isEditMode && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      if (isEditMode) {
        await withErrorHandling(
          () => userAPI.updateUser(id, dataToSubmit),
          {
            showSuccessToast: true,
            successMessage: 'User updated successfully',
            customErrorMessage: 'Failed to update user'
          }
        );
      } else {
        await withErrorHandling(
          () => userAPI.register(dataToSubmit),
          {
            showSuccessToast: true,
            successMessage: 'User created successfully',
            customErrorMessage: 'Failed to create user'
          }
        );
      }
      
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title={isEditMode ? 'Edit User' : 'Create New User'} />
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            
            <FormInput
              label={isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required={!isEditMode}
            />
            
            <FormSelect
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'staff', label: 'Staff' },
                { value: 'admin', label: 'Admin' }
              ]}
              required
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/users')}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;