import React from 'react';
import { LogoIcon } from './Icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 z-50 animate-splash-fadeOut">
      <div className="flex flex-col items-center justify-center animate-splash-scaleIn">
        <LogoIcon className="w-24 h-24" />
        <h1 className="mt-6 text-4xl font-bold tracking-tighter text-neutral-800 dark:text-neutral-200">
          BEHO <span className="font-light text-neutral-600 dark:text-neutral-400">Notes</span>
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
