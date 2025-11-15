import React from 'react';

interface FontSizeSliderProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 28;
const DEFAULT_FONT_SIZE = 16;

export const FontSizeSlider: React.FC<FontSizeSliderProps> = ({ fontSize, onFontSizeChange }) => {
  const size = fontSize || DEFAULT_FONT_SIZE;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-10 shrink-0">Size</span>
      <input
        type="range"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        value={size}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
        aria-label="Font size slider"
      />
      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 w-8 text-center shrink-0">{size}px</span>
    </div>
  );
};
