import React, { useRef } from 'react';
import { NOTE_COLORS, isHexColor } from '../util/colors';
import { CheckIcon, SwatchIcon } from './Icons';

interface ColorPaletteProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  const colors = Object.keys(NOTE_COLORS);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCustomColorClick = () => {
    colorInputRef.current?.click();
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectColor(e.target.value);
  };
  
  const isCustomSelected = isHexColor(selectedColor);

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {colors.map(color => {
        const colorClass = NOTE_COLORS[color].list.split(' ').find(c => c.startsWith('bg-')) || 'bg-white';
        return (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-8 h-8 rounded-full transition-transform transform-gpu active:scale-90 ${colorClass} flex items-center justify-center`}
            aria-label={`Select ${color} color`}
          >
            {selectedColor === color && <CheckIcon className="w-5 h-5 text-black/70 dark:text-white/80" />}
          </button>
        );
      })}
      
      <button
        onClick={handleCustomColorClick}
        style={isCustomSelected ? { backgroundColor: selectedColor } : {}}
        className={`w-8 h-8 rounded-full transition-all transform-gpu active:scale-90 flex items-center justify-center ${
          !isCustomSelected && 'bg-neutral-300 dark:bg-neutral-700 border-2 border-dashed border-neutral-400 dark:border-neutral-600'
        }`}
        aria-label="Select custom color"
      >
        {isCustomSelected ? (
          <CheckIcon className="w-5 h-5 text-white mix-blend-difference" />
        ) : (
          <SwatchIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>
      <input
        type="color"
        ref={colorInputRef}
        onChange={handleCustomColorChange}
        className="w-0 h-0 opacity-0 absolute"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
};
