import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * StatusTerminal Component - Real-time analysis status with terminal aesthetic
 * Features context-aware motion and live status updates
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

interface StatusTerminalProps {
  /** Current analysis phase */
  currentPhase: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether analysis is active */
  isActive: boolean;
  /** Analysis status messages */
  statusMessages: string[];
}

const StatusTerminal: React.FC<StatusTerminalProps> = ({
  currentPhase,
  progress,
  isActive,
  statusMessages
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Terminal typing effect
  useEffect(() => {
    if (!isActive) {
      setTypedText('');
      setCurrentMessageIndex(0);
      return;
    }

    const currentMessage = statusMessages[currentMessageIndex] || '';
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setTypedText(currentMessage.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setCursorVisible(true);
        
        // Move to next message after delay
        setTimeout(() => {
          setCursorVisible(false);
          setTimeout(() => {
            if (currentMessageIndex < statusMessages.length - 1) {
              setCurrentMessageIndex(prev => prev + 1);
              setTypedText('');
              charIndex = 0;
            }
          }, 200);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex, statusMessages, isActive]);

  // Terminal variants
  const terminalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      rotateX: -5 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: {
        pathLength: 1,
        ease: "easeInOut",
        duration: 0.3
      }
    }
  };

  const getPhaseIcon = (phase: string): string => {
    if (phase.includes('AST') || phase.includes('Parsing')) return '🔍';
    if (phase.includes('Test') || phase.includes('Edge')) return '⚡';
    if (phase.includes('Generate') || phase.includes('Synthesizing')) return '🧠';
    if (phase.includes('Complete')) return '✅';
    return '⚙️';
  };

  const getPhaseColor = (phase: string): string => {
    if (phase.includes('AST') || phase.includes('Parsing')) return 'text-cyan-400';
    if (phase.includes('Test') || phase.includes('Edge')) return 'text-amber-400';
    if (phase.includes('Generate') || phase.includes('Synthesizing')) return 'text-purple-400';
    if (phase.includes('Complete')) return 'text-green-400';
    return 'text-slate-400';
  };

  return (
    <motion.div
      variants={terminalVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      className="fixed top-6 right-6 z-50 w-96 max-h-96"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-slate-300 text-xs font-mono">lint-pro-terminal</span>
            </div>
            <button
              onClick={() => setCurrentMessageIndex(0)}
              className="text-slate-400 hover:text-slate-300 text-xs"
            >
              Clear
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
          <div className="space-y-2">
            {/* Current Phase Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 pb-3 border-b border-slate-700"
            >
              <span className="text-2xl">{getPhaseIcon(currentPhase)}</span>
              <div>
                <div className={`font-semibold ${getPhaseColor(currentPhase)}`}>
                  {currentPhase}
                </div>
                <div className="text-slate-500 text-xs">
                  Phase {currentMessageIndex + 1} of {statusMessages.length}
                </div>
              </div>
            </motion.div>

            {/* Typed Output */}
            <div className="relative">
              {/* Line Numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-8 text-slate-600 text-xs border-r border-slate-700 pr-2 pt-1">
                {Array.from({ length: typedText.split('\n').length }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Terminal Content */}
              <div className="ml-10">
                <AnimatePresence mode="wait">
                  {typedText.split('\n').map((line, lineIndex) => (
                    <motion.div
                      key={lineIndex}
                      variants={lineVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex"
                    >
                      {/* Prompt */}
                      <span className="text-green-400 mr-2">$</span>
                      
                      {/* Command */}
                      <span className="text-slate-300">
                        {line}
                      </span>

                      {/* Cursor */}
                      {lineIndex === typedText.split('\n').length - 1 && cursorVisible && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                          }}
                          className="text-cyan-400"
                        >
                          █
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Analysis Progress Indicators */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    progress > 25 ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                  <span className="text-slate-400">AST Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    progress > 50 ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                  <span className="text-slate-400">Test Execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    progress > 75 ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                  <span className="text-slate-400">Pattern Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    progress >= 100 ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                  <span className="text-slate-400">Report Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-slate-800 px-4 py-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <span className="text-slate-400">Analysis Engine v2.1.0</span>
            </div>
            <div className="text-slate-500">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusTerminal;
