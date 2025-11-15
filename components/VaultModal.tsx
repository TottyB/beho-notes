import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import LockScreen from './LockScreen';
import { CloseIcon } from './Icons';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  pin: string | null;
  onSelectNote: (id: string) => void;
}

const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, notes, pin, onSelectNote }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const hiddenNotes = notes.filter(n => n.isHidden).sort((a, b) => b.updatedAt - a.updatedAt);
  
  // Reset lock state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsUnlocked(false), 300); // delay to allow for closing animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    onSelectNote(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-2xl h-full max-h-[80vh] flex flex-col animate-splash-scaleIn">
        {!isUnlocked ? (
          <div className="relative flex-grow">
             <LockScreen 
                mode="enter"
                pinToMatch={pin}
                onSuccess={() => setIsUnlocked(true)}
                title="Enter Vault PIN"
              />
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Hidden Notes Vault</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {hiddenNotes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-neutral-500 dark:text-neutral-400">
                  <p>Your hidden notes will appear here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {hiddenNotes.map(note => (
                    <li key={note.id}>
                      <button
                        onClick={() => handleSelect(note.id)}
                        className="w-full text-left p-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                         <h3 className="font-semibold text-lg truncate text-neutral-800 dark:text-neutral-200">{note.title || 'Untitled Note'}</h3>
                         <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                           {note.content?.substring(0, 100) || 'No additional text'}
                         </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VaultModal;
