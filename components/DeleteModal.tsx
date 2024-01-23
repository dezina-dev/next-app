import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteModal: React.FC<ModalProps> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="bg-white p-8 rounded-md z-10">
        <p>Are you sure you want to delete?</p>
        <div className="flex justify-end mt-4">
          <button className="bg-red-500 text-white px-4 py-2 mr-2" onClick={onConfirm}>
            Confirm
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
