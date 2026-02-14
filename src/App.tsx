import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvaluation } from '@/hooks/useEvaluation';
import CodeEditor from '@/components/CodeEditor';
import EvaluationDashboard from '@/components/EvaluationDashboard';
import { Submission } from '@/types';

/**
 * Main Application Component - LINT-PRO AI Coding Evaluator
 * Production-ready implementation with precision engineering aesthetic
 * 
 * Features:
 * - Midnight Obsidian theme with Helvetica/Apple Garamond typography
 * - Staggered reveal animations with typing effects
 * - Comprehensive evaluation pipeline with 100-point scoring system
 * - TypeScript with full type safety
 * - SOLID principles compliance
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */
const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

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

  /**
   * Handles code evaluation with proper error handling
   */
  const handleEvaluate = async (): Promise<void> => {
    try {
      setShowDashboard(false);
      await evaluate(code);
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  /**
   * Handles new evaluation request
   */
  const handleNewEvaluation = (): void => {
    reset();
    setCode('');
    setShowDashboard(false);
  };

  /**
   * Handles application reset
   */
  const handleReset = (): void => {
    reset();
    setCode('');
    setShowDashboard(false);
  };

  // Show dashboard when evaluation completes
  React.useEffect(() => {
    if (state === 'completed' && result) {
      setShowDashboard(true);
    }
  }, [state, result]);

  // Sample code snippets for testing
  const sampleCode = {
    twoSum: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,

    nestedLoops: `function findPairs(arr, target) {
  const pairs = [];
  
  // O(n²) complexity - can be optimized!
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }
  
  return pairs;
}`,

    poorNaming: `function x(a, b) {
  let temp = 0;
  let data = [];
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] > b) {
      temp += a[i];
      data.push(a[i]);
    }
  }
  
  return { temp, data };
}`
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-midnight-obsidian text-text-primary font-helvetica"
    >
      {/* Floating Pill Navbar */}
      <motion.nav
        variants={headerVariants}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                  w-[70%] max-w-4xl px-6 py-3
                  bg-midnight-obsidian/10 backdrop-blur-lg
                  border border-white/10 rounded-full
                  flex items-center justify-between
                  shadow-2xl shadow-black/30"
      >
        {/* Logo */}
        <motion.div
          className="font-garamond italic text-2xl font-bold text-text-header"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          LINT-PRO
        </motion.div>

        {/* Navigation Links */}
        <div className="flex gap-8 font-helvetica text-sm font-medium text-text-secondary-muted">
          <motion.a
            href="#analyzer"
            className="hover:text-text-header transition-colors relative px-3 py-1 rounded-full hover:bg-white/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analyzer
          </motion.a>
          <motion.a
            href="#benchmarks"
            className="hover:text-text-header transition-colors relative px-3 py-1 rounded-full hover:bg-white/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Benchmarks
          </motion.a>
          <motion.a
            href="#docs"
            className="hover:text-text-header transition-colors relative px-3 py-1 rounded-full hover:bg-white/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Docs
          </motion.a>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${state === 'idle' ? 'bg-text-secondary' :
              state === 'completed' ? 'bg-success' :
                state === 'error' ? 'bg-error' : 'bg-warning animate-pulse'
              }`} />
            <span className="text-text-secondary-muted text-xs font-medium">
              {statusMessage}
            </span>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="w-20 h-1 bg-border-default/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent-electric-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            className="bg-accent-electric-cyan hover:bg-accent-electric-cyan/90 text-midnight-obsidian px-4 py-2 rounded-full text-xs font-bold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Evaluate Code
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <motion.div variants={contentVariants}>
          {!showDashboard ? (
            /* Evaluation Interface */
            <div className="space-y-8">
              {/* Introduction */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold font-helvetica text-text-primary mb-4">
                  Advanced Code Analysis
                </h2>
                <p className="font-garamond text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
                  Experience the future of code evaluation with our precision engineering approach.
                  Our AI-powered engine analyzes your code through multiple dimensions:
                  correctness, efficiency, readability, and best practices.
                </p>
              </div>

              {/* Code Editor */}
              <div className="mb-8">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  disabled={isProcessing}
                  scanningPhase={currentPhase}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <motion.button
                  onClick={handleEvaluate}
                  disabled={isProcessing || !code.trim()}
                  className={`
                    px-8 py-4 font-helvetica font-semibold rounded-lg transition-all duration-300
                    ${isProcessing || !code.trim()
                      ? 'bg-text-secondary/20 text-text-secondary/50 cursor-not-allowed'
                      : 'btn-electric-cyan'
                    }
                  `}
                  whileHover={!isProcessing && code.trim() ? { scale: 1.05 } : {}}
                  whileTap={!isProcessing && code.trim() ? { scale: 0.95 } : {}}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-midnight-obsidian border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    'Evaluate Code'
                  )}
                </motion.button>

                {error && (
                  <motion.button
                    onClick={handleReset}
                    className="px-8 py-4 bg-border-default text-text-primary font-helvetica font-semibold rounded-lg hover:bg-text-secondary hover:bg-opacity-20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset
                  </motion.button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-error/10 border border-error/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-error text-xl">⚠️</span>
                    <div>
                      <h4 className="font-helvetica text-error font-semibold mb-1">
                        Evaluation Error
                      </h4>
                      <p className="font-garamond text-text-secondary">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sample Code */}
              {!code && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-obsidian-secondary/70 border border-white/10 rounded-xl p-8"
                >
                  <h3 className="text-xl font-bold font-helvetica text-text-primary mb-6">
                    Try Sample Code
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(sampleCode).map(([key, sample]) => (
                      <motion.button
                        key={key}
                        onClick={() => setCode(sample)}
                        className="p-4 bg-obsidian-secondary/50 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <h4 className="font-helvetica text-text-primary font-semibold mb-2">
                          {key === 'twoSum' ? 'Two Sum (Optimal)' :
                            key === 'nestedLoops' ? 'Nested Loops (O(n²))' :
                              'Poor Naming'}
                        </h4>
                        <p className="font-garamond text-text-secondary text-sm">
                          {key === 'twoSum' ? 'Optimal O(n) solution with hash map' :
                            key === 'nestedLoops' ? 'Inefficient O(n²) nested loops' :
                              'Code with naming issues'}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Results Dashboard */
            <EvaluationDashboard
              result={result!}
              onNewEvaluation={handleNewEvaluation}
            />
          )}
        </motion.div>
      </main>

      {/* Floating Footer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
                        w-[70%] max-w-4xl px-6 py-4
                        bg-midnight-obsidian/10 backdrop-blur-lg
                        border border-white/10 rounded-full
                        flex items-center justify-between
                        shadow-2xl shadow-black/30">
        <div className="flex items-center gap-6">
          <div className="font-garamond italic text-lg font-bold text-text-header">
            LINT-PRO
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary-muted">
            <span>v2.0.0</span>
            <span>•</span>
            <span>Precision Engineering</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-text-secondary-muted">
          <span>AST Analysis</span>
          <span>•</span>
          <span>Edge Cases</span>
          <span>•</span>
          <span>Explainability</span>
        </div>
      </footer>
    </motion.div>
  );
};

export default App;
