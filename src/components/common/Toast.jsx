import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const toastTypes = {
  success: {
    icon: '✓',
    className: 'bg-green-50 text-green-800 border-green-200',
    iconClass: 'bg-green-100 text-green-600',
  },
  error: {
    icon: '✕',
    className: 'bg-red-50 text-red-800 border-red-200',
    iconClass: 'bg-red-100 text-red-600',
  },
  warning: {
    icon: '!',
    className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconClass: 'bg-yellow-100 text-yellow-600',
  },
  info: {
    icon: 'i',
    className: 'bg-blue-50 text-blue-800 border-blue-200',
    iconClass: 'bg-blue-100 text-blue-600',
  },
};

export default function Toast({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000,
  action,
  actionLabel,
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const { icon, className, iconClass } = toastTypes[type] || toastTypes.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg border shadow-lg max-w-md ${className}`}
      >
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${iconClass}`}>
          {icon}
        </div>
        <div className="flex-1 mr-2">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {action && actionLabel && (
          <button
            onClick={action}
            className="ml-4 px-3 py-1 text-sm font-medium rounded-md hover:bg-opacity-80
              bg-white bg-opacity-20"
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          className="ml-4 text-sm font-medium opacity-60 hover:opacity-100"
        >
          Dismiss
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
