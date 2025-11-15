import React, { useState, useEffect } from 'react';
import { LockIcon, CheckIcon } from './Icons';

interface LockScreenProps {
  onSuccess: () => void;
  pinToMatch?: string | null;
  mode: 'set' | 'enter';
  title?: string;
  onPinSet?: (pin: string) => void;
}

const MIN_PIN_LENGTH = 4;
const MAX_PIN_LENGTH = 6;

const LockScreen: React.FC<LockScreenProps> = ({
  onSuccess,
  pinToMatch,
  mode,
  title = "Enter PIN",
  onPinSet,
}) => {
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [subTitle, setSubTitle] = useState(mode === 'set' ? 'Create a new PIN' : 'Enter your PIN to unlock');
  const canSubmit = pin.length >= MIN_PIN_LENGTH && pin.length <= MAX_PIN_LENGTH;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (mode === 'set') {
      if (!firstPin) {
        setFirstPin(pin);
        setPin('');
        setSubTitle('Confirm your PIN');
      } else {
        if (pin === firstPin) {
          onPinSet?.(pin);
          onSuccess();
        } else {
          setIsError(true);
          setSubTitle('PINs do not match. Try again.');
          setFirstPin('');
          setPin('');
          setTimeout(() => {
            setIsError(false);
            setSubTitle('Create a new PIN');
          }, 1500);
        }
      }
    } else { // mode === 'enter'
      if (pin === pinToMatch) {
        onSuccess();
      } else {
        setIsError(true);
        setSubTitle('Incorrect PIN. Try again.');
        setPin('');
        setTimeout(() => {
           setIsError(false);
           setSubTitle('Enter your PIN to unlock');
        }, 1500);
      }
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < MAX_PIN_LENGTH) {
      setPin(pin + digit);
    }
  };

  const handleDeleteClick = () => {
    setPin(pin.slice(0, -1));
  };
  
  const PinDots = () => (
    <div className={`flex items-center justify-center gap-4 my-6 ${isError ? 'animate-shake' : ''}`}>
      {Array.from({ length: MAX_PIN_LENGTH }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-colors ${
            i < pin.length ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center z-50 p-4">
      <div className="flex flex-col items-center text-center">
        <LockIcon className="w-10 h-10 text-neutral-500 dark:text-neutral-400" />
        <h1 className="text-2xl font-bold mt-4 text-neutral-800 dark:text-neutral-200">{title}</h1>
        <p className={`mt-1 text-neutral-600 dark:text-neutral-400 transition-colors ${isError ? 'text-red-500' : ''}`}>{subTitle}</p>
        <PinDots />
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-xs mt-4">
        {'123456789'.split('').map(digit => (
          <button
            key={digit}
            onClick={() => handleDigitClick(digit)}
            className="flex items-center justify-center h-20 rounded-full text-3xl font-light bg-neutral-200 dark:bg-neutral-800/80 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex items-center justify-center h-20 rounded-full text-3xl font-light bg-neutral-200 dark:bg-neutral-800/80 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon className="w-8 h-8 text-indigo-500" />
        </button>
        <button
          onClick={() => handleDigitClick('0')}
          className="flex items-center justify-center h-20 rounded-full text-3xl font-light bg-neutral-200 dark:bg-neutral-800/80 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex items-center justify-center h-20 rounded-full text-xl font-medium bg-transparent active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors"
        >
          DEL
        </button>
      </div>
    </div>
  );
};

export default LockScreen;