import React, { useState } from 'react';
import { X, Bold, Italic, Underline, List, Paperclip } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const { dark } = useTheme();
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = React.useRef(null);

  if (!isOpen) return null;

  const handleCommand = (command) => {
    document.execCommand(command, false, null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    const editor = document.getElementById('rich-editor');
    const htmlContent = editor.innerHTML;
    if (htmlContent.trim() && htmlContent !== '<br>') {
      onSubmit(htmlContent, attachment);
      editor.innerHTML = '';
      setAttachment(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeIn_0.2s_ease-out]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Create a post
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Visibility */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            You are posting in:{' '}
            <select className="border-none outline-none font-medium text-slate-800 dark:text-slate-200 bg-transparent cursor-pointer">
              <option>Everyone</option>
            </select>
          </div>

          {/* Rich Editor */}
          <div className="border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
              <button
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                onClick={() => handleCommand('bold')}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                onClick={() => handleCommand('italic')}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                onClick={() => handleCommand('underline')}
                title="Underline"
              >
                <Underline size={16} />
              </button>
              <button
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                onClick={() => handleCommand('insertUnorderedList')}
                title="List"
              >
                <List size={16} />
              </button>
            </div>
            {/* Editor Area */}
            <div
              id="rich-editor"
              className="w-full min-h-[150px] px-4 py-3 outline-none text-slate-800 dark:text-slate-100 text-sm resize-none bg-white dark:bg-slate-800 overflow-y-auto empty:before:content-[attr(placeholder)] empty:before:text-slate-400 dark:empty:before:text-slate-500"
              contentEditable="true"
              placeholder="Write something here..."
            ></div>
          </div>

          {/* Attachment */}
          <div className="flex justify-between items-start">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                className="flex items-center gap-2 text-sm font-medium text-sky-500 cursor-pointer hover:text-sky-600 transition-colors"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip size={16} /> {attachment ? attachment.name : 'Attachment'}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 ml-6">
                {attachment ? 'File selected ✅' : 'ⓘ Max 10 images, max 10 documents'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
