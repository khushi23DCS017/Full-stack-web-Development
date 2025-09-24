import { toast } from 'react-toastify';

/**
 * Standardized error handler for API calls
 * @param {Error} error - The error object from axios
 * @param {string} customMessage - Optional custom message to display
 * @param {Function} callback - Optional callback function to execute after error handling
 */
export const handleApiError = (error, customMessage = null, callback = null) => {
  // Get the error message from the response or use a default
  const errorMessage = 
    customMessage || 
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred';
  
  // Log the error for debugging
  console.error('API Error:', errorMessage, error);
  
  // Display toast notification
  toast.error(errorMessage);
  
  // Execute callback if provided
  if (callback && typeof callback === 'function') {
    callback(error);
  }
  
  // Return the error for further handling if needed
  return error;
};

/**
 * Wrapper for async API calls with standardized error handling
 * @param {Function} apiCall - The API function to call
 * @param {Object} options - Options for error handling
 * @returns {Promise} - The result of the API call or throws an error
 */
export const withErrorHandling = async (apiCall, options = {}) => {
  const { 
    customErrorMessage = null,
    onError = null,
    showSuccessToast = false,
    successMessage = 'Operation completed successfully'
  } = options;
  
  try {
    const result = await apiCall();
    
    if (showSuccessToast) {
      toast.success(successMessage);
    }
    
    return result;
  } catch (error) {
    return handleApiError(error, customErrorMessage, onError);
  }
};