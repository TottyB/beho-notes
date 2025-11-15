import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogoIcon, LockIcon } from './Icons';

type OnboardingStep = 'profile' | 'createPin' | 'confirmPin' | 'biometrics';

interface OnboardingData {
  profile: UserProfile;
  pin: string;
  biometricEnabled: boolean;
}

interface OnboardingModalProps {
  onComplete: (data: OnboardingData) => void;
}

const MIN_PIN_LENGTH = 4;
const MAX_PIN_LENGTH = 6;

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('profile');

  // State for profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  
  // State for PIN
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');

  // State for biometrics
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [error, setError] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !age.trim()) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(Number(age)) || Number(age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }
    setError('');
    setStep('createPin');
  };
  
  const handlePinInput = (digit: string) => {
    if (step === 'createPin' && pin.length < MAX_PIN_LENGTH) {
      setPin(p => p + digit);
    } else if (step === 'confirmPin' && pin.length < MAX_PIN_LENGTH) {
      setPin(p => p + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(p => p.slice(0, -1));
  };

  const handleCreatePin = () => {
    setError('');
    setFirstPin(pin);
    setPin('');
    setStep('confirmPin');
  };
  
  const handleConfirmPin = () => {
    if (pin === firstPin) {
      setError('');
      setStep('biometrics');
    } else {
      setError('PINs do not match. Please try again.');
      setPin('');
      setFirstPin('');
      setStep('createPin');
    }
  };
  
  const handleBiometricsChoice = (enabled: boolean) => {
    setBiometricEnabled(enabled);
    onComplete({
      profile: { firstName, lastName, age },
      pin: firstPin,
      biometricEnabled: enabled
    });
  };
  
  const PinDots = ({ length }: { length: number }) => (
    <div className="flex items-center justify-center gap-4 my-6">
      {Array.from({ length: MAX_PIN_LENGTH }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-colors ${
            i < length ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        />
      ))}
    </div>
  );

  const NumericKeypad = ({ onInput, onDelete, onSubmit, canSubmit, submitLabel }: { onInput: (d: string) => void, onDelete: () => void, onSubmit: () => void, canSubmit: boolean, submitLabel: string }) => (
     <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-4">
      {'123456789'.split('').map(digit => (
        <button key={digit} onClick={() => onInput(digit)} className="flex items-center justify-center h-16 rounded-full text-2xl font-light bg-neutral-200 dark:bg-neutral-800/80 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors">{digit}</button>
      ))}
      <div/>
      <button onClick={() => onInput('0')} className="flex items-center justify-center h-16 rounded-full text-2xl font-light bg-neutral-200 dark:bg-neutral-800/80 active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors">0</button>
      <button onClick={onDelete} className="flex items-center justify-center h-16 rounded-full text-lg font-medium bg-transparent active:bg-neutral-300 dark:active:bg-neutral-700 transition-colors">DEL</button>
      <button 
        onClick={onSubmit} 
        disabled={!canSubmit}
        className="col-span-3 mt-2 px-4 py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {submitLabel}
      </button>
    </div>
  );
  
  const renderStep = () => {
    switch (step) {
      case 'profile':
        return (
          <>
            <LogoIcon className="w-20 h-20 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">Welcome to Beho</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">Let's get your premium experience set up.</p>
            <form onSubmit={handleProfileSubmit} className="mt-8 text-left space-y-4">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your first name" />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your last name" />
              </div>
              <div>
                <label htmlFor="age" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Age</label>
                <input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your age" />
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <button type="submit" className="w-full mt-4 px-4 py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">Continue</button>
            </form>
          </>
        );
      case 'createPin':
      case 'confirmPin':
        return (
          <>
            <LockIcon className="w-10 h-10 mx-auto text-neutral-500 dark:text-neutral-400" />
            <h1 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              {step === 'createPin' ? 'Create a PIN' : 'Confirm Your PIN'}
            </h1>
            <p className={`mt-1 text-neutral-600 dark:text-neutral-400 transition-colors min-h-[20px] ${error ? 'text-red-500' : ''}`}>
                {error || `Enter a ${MIN_PIN_LENGTH}-${MAX_PIN_LENGTH} digit PIN.`}
            </p>
            <PinDots length={pin.length} />
            <NumericKeypad 
              onInput={handlePinInput}
              onDelete={handlePinDelete}
              onSubmit={step === 'createPin' ? handleCreatePin : handleConfirmPin}
              canSubmit={pin.length >= MIN_PIN_LENGTH && pin.length <= MAX_PIN_LENGTH}
              submitLabel={step === 'createPin' ? 'Next' : 'Confirm'}
            />
          </>
        );
      case 'biometrics':
        return (
          <>
            <LogoIcon className="w-20 h-20 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">Enable Biometrics</h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">Use your fingerprint or face to unlock the app instantly.</p>
            <div className="mt-8 space-y-4">
               <button onClick={() => handleBiometricsChoice(true)} className="w-full px-4 py-3 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">Enable Biometrics</button>
               <button onClick={() => handleBiometricsChoice(false)} className="w-full px-4 py-3 rounded-md font-semibold text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">Maybe Later</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm text-center animate-splash-scaleIn">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingModal;