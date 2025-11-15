import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Note, Theme, View, UserProfile } from './types';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import Calculator from './components/Calculator';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import Settings from './components/Settings';
import StickyNotesView from './components/StickyNotesView';
import OnboardingModal from './components/OnboardingModal';
import LockScreen from './components/LockScreen';
import VaultModal from './components/VaultModal';
import { useInactivityTimer } from './hooks/useInactivityTimer';

interface OnboardingData {
  profile: UserProfile;
  pin: string;
  biometricEnabled: boolean;
}

const App: React.FC = () => {
  // App State
  const [view, setView] = useState<View>('notes');
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  // Onboarding & Profile State
  const [isOnboardingComplete, setIsOnboardingComplete] = useLocalStorage<boolean>('onboardingComplete', false);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  
  // Security State
  const [pin, setPin] = useLocalStorage<string | null>('pin', null);
  const [isLocked, setIsLocked] = useState(!!pin); // Lock the app if a PIN exists
  const [isBiometricEnabled, setBiometricEnabled] = useLocalStorage<boolean>('biometricEnabled', false);
  const [autoLockDuration, setAutoLockDuration] = useLocalStorage<number>('autoLockDuration', 300000); // Default 5 mins

  // Appearance State
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [defaultFont, setDefaultFont] = useLocalStorage<string>('defaultFont', 'default');
  const [defaultFontSize, setDefaultFontSize] = useLocalStorage<number>('defaultFontSize', 16);
  const [showDailyQuote, setShowDailyQuote] = useLocalStorage<boolean>('showDailyQuote', true);

  // Auto-lock timer
  useInactivityTimer(() => {
    if (pin && !isLocked) {
      setIsLocked(true);
    }
  }, autoLockDuration);

  useEffect(() => {
    const root = window.document.documentElement;
    const styleId = 'amoled-theme-overrides';
    let styleTag = document.getElementById(styleId);

    root.classList.remove('light', 'dark', 'amoled');
    if (styleTag) styleTag.remove();

    if (theme === 'light') {
      root.classList.add('light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f5f5f5');
    } else { // dark or amoled
      root.classList.add('dark');
      if (theme === 'amoled') {
        root.classList.add('amoled');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000');
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.innerHTML = `
          .amoled.dark .dark\\:bg-neutral-900,
          .amoled.dark .dark\\:bg-neutral-950 { background-color: #000; }
          .amoled.dark .dark\\:bg-neutral-800 { background-color: #111; }
          .amoled.dark .dark\\:border-neutral-800 { border-color: #222; }
          .amoled.dark .dark\\:bg-neutral-950\\/80 { background-color: rgba(0,0,0,0.8); }
        `;
        document.head.appendChild(styleTag);
      } else {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1a1a1a');
      }
    }
  }, [theme]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now();
      let remindersToClear = false;
      
      notes.forEach(note => {
        if (note.reminder && note.reminder <= now) {
          remindersToClear = true;
          if (Notification.permission === 'granted') {
            const notification = new Notification(note.title || 'Note Reminder', {
              body: note.content ? note.content.substring(0, 100) + '...' : 'Open the note to see details.',
              icon: '/icon-192x192.png',
              tag: note.id,
            });
            notification.onclick = () => {
              setView('notes');
              setActiveNoteId(note.id);
              window.focus();
            };
          }
        }
      });
    
      if (remindersToClear) {
        setNotes(prevNotes => 
          prevNotes.map(note => {
            if (note.reminder && note.reminder <= now) {
              const { reminder, ...rest } = note;
              return rest;
            }
            return note;
          })
        );
      }
    };

    const intervalId = setInterval(checkReminders, 15000);
    return () => clearInterval(intervalId);
  }, [notes, setNotes]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserProfile(data.profile);
    setPin(data.pin);
    setBiometricEnabled(data.biometricEnabled);
    setIsOnboardingComplete(true);
    setIsLocked(false); // Unlock after onboarding
  };

  const handleSaveNote = (noteToSave: Note, closeEditor: boolean = true) => {
    const existingNoteIndex = notes.findIndex(n => n.id === noteToSave.id);
    if (existingNoteIndex > -1) {
      const updatedNotes = [...notes];
      updatedNotes[existingNoteIndex] = { ...noteToSave, updatedAt: Date.now() };
      setNotes(updatedNotes);
    } else {
      setNotes([...notes, { ...noteToSave, createdAt: Date.now(), updatedAt: Date.now() }]);
    }
    if (closeEditor) {
      setActiveNoteId(null);
    }
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      font: defaultFont,
      fontSize: defaultFontSize,
      reminder: null,
      isHidden: false,
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    setActiveNoteId(null);
  };
  
  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const resetSecurity = () => {
    if (confirm("Are you sure? This will remove your PIN and biometric settings, and you will be prompted to set them up again.")) {
      localStorage.removeItem('pin');
      localStorage.removeItem('biometricEnabled');
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('userProfile');
      window.location.reload();
    }
  };
  
  const activeNote = notes.find(n => n.id === activeNoteId);

  const renderContent = () => {
    if (activeNote) {
      return (
        <NoteEditor
          note={activeNote}
          onSave={handleSaveNote}
          onClose={() => setActiveNoteId(null)}
          onDelete={handleDeleteNote}
          defaultFont={defaultFont}
          defaultFontSize={defaultFontSize}
        />
      );
    }
    
    switch(view) {
      case 'notes':
        return (
          <NoteList
            notes={notes}
            onSelectNote={id => setActiveNoteId(id)}
            onCreateNote={handleCreateNote}
            showQuotes={showDailyQuote}
          />
        );
      case 'sticky':
        return (
          <StickyNotesView
            notes={notes}
            onSelectNote={id => setActiveNoteId(id)}
            onCreateNote={handleCreateNote}
          />
        );
      case 'calculator':
        return <Calculator />;
      default:
        return null;
    }
  };
  
  if (!isOnboardingComplete) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }
  
  if (pin && isLocked) {
    return <LockScreen mode="enter" pinToMatch={pin} onSuccess={() => setIsLocked(false)} />;
  }

  return (
    <>
      <Layout 
        view={view} 
        setView={setView} 
        openSettings={() => setIsSettingsOpen(true)}
        openVault={() => setIsVaultOpen(true)}
      >
        <div className="flex-grow w-full overflow-y-auto">
          {renderContent()}
        </div>
      </Layout>
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        font={defaultFont}
        setFont={setDefaultFont}
        fontSize={defaultFontSize}
        setFontSize={setDefaultFontSize}
        showDailyQuote={showDailyQuote}
        setShowDailyQuote={setShowDailyQuote}
        userProfile={userProfile}
        isBiometricEnabled={isBiometricEnabled}
        setBiometricEnabled={setBiometricEnabled}
        pin={pin}
        setPin={setPin}
        autoLockDuration={autoLockDuration}
        setAutoLockDuration={setAutoLockDuration}
        resetApp={resetApp}
        resetSecurity={resetSecurity}
      />
      <VaultModal 
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        notes={notes}
        pin={pin}
        onSelectNote={id => setActiveNoteId(id)}
      />
    </>
  );
};

export default App;