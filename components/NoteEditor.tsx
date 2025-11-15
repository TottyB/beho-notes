import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Note } from '../types';
import { BackIcon, DeleteIcon, SaveIcon, PaletteIcon, MagicIcon, SpinnerIcon, FontIcon, FontSizeIcon, MicrophoneIcon, SparklesIcon, BellIcon, ShieldIcon } from './Icons';
import { ColorPalette } from './ColorPalette';
import { FontPalette } from './FontPalette';
import { FontSizeSlider } from './FontSizeSlider';
import { NOTE_COLORS, isHexColor, getDynamicEditorStyle } from '../util/colors';
import { FONT_OPTIONS } from '../util/fonts';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ReminderModal from './ReminderModal';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note, closeEditor?: boolean) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  defaultFont: string;
  defaultFontSize: number;
}

const AUTOSAVE_DELAY = 2000; // 2 seconds

// Extend the window interface for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}
const { SpeechRecognition, webkitSpeechRecognition }: IWindow = window as any;
const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;


const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose, onDelete, defaultFont, defaultFontSize }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [color, setColor] = useState(note.color || 'default');
  const [font, setFont] = useState(note.font || defaultFont);
  const [fontSize, setFontSize] = useState(note.fontSize || defaultFontSize);
  const [reminder, setReminder] = useState(note.reminder);
  const [isHidden, setIsHidden] = useState(note.isHidden || false);

  const [activePalette, setActivePalette] = useState<string | null>(null);
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  
  const recognitionRef = useRef<any | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || 'default');
    setFont(note.font || defaultFont);
    setFontSize(note.fontSize || defaultFontSize);
    setReminder(note.reminder);
    setIsHidden(note.isHidden || false);
    isMounted.current = false;
  }, [note, defaultFont, defaultFontSize]);
  
  // Create a memoized callback for the auto-save functionality.
  // This function will be debounced using the useEffect hook below.
  const debouncedSave = useCallback(() => {
    if (title.trim() !== '' || content.trim() !== '') {
      onSave({ ...note, title, content, color, font, fontSize, reminder, isHidden }, false);
    }
  }, [note, onSave, title, content, color, font, fontSize, reminder, isHidden]);

  // This effect implements the debouncing logic for auto-save.
  // When any piece of the note's state changes, it clears the previous
  // timeout and sets a new one.
  useEffect(() => {
    // Don't auto-save on the initial render or when a new note is loaded.
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const handler = setTimeout(() => {
      debouncedSave();
    }, AUTOSAVE_DELAY);

    // Cleanup function to clear the timeout if dependencies change or component unmounts.
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSave]);


  useEffect(() => {
    // Cleanup speech recognition on component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSave = () => {
    if (title.trim() === '' && content.trim() === '') {
        alert("Cannot save an empty note.");
        return;
    }
    // The auto-save timeout will be cleared automatically on unmount by the useEffect cleanup.
    onSave({ ...note, title, content, color, font, fontSize, reminder, isHidden }, true);
  };
  
  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSuggestTitle = async () => {
    if (!content.trim()) {
      alert("Please write some content before suggesting a title.");
      return;
    }
    setIsSuggestingTitle(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following note, suggest a short, concise title (maximum 5 words). Do not use markdown or quotes.\n\nCONTENT: "${content}"`,
      });
      const suggestedTitle = response.text.trim().replace(/^"|"$/g, '');
      setTitle(suggestedTitle);
    } catch (error) {
      console.error("Error suggesting title:", error);
      alert("Could not suggest a title at this time. Please check your API key and network connection.");
    } finally {
      setIsSuggestingTitle(false);
    }
  };

  const handleImproveWriting = async () => {
    if (!content.trim()) {
      alert("Please write some content before improving it.");
      return;
    }
    setIsImproving(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Proofread and improve the following text. Fix any spelling or grammar mistakes, improve clarity, and make it sound more professional, but retain the original core meaning. Return only the improved text.\n\nORIGINAL TEXT:\n"${content}"`,
      });
      const improvedText = response.text.trim();
      setContent(improvedText);
    } catch (error) {
      console.error("Error improving writing:", error);
      alert("Could not improve the text at this time. Please check your API key and network connection.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleToggleListening = () => {
    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (!navigator.onLine) {
        alert("Speech-to-text requires an internet connection. Please check your network and try again.");
        return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setContent(prevContent => (prevContent.trim() ? prevContent + ' ' : '') + transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = `An unexpected speech recognition error occurred: ${event.error}`;
      if (event.error === 'network') {
          errorMessage = "Speech recognition failed due to a network error. Please check your internet connection and try again.";
      } else if (event.error === 'no-speech') {
          errorMessage = "No speech was detected. Please try again.";
      } else if (event.error === 'audio-capture') {
          errorMessage = "Could not start audio capture. Please ensure your microphone is enabled and not in use by another application.";
      } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone access was denied. Please allow microphone permissions in your browser settings to use this feature.";
      }
      alert(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        setIsListening(false);
      }
    };
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch(e) {
      console.error("Error starting speech recognition:", e);
      alert("Could not start speech recognition.");
      setIsListening(false);
    }
  };

  const handleTogglePalette = (palette: string) => {
    setActivePalette(activePalette === palette ? null : palette);
  };

  const handleSetReminder = async (timestamp: number) => {
    if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert("Notification permission is required to set reminders.");
            return;
        }
    }
    setReminder(timestamp);
  };
  
  const handleClearReminder = () => {
    setReminder(null);
  };

  const isCustomColor = isHexColor(color);
  const editorStyle = isCustomColor ? getDynamicEditorStyle(color) : {};
  const editorColorClass = !isCustomColor ? (NOTE_COLORS[color]?.editor || NOTE_COLORS['default'].editor) : '';
  const editorFontCss = FONT_OPTIONS[font]?.css || FONT_OPTIONS['default'].css;

  return (
    <div className={`flex flex-col h-full transition-colors ${editorColorClass}`} style={editorStyle}>
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
          <BackIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button onClick={() => handleTogglePalette('color')} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
            <PaletteIcon className="w-6 h-6" />
          </button>
          <button onClick={() => handleTogglePalette('font')} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
            <FontIcon className="w-6 h-6" />
          </button>
          <button onClick={() => handleTogglePalette('size')} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
            <FontSizeIcon className="w-6 h-6" />
          </button>
           <button onClick={handleSuggestTitle} disabled={isSuggestingTitle || !content} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-110 active:scale-95">
            {isSuggestingTitle ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <MagicIcon className="w-6 h-6" />}
          </button>
          <button onClick={handleImproveWriting} disabled={isImproving || !content} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform-gpu hover:scale-110 active:scale-95">
            {isImproving ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : <SparklesIcon className="w-6 h-6" />}
          </button>
          {SpeechRecognitionAPI && (
            <button onClick={handleToggleListening} className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95 ${isListening ? 'text-red-500' : ''}`}>
              <MicrophoneIcon className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          )}
          <button onClick={() => setIsReminderModalOpen(true)} className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95 ${reminder ? 'text-indigo-500' : ''}`}>
            <BellIcon className="w-6 h-6" />
          </button>
           <button onClick={() => setIsHidden(!isHidden)} title={isHidden ? 'Unhide Note' : 'Hide Note'} className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors transform-gpu hover:scale-110 active:scale-95 ${isHidden ? 'text-indigo-500' : ''}`}>
            <ShieldIcon className="w-6 h-6" />
          </button>
          <button onClick={handleDeleteRequest} className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
            <DeleteIcon className="w-6 h-6" />
          </button>
          <button onClick={handleSave} className="p-2 rounded-full text-indigo-500 hover:bg-indigo-500/10 transition-colors transform-gpu hover:scale-110 active:scale-95">
            <SaveIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {activePalette && (
        <div className="flex-shrink-0 px-4 py-3 bg-neutral-200/50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 animate-slideDown">
          {activePalette === 'color' && <ColorPalette selectedColor={color} onSelectColor={(newColor) => {setColor(newColor);}} />}
          {activePalette === 'font' && <FontPalette selectedFont={font} onSelectFont={setFont} />}
          {activePalette === 'size' && <FontSizeSlider fontSize={fontSize} onFontSizeChange={setFontSize} />}
        </div>
      )}
      
      {showDeleteConfirm && (
        <ConfirmDeleteDialog
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        currentReminder={reminder}
        onSetReminder={handleSetReminder}
        onClearReminder={handleClearReminder}
      />

      <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-bold focus:outline-none mb-4 placeholder-neutral-500 dark:placeholder-neutral-400"
          style={{ fontFamily: editorFontCss, fontSize: `${fontSize * 1.25}px` }}
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-full bg-transparent resize-none focus:outline-none leading-relaxed placeholder-neutral-500 dark:placeholder-neutral-400"
          style={{ fontFamily: editorFontCss, fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        />
      </div>
    </div>
  );
};

export default NoteEditor;