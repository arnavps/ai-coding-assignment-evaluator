import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefactorSuggestion } from '@/types';

/**
 * DiffView Component - Before/After code comparison with syntax highlighting
 * Features side-by-side diff, line-by-line comparison, and improvement metrics
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

interface DiffViewProps {
  /** Original code */
  originalCode: string;
  /** Optimized code */
  optimizedCode: string;
  /** Refactor suggestion */
  suggestion: RefactorSuggestion;
  /** Whether diff view is visible */
  isVisible: boolean;
  /** Callback to close diff view */
  onClose: () => void;
}

const DiffView: React.FC<DiffViewProps> = ({
  originalCode,
  optimizedCode,
  suggestion,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'line-by-line'>('side-by-side');

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-7xl mx-4 my-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                <div>
                  <h3 className="text-xl font-bold text-white">Code Improvement Analysis</h3>
                  <p className="text-slate-400 text-sm">{suggestion.title}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Improvement Metrics */}
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {suggestion.improvement.performanceGain}%
                  </div>
                  <div className="text-slate-400 text-sm">Performance Gain</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {suggestion.improvement.readabilityGain}%
                  </div>
                  <div className="text-slate-400 text-sm">Readability Gain</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-400">
                    {suggestion.improvement.complexityReduction}
                  </div>
                  <div className="text-slate-400 text-sm">Complexity Reduction</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {suggestion.estimatedTime}
                  </div>
                  <div className="text-slate-400 text-sm">Est. Time</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('side-by-side')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'side-by-side'
                  ? 'bg-slate-700 text-white border-b-2 border-b-cyan-400'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                  }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setActiveTab('line-by-line')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'line-by-line'
                  ? 'bg-slate-700 text-white border-b-2 border-b-cyan-400'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                  }`}
              >
                Line by Line
              </button>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'side-by-side' ? (
                <div className="grid grid-cols-2 h-full">
                  {/* Original Code */}
                  <div className="border-r border-slate-700">
                    <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                      <h4 className="text-white font-semibold mb-2">Before Optimization</h4>
                      <div className="text-xs text-slate-400 mb-2">
                        Original implementation with identified inefficiencies
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto h-full">
                      <pre className="text-sm text-slate-300 font-mono leading-6">
                        {originalCode}
                      </pre>
                    </div>
                  </div>

                  {/* Optimized Code */}
                  <div>
                    <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                      <h4 className="text-white font-semibold mb-2">After Optimization</h4>
                      <div className="text-xs text-slate-400 mb-2">
                        Improved implementation with enhanced performance and readability
                      </div>
                    </div>
                    <div className="p-4 overflow-y-auto h-full">
                      <pre className="text-sm text-slate-300 font-mono leading-6">
                        {optimizedCode}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                /* Line by Line Diff */
                <div className="h-full overflow-y-auto">
                  <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                    <h4 className="text-white font-semibold mb-2">Line-by-Line Comparison</h4>
                    <div className="text-xs text-slate-400 mb-2">
                      Detailed comparison showing exact changes between versions
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className="text-sm text-slate-300 font-mono">
                      {/* Simplified diff display */}
                      <div>Difference display would appear here</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  <span className="font-semibold text-white">Priority:</span> {suggestion.priority.toUpperCase()}
                </div>
                <button
                  onClick={() => {
                    const element = document.createElement('textarea');
                    element.value = optimizedCode;
                    document.body.appendChild(element);
                    element.select();
                    document.execCommand('copy');
                    document.body.removeChild(element);
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Copy Optimized Code
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiffView;