
import React from 'react';
import { View } from '../types';
import { CalculatorIcon, NotesIcon, StickyNotesIcon } from './Icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'notes', label: 'Notes', icon: <NotesIcon className="w-6 h-6" /> },
    { view: 'sticky', label: 'Sticky', icon: <StickyNotesIcon className="w-6 h-6" /> },
    { view: 'calculator', label: 'Calculator', icon: <CalculatorIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="bg-neutral-200/80 dark:bg-neutral-950/80 backdrop-blur-sm border-t border-neutral-300 dark:border-neutral-800 flex justify-around items-center">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className={`flex flex-col items-center justify-center w-full h-16 transition-colors duration-200 ${
            activeView === item.view
              ? 'text-indigo-500'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-indigo-500 dark:hover:text-indigo-400'
          }`}
        >
          {item.icon}
          <span className="text-xs font-medium mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;