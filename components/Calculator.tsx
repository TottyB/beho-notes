
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };
  
  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const result = calculate(firstOperand, parseFloat(display), operator);
      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  };

  const buttons = [
    { label: 'C', className: 'bg-neutral-300 dark:bg-neutral-700 text-indigo-500', action: clear },
    { label: '+/-', className: 'bg-neutral-300 dark:bg-neutral-700', action: () => setDisplay(String(parseFloat(display) * -1)) },
    { label: '%', className: 'bg-neutral-300 dark:bg-neutral-700', action: () => setDisplay(String(parseFloat(display) / 100)) },
    { label: '/', className: 'bg-indigo-500 text-white', action: () => performOperation('/') },
    { label: '7', action: () => inputDigit('7') }, { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '*', className: 'bg-indigo-500 text-white', action: () => performOperation('*') },
    { label: '4', action: () => inputDigit('4') }, { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '-', className: 'bg-indigo-500 text-white', action: () => performOperation('-') },
    { label: '1', action: () => inputDigit('1') }, { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', className: 'bg-indigo-500 text-white', action: () => performOperation('+') },
    { label: '0', className: 'col-span-2', action: () => inputDigit('0') },
    { label: '.', action: inputDecimal },
    { label: '=', className: 'bg-indigo-500 text-white', action: handleEquals },
  ];
  
  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900 p-4">
      <div className="flex-1 flex items-end justify-end p-4 mb-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg">
        <h1 className="text-5xl font-light text-right break-all">{display}</h1>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            className={`flex items-center justify-center h-20 rounded-lg text-2xl font-medium transition-colors duration-200 active:opacity-80
              ${btn.className || 'bg-neutral-200 dark:bg-neutral-800'}`
            }
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
