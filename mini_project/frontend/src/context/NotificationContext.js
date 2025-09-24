import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'warning',
      title: 'Low Stock Alert',
      message: notification.message,
      autoClose: true,
      duration: 8000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const checkLowStock = useCallback((products) => {
    const lowStockProducts = products.filter(product => 
      product.stockQuantity <= product.lowStockThreshold
    );

    // Get current low stock product IDs
    const currentLowStockIds = lowStockProducts.map(p => p._id);
    
    // Remove notifications for products that are no longer low stock
    setNotifications(prev => {
      const updatedNotifications = prev.filter(notification => {
        // Keep notifications that don't have a productId (general notifications)
        if (!notification.productId) return true;
        
        // Keep notifications for products that are still low stock
        if (currentLowStockIds.includes(notification.productId)) return true;
        
        // Remove low stock notifications for products that are no longer low stock
        if (notification.type === 'warning' && notification.title === 'Low Stock Alert') {
          return false;
        }
        
        // Keep other types of notifications
        return true;
      });
      
      return updatedNotifications;
    });

    // Add new notifications for products that are now low stock
    lowStockProducts.forEach(product => {
      // Check if notification already exists for this product
      const existingNotification = notifications.find(n => 
        n.productId === product._id && n.type === 'warning' && n.title === 'Low Stock Alert'
      );
      
      if (!existingNotification) {
        addNotification({
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${product.name} (${product.modelNumber}) is running low on stock. Current: ${product.stockQuantity}, Threshold: ${product.lowStockThreshold}`,
          productId: product._id
        });
      }
    });

    return lowStockProducts;
  }, [addNotification, notifications]);

  const removeProductNotification = useCallback((productId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.productId !== productId)
    );
  }, []);

  const checkRestockedProducts = useCallback((products) => {
    // This function can be called after product updates to check for restocked items
    const restockedProducts = products.filter(product => {
      // Check if there's a low stock notification for this product
      const hasLowStockNotification = notifications.some(n => 
        n.productId === product._id && n.type === 'warning' && n.title === 'Low Stock Alert'
      );
      
      // Check if product is now above threshold
      const isAboveThreshold = product.stockQuantity > product.lowStockThreshold;
      
      return hasLowStockNotification && isAboveThreshold;
    });

    // Remove low stock notifications for restocked products and add success notifications
    restockedProducts.forEach(product => {
      removeProductNotification(product._id);
      addNotification({
        type: 'success',
        title: 'Stock Replenished',
        message: `${product.name} (${product.modelNumber}) stock has been replenished above the threshold. Current: ${product.stockQuantity}, Threshold: ${product.lowStockThreshold}`,
        productId: product._id,
        duration: 6000
      });
    });

    return restockedProducts;
  }, [notifications, removeProductNotification, addNotification]);

  const handleStockUpdate = useCallback((updatedProduct) => {
    console.log('handleStockUpdate called with:', updatedProduct);
    console.log('Current notifications:', notifications);
    
    // This function handles individual product stock updates
    const isAboveThreshold = updatedProduct.stockQuantity > updatedProduct.lowStockThreshold;
    console.log('Is above threshold:', isAboveThreshold);
    
    // Check if there's an existing low stock notification for this product
    const hasLowStockNotification = notifications.some(n => 
      n.productId === updatedProduct._id && n.type === 'warning' && n.title === 'Low Stock Alert'
    );
    console.log('Has low stock notification:', hasLowStockNotification);
    
    if (hasLowStockNotification && isAboveThreshold) {
      console.log('Removing low stock notification and adding success notification');
      // Remove the low stock notification
      removeProductNotification(updatedProduct._id);
      
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Stock Replenished',
        message: `${updatedProduct.name} (${updatedProduct.modelNumber}) stock has been replenished above the threshold. Current: ${updatedProduct.stockQuantity}, Threshold: ${updatedProduct.lowStockThreshold}`,
        productId: updatedProduct._id,
        duration: 6000
      });
    } else if (!hasLowStockNotification && !isAboveThreshold) {
      console.log('Adding low stock notification');
      // Add low stock notification if product is now below threshold
      addNotification({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${updatedProduct.name} (${updatedProduct.modelNumber}) is running low on stock. Current: ${updatedProduct.stockQuantity}, Threshold: ${updatedProduct.lowStockThreshold}`,
        productId: updatedProduct._id
      });
    } else {
      console.log('No notification action needed');
    }
  }, [notifications, removeProductNotification, addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    checkLowStock,
    removeProductNotification,
    checkRestockedProducts,
    handleStockUpdate
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
