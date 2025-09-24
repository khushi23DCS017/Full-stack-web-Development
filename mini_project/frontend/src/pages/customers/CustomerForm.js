import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAPI } from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    doctorReference: {
      name: '',
      hospital: '',
      phone: ''
    },
    medicalHistory: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerAPI.getCustomerById(id);
      const customer = response.data.data;
      
      setFormData({
        name: customer.name || '',
        age: customer.age || '',
        gender: customer.gender || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        doctorReference: customer.doctorReference || {
          name: '',
          hospital: '',
          phone: ''
        },
        medicalHistory: customer.medicalHistory || ''
      });
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again.');
      toast.error('Error loading customer details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || Number(formData.age) <= 0) {
      newErrors.age = 'Age must be a positive number';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { 
          street: prev.address?.street || '',
          city: prev.address?.city || '',
          state: prev.address?.state || '',
          zipCode: prev.address?.zipCode || '',
          country: prev.address?.country || '',
          ...prev.address,
          [field]: value 
        }
      }));
    } else if (name.startsWith('doctorReference.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        doctorReference: { 
          name: prev.doctorReference?.name || '',
          hospital: prev.doctorReference?.hospital || '',
          phone: prev.doctorReference?.phone || '',
          ...prev.doctorReference,
          [field]: value 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditMode) {
        await customerAPI.updateCustomer(id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerAPI.createCustomer(formData);
        toast.success('Customer created successfully');
      }
      
      navigate('/customers');
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('Failed to save customer. Please try again.');
      toast.error('Error saving customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/customers')}
        >
          Cancel
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <FormInput
              label="Customer Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            
            {/* Age */}
            <FormInput
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
              required
            />
            
            {/* Gender */}
            <FormSelect
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
              error={errors.gender}
              required
            />
            
            {/* Phone */}
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            
            {/* Email */}
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
          
          {/* Address Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Street"
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleChange}
              />
              <FormInput
                label="City"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleChange}
              />
              <FormInput
                label="State"
                name="address.state"
                value={formData.address?.state || ''}
                onChange={handleChange}
              />
              <FormInput
                label="Zip Code"
                name="address.zipCode"
                value={formData.address?.zipCode || ''}
                onChange={handleChange}
              />
              <FormInput
                label="Country"
                name="address.country"
                value={formData.address?.country || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Doctor Reference Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Doctor Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Doctor Name"
                name="doctorReference.name"
                value={formData.doctorReference?.name || ''}
                onChange={handleChange}
              />
              <FormInput
                label="Hospital"
                name="doctorReference.hospital"
                value={formData.doctorReference?.hospital || ''}
                onChange={handleChange}
              />
              <FormInput
                label="Doctor Phone"
                name="doctorReference.phone"
                value={formData.doctorReference?.phone || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Medical History */}
          <div>
            <FormInput
              label="Medical History"
              name="medicalHistory"
              type="textarea"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={4}
              placeholder="Enter any relevant medical history or notes"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : isEditMode ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CustomerForm;