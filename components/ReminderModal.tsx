import React, { useState, useEffect } from 'react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReminder: number | null | undefined;
  onSetReminder: (timestamp: number) => void;
  onClearReminder: () => void;
}

// Helper to format timestamp for datetime-local input
const formatTimestampForInput = (timestamp: number | null | undefined): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  // Adjust for timezone offset to display local time correctly
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
};

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  currentReminder,
  onSetReminder,
  onClearReminder,
}) => {
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    setReminderDate(formatTimestampForInput(currentReminder));
  }, [currentReminder, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSetClick = () => {
    if (!reminderDate) {
      alert('Please select a date and time.');
      return;
    }
    const timestamp = new Date(reminderDate).getTime();
    if (timestamp <= Date.now()) {
        alert('Please select a time in the future.');
        return;
    }
    onSetReminder(timestamp);
    onClose();
  };
  
  const handleClearClick = () => {
    onClearReminder();
    onClose();
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const getMinDateTime = () => {
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000;
      const localDate = new Date(now.getTime() - timezoneOffset);
      return localDate.toISOString().slice(0, 16);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-sm animate-splash-scaleIn"
        style={{ animationDuration: '0.3s' }}
        onClick={handleDialogClick}
      >
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Set Reminder</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          You will be notified at the selected time.
        </p>
        
        <input
          type="datetime-local"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          min={getMinDateTime()}
          className="mt-4 w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="mt-6 flex justify-between items-center gap-4">
          <div>
            {currentReminder && (
              <button
                onClick={handleClearClick}
                className="px-4 py-2 rounded-md font-semibold text-red-600 bg-transparent hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md font-semibold text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSetClick}
              className="px-4 py-2 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
