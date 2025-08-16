'use client';

import { useState } from 'react';

interface RichTextEditorProps {
  // Accept both prop shapes to remain compatible with older usages
  value?: string;
  content?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value,
  content,
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const resolvedValue = value ?? content ?? "";

  const handleFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => handleFormatting('bold')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleFormatting('italic')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleFormatting('underline')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 underline"
        >
          U
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => handleFormatting('insertUnorderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => handleFormatting('insertOrderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          1. List
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor/Preview Area */}
      {isPreview ? (
        <div 
          className="p-4 min-h-[200px] prose max-w-none"
          dangerouslySetInnerHTML={{ __html: resolvedValue }}
        />
      ) : (
        <div
          contentEditable
          className="p-4 min-h-[200px] outline-none"
          style={{ whiteSpace: 'pre-wrap' }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: resolvedValue }}
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
} 