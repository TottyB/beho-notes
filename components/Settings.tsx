import React, { useState } from 'react';
import { Theme, UserProfile } from '../types';
import { CloseIcon, UserIcon } from './Icons';
import LockScreen from './LockScreen';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  // Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  showDailyQuote: boolean;
  setShowDailyQuote: (show: boolean) => void;
  // Profile
  userProfile: UserProfile | null;
  // Security
  isBiometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  pin: string | null;
  setPin: (pin: string | null) => void;
  autoLockDuration: number;
  setAutoLockDuration: (duration: number) => void;
  resetSecurity: () => void;
  // Data
  resetApp: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen, onClose, theme, setTheme, font, setFont, fontSize, setFontSize,
  showDailyQuote, setShowDailyQuote, userProfile, isBiometricEnabled,
  setBiometricEnabled, pin, setPin, autoLockDuration, setAutoLockDuration, 
  resetApp, resetSecurity
}) => {
  const [isChangingPin, setIsChangingPin] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handlePinSet = (newPin: string) => {
    setPin(newPin);
    setIsChangingPin(false);
  }

  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset all app data? This action is irreversible.")) {
        resetApp();
    }
  }
  
  const autoLockOptions = [
    { label: 'Never', value: 0 },
    { label: '1 Minute', value: 60000 },
    { label: '5 Minutes', value: 300000 },
    { label: '15 Minutes', value: 900000 },
  ];
  
  const themeOptions: { id: Theme; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'amoled', label: 'AMOLED' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {isChangingPin && (
          <LockScreen 
              mode="set"
              onSuccess={() => {}}
              onPinSet={handlePinSet}
              title={pin ? "Change PIN" : "Set new PIN"}
          />
      )}
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md animate-splash-scaleIn overflow-hidden flex flex-col max-h-[90vh]"
        style={{ animationDuration: '0.3s' }}
        onClick={handleDialogClick}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Profile Section */}
          <div>
            <h3 className="font-bold text-lg text-indigo-500 dark:text-indigo-400 mb-4">Profile</h3>
            {userProfile && (
              <div className="flex items-center gap-4 bg-neutral-200 dark:bg-neutral-700/50 p-4 rounded-lg">
                <UserIcon className="w-10 h-10 text-neutral-600 dark:text-neutral-300" />
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{userProfile.firstName} {userProfile.lastName}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Age: {userProfile.age}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div>
            <h3 className="font-bold text-lg text-indigo-500 dark:text-indigo-400 mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="biometric-toggle" className={`font-semibold text-neutral-700 dark:text-neutral-300 ${!pin ? 'opacity-50' : ''}`}>Enable Biometrics</label>
                <button
                    id="biometric-toggle"
                    onClick={() => setBiometricEnabled(!isBiometricEnabled)}
                    disabled={!pin}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      isBiometricEnabled && pin ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-600'
                    } ${!pin ? 'cursor-not-allowed' : ''}`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      isBiometricEnabled && pin ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </div>
              <button
                onClick={() => setIsChangingPin(true)}
                disabled={!pin}
                className="w-full text-left font-semibold text-neutral-700 dark:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change PIN
              </button>
               <div className="flex items-center justify-between">
                <label htmlFor="auto-lock" className={`font-semibold text-neutral-700 dark:text-neutral-300 ${!pin ? 'opacity-50' : ''}`}>Auto-lock Timer</label>
                <select 
                  id="auto-lock" 
                  value={autoLockDuration}
                  onChange={(e) => setAutoLockDuration(Number(e.target.value))}
                  disabled={!pin}
                  className="bg-neutral-200 dark:bg-neutral-700 rounded-md p-1 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                >
                  {autoLockOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
               <button
                onClick={resetSecurity}
                className="w-full text-left font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Reset Security
              </button>
            </div>
          </div>

          {/* Appearance Section */}
          <div>
            <h3 className="font-bold text-lg text-indigo-500 dark:text-indigo-400 mb-4">Appearance</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">Theme</label>
                  <div className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-700 p-1 rounded-full">
                     {themeOptions.map(opt => (
                        <button key={opt.id} onClick={() => setTheme(opt.id)} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${theme === opt.id ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-neutral-600 dark:text-neutral-300'}`}>{opt.label}</button>
                     ))}
                  </div>
               </div>
               <div className="flex items-center justify-between">
                <label htmlFor="quotes-toggle" className="font-semibold text-neutral-700 dark:text-neutral-300">Show Daily Quote</label>
                <button
                    id="quotes-toggle"
                    onClick={() => setShowDailyQuote(!showDailyQuote)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      showDailyQuote ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      showDailyQuote ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </div>
            </div>
          </div>
          
           {/* Data Section */}
          <div>
            <h3 className="font-bold text-lg text-indigo-500 dark:text-indigo-400 mb-4">Data Management</h3>
            <button
                onClick={handleResetApp}
                className="w-full text-left font-semibold text-red-600"
            >
                Reset & Erase All Data
            </button>
            <p className="text-xs text-neutral-500 mt-1">This will delete all notes and settings, and you will see the welcome screen again.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;