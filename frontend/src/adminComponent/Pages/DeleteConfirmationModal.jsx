import { FaTimes } from 'react-icons/fa';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName = 'item', itemType = 'item' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-serif">Confirm Deletion</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Are you sure you want to delete this {itemType} "{itemName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm sm:text-base"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;