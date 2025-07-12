'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5Zm-2 0a2.5 2.5 0 0 0-2.5-2.5H8v5h5.5a2.5 2.5 0 0 0 2.5-2.5Z"/>
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z"/>
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Strike"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.448-1.571 3.318C14.815 19.91 13.54 20.5 12 20.5c-1.333 0-2.458-.37-3.375-1.108C7.742 18.654 7.375 17.667 7.375 16.5c0-.333.083-.667.25-1h2.5c-.167.333-.25.667-.25 1 0 .667.167 1.25.5 1.75.333.5.833.75 1.5.75 1.167 0 2.042-.417 2.625-1.25.583-.833.875-1.917.875-3.25 0-.333-.042-.667-.125-1H7.375c-.083-.333-.125-.667-.125-1 0-1.333.417-2.458 1.25-3.375C9.333 8.667 10.458 8.25 11.875 8.25c1.167 0 2.125.292 2.875.875.75.583 1.25 1.375 1.5 2.375h2.5c-.25-1.25-.75-2.333-1.5-3.25C15.125 7.667 13.667 7 12 7c-1.667 0-3.125.667-4.375 2C6.375 10.333 6 11.667 6 13c0 .333.042.667.125 1h2.5c-.083-.333-.125-.667-.125-1 0-.667.167-1.25.5-1.75.333-.5.833-.75 1.5-.75 1.167 0 2.042.417 2.625 1.25.583.833.875 1.917.875 3.25 0 .333-.042.667-.125 1h2.5c.083.333.125.667.125 1z"/>
          </svg>
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Heading 1"
        >
          H1
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Heading 2"
        >
          H2
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Heading 3"
        >
          H3
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h4v2H3v-2Zm0 7h4v2H3v-2Zm5-5h13v2H8v-2Zm0 7h13v2H8v-2Z"/>
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h4v2H3v-2Zm0 7h4v2H3v-2Zm5-5h13v2H8v-2Zm0 7h13v2H8v-2Z"/>
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Quote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 8c-1.45 0-2.26.25-3.2.9-.74-.35-1.43.07-1.43.87V20c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-2.37zM9 8c-1.45 0-2.26.25-3.2.9-.74-.35-1.43.07-1.43.87V20c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9z"/>
          </svg>
        </button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Add Link"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.364 15.536L16.95 14.122l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414L4.222 9.88a7 7 0 0 1 9.9 9.9l1.414-1.414zm-2.828-2.828l-1.414-1.414L9.88 16.95l1.414 1.414 1.414-1.414z"/>
          </svg>
        </button>
        
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Add Image"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992ZM20 15V5H4v14L14 9l6 6Zm0 2.828-6-6L6.828 19H20v-1.172ZM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
          </svg>
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-800">
        <EditorContent editor={editor} />
        {!content && placeholder && (
          <div className="absolute top-0 left-0 p-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
} 