import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import Notification from './Notification';
import { XMarkIcon } from '@heroicons/react/24/outline';

const NotificationContainer = () => {
  const { notifications, removeNotification, clearAllNotifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {/* Clear All Button */}
      {notifications.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={clearAllNotifications}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md flex items-center space-x-1 transition-colors"
          >
            <XMarkIcon className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
      
      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
          show={true}
          autoClose={notification.autoClose}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
