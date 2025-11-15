
import React from 'react';

type ColorStyles = {
    list: string;
    editor: string;
    sticky: {
        bg: string;
        text: string;
    };
};

export const NOTE_COLORS: { [key: string]: ColorStyles } = {
  default: {
    list: 'bg-neutral-200/80 dark:bg-neutral-800/50 hover:bg-neutral-300 dark:hover:bg-neutral-800',
    editor: 'bg-neutral-100 dark:bg-neutral-900',
    sticky: { bg: 'bg-neutral-200 dark:bg-neutral-800', text: 'text-neutral-800 dark:text-neutral-200' },
  },
  red: {
    list: 'bg-red-200/80 dark:bg-red-900/40 hover:bg-red-300/80 dark:hover:bg-red-900/60',
    editor: 'bg-red-100/50 dark:bg-red-900/20',
    sticky: { bg: 'bg-red-300 dark:bg-red-800/70', text: 'text-red-900 dark:text-red-100' },
  },
  orange: {
    list: 'bg-orange-200/80 dark:bg-orange-900/40 hover:bg-orange-300/80 dark:hover:bg-orange-900/60',
    editor: 'bg-orange-100/50 dark:bg-orange-900/20',
    sticky: { bg: 'bg-orange-300 dark:bg-orange-800/70', text: 'text-orange-900 dark:text-orange-100' },
  },
  yellow: {
    list: 'bg-yellow-200/80 dark:bg-yellow-900/40 hover:bg-yellow-300/80 dark:hover:bg-yellow-900/60',
    editor: 'bg-yellow-100/50 dark:bg-yellow-900/20',
    sticky: { bg: 'bg-yellow-300 dark:bg-yellow-800/70', text: 'text-yellow-900 dark:text-yellow-100' },
  },
  green: {
    list: 'bg-green-200/80 dark:bg-green-900/40 hover:bg-green-300/80 dark:hover:bg-green-900/60',
    editor: 'bg-green-100/50 dark:bg-green-900/20',
    sticky: { bg: 'bg-green-300 dark:bg-green-800/70', text: 'text-green-900 dark:text-green-100' },
  },
  teal: {
    list: 'bg-teal-200/80 dark:bg-teal-900/40 hover:bg-teal-300/80 dark:hover:bg-teal-900/60',
    editor: 'bg-teal-100/50 dark:bg-teal-900/20',
    sticky: { bg: 'bg-teal-300 dark:bg-teal-800/70', text: 'text-teal-900 dark:text-teal-100' },
  },
  blue: {
    list: 'bg-blue-200/80 dark:bg-blue-900/40 hover:bg-blue-300/80 dark:hover:bg-blue-900/60',
    editor: 'bg-blue-100/50 dark:bg-blue-900/20',
    sticky: { bg: 'bg-blue-300 dark:bg-blue-800/70', text: 'text-blue-900 dark:text-blue-100' },
  },
  purple: {
    list: 'bg-purple-200/80 dark:bg-purple-900/40 hover:bg-purple-300/80 dark:hover:bg-purple-900/60',
    editor: 'bg-purple-100/50 dark:bg-purple-900/20',
    sticky: { bg: 'bg-purple-300 dark:bg-purple-800/70', text: 'text-purple-900 dark:text-purple-100' },
  },
  pink: {
    list: 'bg-pink-200/80 dark:bg-pink-900/40 hover:bg-pink-300/80 dark:hover:bg-pink-900/60',
    editor: 'bg-pink-100/50 dark:bg-pink-900/20',
    sticky: { bg: 'bg-pink-300 dark:bg-pink-800/70', text: 'text-pink-900 dark:text-pink-100' },
  },
};

export const isHexColor = (color: string): boolean => /^#[0-9A-F]{6}$/i.test(color);

const hexToRgba = (hex: string, alpha: number): string => {
    if (!isHexColor(hex)) return 'transparent';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getTextColorForBg = (hex: string): string => {
    if (!isHexColor(hex)) return '#000000';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1f2937' : '#f9fafb'; // Tailwind gray-800 and gray-50
};

export const getDynamicListStyle = (hex: string): React.CSSProperties => {
    if (!isHexColor(hex)) return {};
    return { backgroundColor: hexToRgba(hex, 0.3) };
}

export const getDynamicEditorStyle = (hex: string): React.CSSProperties => {
    if (!isHexColor(hex)) return {};
    return { backgroundColor: hexToRgba(hex, 0.15) };
}

export const getDynamicStickyStyle = (hex: string): React.CSSProperties => {
    if (!isHexColor(hex)) return {};
    return { backgroundColor: hex, color: getTextColorForBg(hex) };
}
