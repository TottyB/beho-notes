
import React from 'react';
import BottomNav from './BottomNav';
import { View } from '../types';
import { LogoIcon, SettingsIcon, ShieldIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  view: View;
  setView: (view: View) => void;
  openSettings: () => void;
  openVault: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, openSettings, openVault }) => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 h-screen w-screen flex flex-col font-sans overflow-hidden">
      <header className="flex-shrink-0 bg-neutral-200/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-300 dark:border-neutral-800 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8"/>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
            Beho <span className="font-light text-neutral-600 dark:text-neutral-400">Notes</span>
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {(view === 'notes' || view === 'sticky') && (
             <button
              onClick={openVault}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
              aria-label="Open hidden notes vault"
            >
              <ShieldIcon className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={openSettings}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition-colors duration-200"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      
      <footer className="flex-shrink-0 z-10">
        <BottomNav activeView={view} setActiveView={setView} />
      </footer>
    </div>
  );
};

export default Layout;