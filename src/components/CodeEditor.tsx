import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CodeEditor Component - Precision engineering code input with real-time analysis
 * Features syntax highlighting, line numbers, and scanning animations
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */

interface CodeEditorProps {
  /** Current code value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Whether editor is disabled during processing */
  disabled?: boolean;
  /** Current scanning phase for animation */
  scanningPhase?: string;
  /** Whether evaluation is in progress */
  isProcessing?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  disabled = false,
  scanningPhase,
  isProcessing = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [characterCount, setCharacterCount] = useState(0);

  // Update metrics when code changes
  useEffect(() => {
    setLineCount(value.split('\n').length);
    setCharacterCount(value.length);
  }, [value]);

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
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // Generate line numbers
  const generateLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
  };

  // Scanning animation variants
  const scanningVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Scanning text animation
  const scanningTextVariants = {
    initial: { width: 0 },
    animate: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className={`
      relative bg-midnight-obsidian border-2 rounded-xl overflow-hidden transition-all duration-300
      ${focused ? 'border-success shadow-lg shadow-success/20' : 'border-border-default'}
      ${disabled ? 'opacity-70' : ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-obsidian-secondary border-b border-border-default">
        <div className="flex items-center gap-3">
          <span className="text-success font-mono text-lg">{'</>'}</span>
          <span className="font-helvetica text-text-primary font-semibold">
            Code Input
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span className="font-helvetica text-warning text-sm font-medium">
                Analyzing...
              </span>
            </div>
          ) : (
            <span className="font-helvetica text-success text-sm font-medium">
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          <div className="px-4 py-4 bg-midnight-obsidian border-r border-border-default select-none">
            <pre className="font-mono text-sm text-text-secondary leading-6">
              {generateLineNumbers()}
            </pre>
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
              disabled={disabled}
              className={`
                w-full h-96 px-4 py-4 bg-midnight-obsidian text-text-primary
                font-mono text-sm leading-6 resize-none outline-none
                placeholder-text-secondary/50
                ${disabled ? 'cursor-not-allowed' : 'cursor-text'}
              `}
              placeholder="Enter your JavaScript code here..."
              spellCheck={false}
              style={{
                tabSize: 2,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
              }}
            />

            {/* Scanning Overlay */}
            <AnimatePresence>
              {isProcessing && scanningPhase && (
                <motion.div
                  variants={scanningVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-midnight-obsidian/95 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                >
                  {/* Scanning Loader */}
                  <div className="relative mb-6">
                    <div className="w-12 h-12 border-4 border-border-default border-t-success rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-success rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Scanning Text */}
                  <div className="text-center max-w-xs">
                    <h3 className="font-helvetica text-text-primary font-semibold mb-2">
                      {scanningPhase}
                    </h3>
                    <div className="relative h-1 bg-border-default rounded-full overflow-hidden">
                      <motion.div
                        variants={scanningTextVariants}
                        initial="initial"
                        animate="animate"
                        className="h-full bg-success"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 bg-obsidian-secondary border-t border-border-default">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-helvetica text-text-secondary text-sm">Lines:</span>
            <span className="font-mono text-text-primary text-sm font-medium">{lineCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-helvetica text-text-secondary text-sm">Characters:</span>
            <span className="font-mono text-text-primary text-sm font-medium">{characterCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${focused ? 'bg-success' : 'bg-text-secondary'
              }`} />
            <span className="font-helvetica text-text-secondary text-sm">
              {focused ? 'Focused' : 'Not Focused'}
            </span>
          </div>

          {value.length > 0 && (
            <button
              onClick={() => onChange('')}
              className="font-helvetica text-text-secondary hover:text-error text-sm font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
