/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Copy, 
  Eye, 
  Edit3, 
  Maximize2, 
  Minimize2, 
  Check,
  Github,
  Moon,
  Sun,
  Layout,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_MARKDOWN = `# Welcome to Zen Markdown Reader 🌿

Zen is a minimalist, high-performance Markdown reader designed for clarity and focus.

## Features
- **Live Preview**: See your changes instantly as you type.
- **File Upload**: Drag and drop your \`.md\` files.
- **GFM Support**: Tables, task lists, and more.
- **Code Highlighting**: Beautiful syntax highlighting for your code blocks.
- **Zen Mode**: Focus on reading without distractions.

### Code Example
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}! Welcome to Zen.\`);
}

greet('Reader');
\`\`\`

### Tables
| Feature | Status |
| :--- | :--- |
| Markdown | ✅ |
| Design | ✨ |
| Speed | 🚀 |

### Task List
- [x] Create a beautiful UI
- [x] Add file upload support
- [ ] Implement export to PDF

---
*Start writing or upload a file to begin your zen reading experience.*
`;

export default function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'edit'>('split');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (previewRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = previewRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
      }
    };

    const currentPreview = previewRef.current;
    if (currentPreview) {
      currentPreview.addEventListener('scroll', handleScroll);
    }
    return () => currentPreview?.removeEventListener('scroll', handleScroll);
  }, [viewMode, isZenMode]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
      };
      reader.readAsText(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      setMarkdown('');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isZenMode ? 'bg-white' : 'bg-zinc-50'}`}>
      {/* Reading Progress Bar */}
      {(isZenMode || viewMode !== 'edit') && (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
          <motion.div 
            className="h-full bg-zinc-900 origin-left"
            style={{ scaleX: scrollProgress / 100 }}
          />
        </div>
      )}

      {/* Navigation Bar */}
      {!isZenMode && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
              <Type className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-tight">Zen Reader</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Markdown Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button 
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Edit3 size={16} /> Edit
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'split' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Layout size={16} /> Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Eye size={16} /> Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={copyToClipboard}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors relative"
              title="Copy Markdown"
            >
              {isCopied ? <Check className="text-green-500" size={20} /> : <Copy size={20} />}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Upload File"
            >
              <Upload size={20} />
            </button>
            <button 
              onClick={clearContent}
              className="p-2 text-zinc-500 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
              title="Clear Content"
            >
              <Trash2 size={20} />
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-2" />
            <button 
              onClick={() => setIsZenMode(true)}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2"
            >
              <Maximize2 size={16} /> Zen Mode
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".md,.txt" 
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </header>
      )}

      {/* Zen Mode Exit Button */}
      {isZenMode && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsZenMode(false)}
          className="fixed top-8 right-8 z-50 p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full transition-all shadow-sm"
          title="Exit Zen Mode"
        >
          <Minimize2 size={20} />
        </motion.button>
      )}

      {/* Main Content Area */}
      <main 
        className={`flex h-[calc(100vh-65px)] ${isZenMode ? 'h-screen overflow-y-auto' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <AnimatePresence mode="wait">
          {/* Drag Overlay */}
          {isDragging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-12"
            >
              <div className="w-full h-full border-4 border-dashed border-white/60 rounded-3xl flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Upload className="text-zinc-900 w-10 h-10" />
                </div>
                <h2 className="text-white text-3xl font-serif font-bold">Drop your Markdown file</h2>
                <p className="text-white/70">Release to upload and start reading</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Pane */}
        {!isZenMode && (viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full border-r border-zinc-200 bg-white flex flex-col`}>
            <div className="px-4 py-2 bg-zinc-50/50 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Markdown Editor</span>
              <span className="text-[10px] text-zinc-400 font-mono">{markdown.length} characters</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste or type your markdown here..."
              className="flex-1 w-full p-8 font-mono text-sm leading-relaxed focus:outline-none resize-none bg-transparent selection:bg-zinc-200"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(isZenMode || viewMode === 'preview' || viewMode === 'split') && (
          <div 
            ref={previewRef}
            className={`
            ${isZenMode ? 'w-full max-w-4xl mx-auto py-24 px-8' : (viewMode === 'split' ? 'w-1/2' : 'w-full')} 
            h-full overflow-y-auto bg-white transition-all duration-500 relative
          `}>
            {!isZenMode && (
              <div className="px-8 py-2 bg-zinc-50/50 border-b border-zinc-100 flex items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Preview</span>
              </div>
            )}
            <div className={`${isZenMode ? '' : 'p-12'} max-w-3xl mx-auto`}>
              <div className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeHighlight]}
                >
                  {markdown || '*No content to display. Start typing in the editor.*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      {!isZenMode && (
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-2xl shadow-2xl flex items-center gap-6 z-50">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Zen v1.0</span>
          </div>
          <div className="w-px h-4 bg-zinc-200" />
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <Github size={18} />
            </a>
            <div className="flex items-center gap-1 text-zinc-400">
              <span className="text-[10px] font-bold uppercase">Ready to read</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
