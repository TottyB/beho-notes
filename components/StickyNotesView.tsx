
import React from 'react';
import { Note } from '../types';
import { PlusIcon } from './Icons';
import StickyNoteCard from './StickyNoteCard';

interface StickyNotesViewProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-3', '-rotate-1', 'rotate-1'];

const StickyNotesView: React.FC<StickyNotesViewProps> = ({ notes, onSelectNote, onCreateNote }) => {
  const sortedNotes = [...notes]
    .filter(note => !note.isHidden)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="relative h-full p-4 sm:p-6 overflow-y-auto bg-neutral-200/50 dark:bg-neutral-800/50">
      {sortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 dark:text-neutral-400 p-8">
            <h2 className="text-2xl font-semibold mb-2">No Notes Yet</h2>
            <p>Tap the '+' button to create your first sticky note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {sortedNotes.map((note, index) => (
            <div key={note.id} className={`${rotations[index % rotations.length]}`}>
              <StickyNoteCard note={note} onSelectNote={onSelectNote} />
            </div>
          ))}
        </div>
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

export default StickyNotesView;
