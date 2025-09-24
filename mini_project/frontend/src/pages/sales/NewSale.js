import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { productAPI, customerAPI, saleAPI } from '../../utils/api';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/helpers';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';

const NewSale = () => {
  const navigate = useNavigate();
  const { checkLowStock } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const [saleData, setSaleData] = useState({
    customer: '',
    items: [],
    subtotal: 0,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 0.18,
    taxAmount: 0,
    total: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    notes: ''
  });


  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' }
  ];

  const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customers
        const customersRes = await customerAPI.getAllCustomers('?limit=100');
        setCustomers(customersRes.data.data);

        // Fetch products
        const productsRes = await productAPI.getAllProducts('?limit=100');
        setProducts(productsRes.data.data);

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load required data. Please try again.');
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Calculate totals whenever items, discount or tax changes
  useEffect(() => {
    const subtotal = saleData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * saleData.discountRate;
    const taxAmount = (subtotal - discountAmount) * saleData.taxRate;
    const total = subtotal - discountAmount + taxAmount;
    
    setSaleData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  }, [saleData.items, saleData.discountRate, saleData.taxRate]);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    if (!productId) return;
    
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    // Check if product is already in the list
    const existingIndex = saleData.items.findIndex(item => item.product === productId);
    
    if (existingIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...saleData.items];
      updatedItems[existingIndex].quantity += 1;
      setSaleData(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new product to the list
      const newItem = {
        product: productId,
        name: product.name,
        price: product.sellingPrice,
        quantity: 1
      };
      setSaleData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    
    // Reset the select input
    setSelectedProducts([...selectedProducts, productId]);
    e.target.value = '';
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...saleData.items];
    const removedItem = updatedItems[index];
    updatedItems.splice(index, 1);
    setSaleData(prev => ({ ...prev, items: updatedItems }));
    
    // Remove from selected products
    setSelectedProducts(selectedProducts.filter(id => id !== removedItem.product));
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...saleData.items];
    updatedItems[index].quantity = newQuantity;
    setSaleData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setSaleData(prev => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleRateInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 1) {
      setSaleData(prev => ({ ...prev, [name]: numericValue }));
    }
  };


  const validateSaleForm = () => {
    if (saleData.items.length === 0) {
      toast.error('Please add at least one product');
      return false;
    }
    
    if (saleData.total <= 0) {
      toast.error('Total amount must be greater than zero');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSaleForm()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Format the sale data for API
      const formattedSaleData = {
        customer: saleData.customer || null, // null for walk-in customer
        items: saleData.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal: saleData.subtotal,
        discountRate: saleData.discountRate,
        discountAmount: saleData.discountAmount,
        taxRate: saleData.taxRate,
        taxAmount: saleData.taxAmount,
        total: saleData.total,
        paymentMethod: saleData.paymentMethod,
        paymentStatus: saleData.paymentStatus,
        notes: saleData.notes
      };
      
      console.log('Sending sale data:', formattedSaleData);
      console.log('Items being sent:', formattedSaleData.items);
      
      const response = await saleAPI.createSale(formattedSaleData);
      toast.success('Sale created successfully');
      
      // Check for low stock products after sale
      try {
        const productsRes = await productAPI.getAllProducts();
        if (productsRes && productsRes.data && productsRes.data.data) {
          checkLowStock(productsRes.data.data);
        }
      } catch (err) {
        console.error('Error checking low stock after sale:', err);
      }
      
      // Navigate to the sale details page
      navigate(`/sales/${response.data.data._id}`);
    } catch (err) {
      console.error('Error creating sale:', err);
      setError('Failed to create sale. Please try again.');
      toast.error('Error creating sale');
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

  const availableProducts = products.filter(product => 
    !selectedProducts.includes(product._id) && product.stockQuantity > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">New Sale</h1>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/sales')}
        >
          Cancel
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card title="Customer Information">
              <div className="p-6 space-y-4">
                <FormSelect
                  label="Select Customer"
                  name="customer"
                  value={saleData.customer}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Walk-in Customer' },
                    ...customers.map(c => ({ value: c._id, label: `${c.name} (${c.phone})` }))
                  ]}
                />
              </div>
            </Card>

            {/* Product Selection */}
            <Card title="Products">
              <div className="p-6 space-y-6">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <FormSelect
                      label="Add Product"
                      onChange={handleProductSelect}
                      options={[
                        { value: '', label: 'Select a product' },
                        ...availableProducts.map(p => ({ 
                          value: p._id, 
                          label: `${p.name} (${formatCurrency(p.sellingPrice)}) - ${p.stockQuantity} in stock` 
                        }))
                      ]}
                      disabled={availableProducts.length === 0}
                    />
                  </div>
                </div>

                {/* Product List */}
                {saleData.items.length > 0 ? (
                  <div className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {saleData.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <MinusIcon className="h-4 w-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                    className="w-16 text-center border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  />
                                  <button
                                    type="button"
                                    className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                  >
                                    <PlusIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No products added yet. Select products from the dropdown above.
                  </div>
                )}
              </div>
            </Card>

            {/* Notes */}
            <Card title="Additional Information">
              <div className="p-6">
                <FormInput
                  label="Notes"
                  name="notes"
                  type="textarea"
                  value={saleData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes or information about this sale"
                  rows={3}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            <Card title="Payment Information">
              <div className="p-6 space-y-4">
                <FormSelect
                  label="Payment Method"
                  name="paymentMethod"
                  value={saleData.paymentMethod}
                  onChange={handleInputChange}
                  options={paymentMethodOptions}
                />

                <FormSelect
                  label="Payment Status"
                  name="paymentStatus"
                  value={saleData.paymentStatus}
                  onChange={handleInputChange}
                  options={paymentStatusOptions}
                />
              </div>
            </Card>

            <Card title="Order Summary">
              <div className="p-6 space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(saleData.subtotal)}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Discount Rate (%):</span>
                  <div className="w-1/3">
                    <FormInput
                      type="number"
                      name="discountRate"
                      value={saleData.discountRate * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setSaleData(prev => ({ ...prev, discountRate: value / 100 }));
                      }}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount Amount:</span>
                  <span className="font-medium">{formatCurrency(saleData.discountAmount)}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Tax Rate (%):</span>
                  <div className="w-1/3">
                    <FormInput
                      type="number"
                      name="taxRate"
                      value={saleData.taxRate * 100}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setSaleData(prev => ({ ...prev, taxRate: value / 100 }));
                      }}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax Amount:</span>
                  <span className="font-medium">{formatCurrency(saleData.taxAmount)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(saleData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/sales')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || saleData.items.length === 0}
              >
                {submitting ? <Spinner size="sm" /> : 'Complete Sale'}
              </Button>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
};

export default NewSale;