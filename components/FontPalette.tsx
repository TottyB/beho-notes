import React from 'react';
import { FONT_OPTIONS } from '../util/fonts';

interface FontPaletteProps {
  selectedFont: string;
  onSelectFont: (font: string) => void;
}

export const FontPalette: React.FC<FontPaletteProps> = ({ selectedFont, onSelectFont }) => {
  const fonts = Object.keys(FONT_OPTIONS);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {fonts.map(fontKey => {
        const font = FONT_OPTIONS[fontKey];
        const isSelected = selectedFont === fontKey;
        return (
          <button
            key={fontKey}
            onClick={() => onSelectFont(fontKey)}
            style={{ fontFamily: font.css }}
            className={`w-full text-center p-2 rounded-md text-lg transition-colors ${
              isSelected
                ? 'bg-indigo-500 text-white'
                : 'bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400/50 dark:hover:bg-neutral-700'
            }`}
            aria-label={`Select ${font.name} font`}
          >
            {font.name}
          </button>
        );
      })}
    </div>
  );
};
