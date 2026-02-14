import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvaluation } from '@/hooks/useEvaluation';
import LandingPage from './LandingPage';
import ProCodeEditor from './ProCodeEditor';
import BentoDashboard from './BentoDashboard';
import StatusTerminal from './StatusTerminal';
import DiffView from './DiffView';

/**
 * EnhancedApp Component - Main application with landing page to IDE dashboard transition
 * Features professional UI, enhanced accessibility, and winning hackathon aesthetics
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

const EnhancedApp: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showDiffView, setShowDiffView] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);

  const {
    state,
    currentPhase,
    progress,
    result,
    error,
    isProcessing,
    evaluate,
    reset,
    statusMessage
  } = useEvaluation();

  // Status messages for terminal
  const statusMessages = [
    '[OK] Abstract Syntax Tree generated...',
    '[RUNNING] Interrogating edge cases...',
    '[RUNNING] Executing performance benchmarks...',
    '[RUNNING] Analyzing code patterns...',
    '[RUNNING] Calculating technical debt...',
    '[COMPLETE] Mentorship report synthesized...'
  ];

  // Handle evaluation start
  const handleStartEvaluation = async (code: string) => {
    setShowLanding(false);
    setShowDiffView(false);
    try {
      await evaluate(code);
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  // Handle new evaluation
  const handleNewEvaluation = () => {
    reset();
    setShowLanding(true);
    setShowDiffView(false);
    setSelectedSuggestion(null);
  };

  // Handle diff view toggle
  const handleToggleDiff = () => {
    setShowDiffView(!showDiffView);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setShowDiffView(true);
  };

  // Transition to dashboard when evaluation completes
  useEffect(() => {
    if (state === 'completed' && result && showLanding) {
      const timer = setTimeout(() => {
        setShowLanding(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, result, showLanding]);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Status Terminal - Always visible when processing */}
      <AnimatePresence>
        {isProcessing && (
          <StatusTerminal
            currentPhase={currentPhase}
            progress={progress}
            isActive={isProcessing}
            statusMessages={statusMessages}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        variants={pageVariants}
        initial="visible"
        animate={showLanding ? "visible" : "hidden"}
        exit="hidden"
        className="fixed inset-0 z-40"
      >
        <LandingPage onStartEvaluation={() => handleStartEvaluation('')} />
      </motion.div>

      {/* IDE Dashboard */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate={!showLanding ? "visible" : "hidden"}
        exit="hidden"
        className="min-h-screen"
      >
        {result && (
          <div className="flex h-full">
            {/* Main Dashboard */}
            <div className={`flex-1 ${showDiffView ? 'hidden' : 'block'}`}>
              <BentoDashboard
                result={result}
                onNewEvaluation={handleNewEvaluation}
                showDiffView={showDiffView}
                onToggleDiff={handleToggleDiff}
              />
            </div>

            {/* Diff View Sidebar */}
            <AnimatePresence>
              {showDiffView && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="w-96 bg-slate-800/95 backdrop-blur-xl border-l border-slate-700/30 h-full"
                >
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-700">
                      <h3 className="text-white font-semibold">Code Improvements</h3>
                      <button
                        onClick={handleToggleDiff}
                        className="mt-2 text-slate-400 hover:text-slate-300 text-sm"
                      >
                        ← Back to Dashboard
                      </button>
                    </div>

                    {/* Suggestions List */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {result.refactorSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`mb-4 p-4 bg-slate-900/50 rounded-xl cursor-pointer border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-200 ${selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-cyan-400/20' : ''
                            }`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <h4 className="text-white font-semibold mb-2">{suggestion.title}</h4>
                          <p className="text-slate-300 text-sm mb-3">{suggestion.description}</p>

                          {/* Improvement Metrics */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-cyan-400 font-bold">
                                {suggestion.improvement.performanceGain}%
                              </span>
                              <span className="text-slate-400 ml-1">Performance</span>
                            </div>
                            <div>
                              <span className="text-cyan-400 font-bold">
                                {suggestion.improvement.readabilityGain}%
                              </span>
                              <span className="text-slate-400 ml-1">Readability</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-700">
                            <span className="text-amber-400 text-xs">Priority: {suggestion.priority.toUpperCase()}</span>
                            <span className="text-slate-400 ml-2">Time: {suggestion.estimatedTime}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Diff View */}
            <AnimatePresence>
              {showDiffView && selectedSuggestion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 border-l border-slate-700/30"
                >
                  <DiffView
                    originalCode={selectedSuggestion.currentCode}
                    optimizedCode={selectedSuggestion.optimizedCode}
                    suggestion={selectedSuggestion}
                    isVisible={true}
                    onClose={() => setSelectedSuggestion(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center"
          >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h3 className="text-white text-xl font-semibold mb-2">Evaluation Error</h3>
              <p className="text-slate-300">{error}</p>
              <button
                onClick={handleNewEvaluation}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                Start Evaluating
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor - Floating */}
      {!showLanding && !result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-30 w-96"
        >
          <ProCodeEditor
            value=""
            onChange={() => { }}
            disabled={isProcessing}
          />
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedApp;
