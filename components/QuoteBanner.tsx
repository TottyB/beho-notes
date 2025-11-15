import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CloseIcon } from './Icons';

const quotes = [
  "The secret of getting ahead is getting started.",
  "The journey of a thousand miles begins with a single step.",
  "Either you run the day, or the day runs you.",
  "Your time is limited, don’t waste it living someone else’s life.",
  "The only way to do great work is to love what you do.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Act as if what you do makes a difference. It does.",
];

const QuoteBanner: React.FC = () => {
  const [quoteData, setQuoteData] = useLocalStorage<{ index: number; date: string } | null>('dailyQuote', null);
  const [isVisible, setIsVisible] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!quoteData || quoteData.date !== today) {
      const newIndex = Math.floor(Math.random() * quotes.length);
      setQuoteData({ index: newIndex, date: today });
    }
  }, [today, quoteData, setQuoteData]);
  
  if (!isVisible || !quoteData) return null;

  const quote = quotes[quoteData.index];

  return (
    <div className="relative bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 p-4 text-center text-sm animate-slideDown">
      <p className="font-medium italic">"{quote}"</p>
      <button 
        onClick={() => setIsVisible(false)} 
        className="absolute top-1 right-1 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="Dismiss quote"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuoteBanner;
