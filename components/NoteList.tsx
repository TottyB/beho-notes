import React from 'react';
import { Note } from '../types';
import { BellIcon, PlusIcon } from './Icons';
import { NOTE_COLORS, isHexColor, getDynamicListStyle } from '../util/colors';
import QuoteBanner from './QuoteBanner';

interface NoteListProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  showQuotes: boolean;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onSelectNote, onCreateNote, showQuotes }) => {
  const visibleNotes = [...notes]
    .filter(note => !note.isHidden)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp));
  };
  
  const formatReminderDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <div className="relative h-full flex flex-col">
       {showQuotes && <QuoteBanner />}
      {visibleNotes.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-neutral-500 dark:text-neutral-400 p-8">
            <h2 className="text-2xl font-semibold mb-2">No Notes Yet</h2>
            <p>Tap the '+' button to create your first note.</p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 overflow-y-auto">
          {visibleNotes.map(note => {
            const isCustom = isHexColor(note.color || '');
            const style = isCustom ? getDynamicListStyle(note.color!) : {};
            const colorClass = !isCustom 
              ? (NOTE_COLORS[note.color || 'default']?.list || NOTE_COLORS['default'].list) 
              : 'hover:bg-black/5 dark:hover:bg-white/5';
            
            return (
              <li key={note.id}>
                <button
                  onClick={() => onSelectNote(note.id)}
                  className={`w-full text-left p-4 transition-colors duration-200 ${colorClass}`}
                  style={style}
                >
                  <h3 className="font-semibold text-lg truncate text-neutral-800 dark:text-neutral-200">{note.title || 'Untitled Note'}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                    {note.content || 'No additional text'}
                  </p>
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                      Last updated: {formatDate(note.updatedAt)}
                    </p>
                    {note.reminder && (
                      <div className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 font-medium">
                        <BellIcon className="w-4 h-4" />
                        <span>{formatReminderDate(note.reminder)}</span>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <button
        onClick={onCreateNote}
        className="absolute bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform transform-gpu"
        aria-label="Create new note"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default NoteList;