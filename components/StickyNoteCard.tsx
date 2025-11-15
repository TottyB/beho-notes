
import React from 'react';
import { Note } from '../types';
import { NOTE_COLORS, isHexColor, getDynamicStickyStyle } from '../util/colors';
import { FONT_OPTIONS } from '../util/fonts';
import { BellIcon } from './Icons';

interface StickyNoteCardProps {
  note: Note;
  onSelectNote: (id: string) => void;
  style?: React.CSSProperties;
}

const StickyNoteCard: React.FC<StickyNoteCardProps> = ({ note, onSelectNote, style }) => {
  const isCustom = isHexColor(note.color || '');
  const dynamicStyle = isCustom ? getDynamicStickyStyle(note.color!) : {};
  const presetColor = NOTE_COLORS[note.color || 'default']?.sticky || NOTE_COLORS['default'].sticky;
  const colorClasses = !isCustom ? `${presetColor.bg} ${presetColor.text}` : '';
  const fontCss = FONT_OPTIONS[note.font || 'default']?.css;

  const contentStyle: React.CSSProperties = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 5,
      WebkitBoxOrient: 'vertical',
      fontFamily: fontCss,
      ...dynamicStyle,
      ...style,
  };

  return (
    <button
      onClick={() => onSelectNote(note.id)}
      className={`relative overflow-hidden w-full h-48 p-5 rounded-md shadow-lg flex flex-col text-left transition-all duration-200 transform-gpu hover:-translate-y-1 hover:shadow-2xl ${colorClasses} paper-texture`}
      style={contentStyle}
    >
      <div className="flex items-start justify-between gap-2 flex-shrink-0">
        <h3 className="font-bold text-lg truncate" style={{ fontFamily: fontCss }}>
          {note.title || 'Untitled Note'}
        </h3>
        {note.reminder && <BellIcon className="w-5 h-5 opacity-70 mt-1 flex-shrink-0" />}
      </div>
      <p className="text-sm mt-1 flex-grow whitespace-pre-wrap break-words">
        {note.content || 'No additional text'}
      </p>
    </button>
  );
};

export default StickyNoteCard;