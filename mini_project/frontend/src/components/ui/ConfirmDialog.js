import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = '',
  size = 'sm'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          variant="danger"
          className={`w-full sm:w-auto sm:ml-3 ${confirmButtonClass}`}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
        <Button
          variant="outline"
          className="mt-3 w-full sm:w-auto sm:mt-0"
          onClick={onClose}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;