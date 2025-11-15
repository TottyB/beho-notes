import React from 'react';

interface ConfirmDeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ onConfirm, onCancel }) => {
  // We stop propagation to prevent clicks inside the dialog from closing it,
  // based on the background click-to-close handler.
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel} // Close on background click
    >
      <div 
        className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-sm animate-splash-scaleIn"
        style={{ animationDuration: '0.3s' }}
        onClick={handleDialogClick}
      >
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Delete Note</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete this note permanently? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md font-semibold text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
