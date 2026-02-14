import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ProCodeEditor Component - Professional IDE-style code input with glassmorphism
 * Features line highlighting, gutter, and error visualization
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

interface ProCodeEditorProps {
  /** Current code value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Whether editor is disabled */
  disabled?: boolean;
  /** Error lines to highlight */
  errorLines?: number[];
  /** Warning lines to highlight */
  warningLines?: number[];
}

const ProCodeEditor: React.FC<ProCodeEditorProps> = ({
  value,
  onChange,
  disabled = false,
  errorLines = [],
  warningLines = []
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [characterCount, setCharacterCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Update metrics when code changes
  useEffect(() => {
    setLineCount(value.split('\n').length);
    setCharacterCount(value.length);
  }, [value]);

  // Track cursor position
  const handleCursorMove = () => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionStart;
      const textBeforeCursor = value.substring(0, pos);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines.length;
      const currentColumn = lines[lines.length - 1].length + 1;
      setCursorPosition({ line: currentLine, column: currentColumn });
    }
  };

  // Handle tab key for proper indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      onChange(newValue);
      
      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Focus handlers
  const handleFocus = () => {
    setFocused(true);
    handleCursorMove();
  };

  const handleBlur = () => {
    setFocused(false);
  };

  // Generate line numbers
  const generateLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => i + 1);
  };

  // Get line highlight style
  const getLineStyle = (lineNumber: number): string => {
    if (errorLines.includes(lineNumber)) {
      return 'bg-red-500/20 border-l-2 border-red-500';
    }
    if (warningLines.includes(lineNumber)) {
      return 'bg-amber-500/20 border-l-2 border-amber-500';
    }
    return '';
  };

  // Glassmorphism effect
  const glassVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      backdropFilter: 'blur(0px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      backdropFilter: 'blur(12px)',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={glassVariants}
      initial="hidden"
      animate="visible"
      className={`
        relative bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl 
        overflow-hidden transition-all duration-300
        ${focused ? 'ring-2 ring-cyan-400/20 border-cyan-400/50 shadow-2xl shadow-cyan-400/10' : ''}
        ${disabled ? 'opacity-60' : ''}
      `}
    >
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            <span className="text-white font-semibold">Code Editor</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {lineCount}
              </div>
              <div className="text-slate-400 text-xs">lines</div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {characterCount.toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs">characters</div>
            </div>

            <div className="text-right">
              <div className="text-sm font-mono text-cyan-300">
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex">
        {/* Line Numbers Gutter */}
        <div className="w-16 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/30 select-none">
          <div className="px-3 py-4">
            {generateLineNumbers().map((lineNum, index) => (
              <div
                key={index}
                className={`
                  text-slate-500 text-sm font-mono leading-6 py-0.5
                  ${getLineStyle(lineNum)}
                `}
              >
                {lineNum}
              </div>
            ))}
          </div>
        </div>

        {/* Code Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleCursorMove}
            onKeyUp={handleCursorMove}
            disabled={disabled}
            className={`
              w-full h-96 px-4 py-4 bg-transparent text-white font-mono text-sm 
              leading-6 resize-none outline-none caret-cyan-400
              ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
            `}
            style={{
              tabSize: 2,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
            placeholder="Enter your JavaScript code here..."
            spellCheck={false}
          />

          {/* Scanning Overlay */}
          <AnimatePresence>
            {disabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-10"
              >
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
                  <div className="text-white font-semibold">Analyzing code...</div>
                  <div className="text-slate-400 text-sm mt-2">Please wait while we process your submission</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                focused ? 'bg-cyan-400' : 'bg-slate-500'
              }`} />
              <span className="text-slate-300 text-sm">
                {focused ? 'Focused' : 'Not Focused'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                value.length > 0 ? 'bg-green-400' : 'bg-slate-500'
              }`} />
              <span className="text-slate-300 text-sm">
                {value.length > 0 ? 'Has Content' : 'Empty'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onChange('')}
              className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
            >
              Clear
            </button>
            
            <button
              onClick={() => {
                const element = document.createElement('textarea');
                element.value = value;
                document.body.appendChild(element);
                element.select();
                document.execCommand('copy');
                document.body.removeChild(element);
              }}
              className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProCodeEditor;
