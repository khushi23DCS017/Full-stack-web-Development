import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productAPI } from '../../utils/api';
import { useNotification } from '../../context/NotificationContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { addNotification, removeProductNotification, handleStockUpdate } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    modelNumber: '',
    costPrice: '',
    sellingPrice: '',
    stockQuantity: '',
    lowStockThreshold: '',
    image: null
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: 'Limb', label: 'Limb' },
    { value: 'Joint', label: 'Joint' },
    { value: 'Spinal', label: 'Spinal' },
    { value: 'Cranial', label: 'Cranial' },
    { value: 'Dental', label: 'Dental' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProductById(id);
      const product = response.data.data;
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        modelNumber: product.modelNumber || '',
        costPrice: product.costPrice || '',
        sellingPrice: product.sellingPrice || '',
        stockQuantity: product.stockQuantity || '',
        lowStockThreshold: product.lowStockThreshold || '',
        image: null // We don't set the image file here
      });
      
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again.');
      toast.error('Error loading product details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.modelNumber.trim()) newErrors.modelNumber = 'Model number is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.sellingPrice) {
      newErrors.sellingPrice = 'Selling price is required';
    } else if (isNaN(formData.sellingPrice) || Number(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Selling price must be a positive number';
    }
    
    if (!formData.costPrice) {
      newErrors.costPrice = 'Cost price is required';
    } else if (isNaN(formData.costPrice) || Number(formData.costPrice) < 0) {
      newErrors.costPrice = 'Cost price must be a non-negative number';
    }
    
    if (!formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    
    if (!formData.lowStockThreshold) {
      newErrors.lowStockThreshold = 'Low stock threshold is required';
    } else if (isNaN(formData.lowStockThreshold) || Number(formData.lowStockThreshold) < 0) {
      newErrors.lowStockThreshold = 'Low stock threshold must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview for the image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
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
      
      // Create FormData object for file upload
      const productFormData = new FormData();
      
      // Always append required fields
      productFormData.append('name', formData.name || '');
      productFormData.append('modelNumber', formData.modelNumber || '');
      productFormData.append('description', formData.description || '');
      productFormData.append('category', formData.category || '');
      productFormData.append('costPrice', formData.costPrice || '');
      productFormData.append('sellingPrice', formData.sellingPrice || '');
      productFormData.append('stockQuantity', formData.stockQuantity || '');
      productFormData.append('lowStockThreshold', formData.lowStockThreshold || '');
      
      // Add image if exists
      if (formData.image && formData.image instanceof File) {
        productFormData.append('image', formData.image);
      }
      
      // Debug: Log what we're sending
      console.log('Form data being sent:', {
        name: formData.name,
        modelNumber: formData.modelNumber,
        description: formData.description,
        category: formData.category,
        costPrice: formData.costPrice,
        sellingPrice: formData.sellingPrice,
        stockQuantity: formData.stockQuantity,
        lowStockThreshold: formData.lowStockThreshold
      });
      
      if (isEditMode) {
        console.log('Updating product with ID:', id);
        console.log('Form data being sent:', formData);
        console.log('FormData object:', productFormData);
        
        const response = await productAPI.updateProduct(id, productFormData);
        console.log('Update response:', response);
        toast.success('Product updated successfully');
        
        // Handle stock update notifications
        const updatedProduct = {
          _id: id,
          name: formData.name,
          modelNumber: formData.modelNumber,
          stockQuantity: parseInt(formData.stockQuantity),
          lowStockThreshold: parseInt(formData.lowStockThreshold)
        };
        
        console.log('Handling stock update for product:', updatedProduct);
        handleStockUpdate(updatedProduct);
        
        // Also refresh the product list to update low stock status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Convert FormData to object for API
        const productData = {
          name: formData.name,
          modelNumber: formData.modelNumber,
          description: formData.description,
          category: formData.category,
          costPrice: formData.costPrice,
          sellingPrice: formData.sellingPrice,
          stockQuantity: formData.stockQuantity,
          lowStockThreshold: formData.lowStockThreshold,
          image: formData.image
        };
        await productAPI.createProduct(productData);
        toast.success('Product created successfully');
      }
      
      navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
      toast.error('Error saving product');
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
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/products')}
        >
          Cancel
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <FormInput
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            
            {/* Category */}
            <FormSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.category}
              required
            />
            
            {/* Selling Price */}
            <FormInput
              label="Selling Price"
              name="sellingPrice"
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={handleChange}
              error={errors.sellingPrice}
              required
            />
            
            {/* Cost Price */}
            <FormInput
              label="Cost Price"
              name="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={handleChange}
              error={errors.costPrice}
              required
            />
            
            {/* Model Number */}
            <FormInput
              label="Model Number"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              error={errors.modelNumber}
              required
            />
            
            {/* Stock Quantity */}
            <FormInput
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
              required
            />
            
            {/* Low Stock Threshold */}
            <FormInput
              label="Low Stock Threshold"
              name="lowStockThreshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              error={errors.lowStockThreshold}
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
              rows={4}
            />
          </div>
          
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-md bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  JPG, PNG or GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;