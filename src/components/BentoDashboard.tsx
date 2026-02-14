import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvaluationResult } from '@/types';

/**
 * BentoDashboard Component - Professional IDE Dashboard with Bento Box Grid Layout
 * Features modular cards, dynamic gauges, and information density
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

interface BentoDashboardProps {
  /** Evaluation results to display */
  result: EvaluationResult;
  /** Callback for new evaluation */
  onNewEvaluation: () => void;
  /** Whether to show diff view */
  showDiffView?: boolean;
  /** Toggle for diff view */
  onToggleDiff?: () => void;
}

const BentoDashboard: React.FC<BentoDashboardProps> = ({
  result,
  onNewEvaluation,
  showDiffView = false,
  onToggleDiff
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Bento grid animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      rotateY: -15
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
        delay: 0.1
      }
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'from-cyan-500 to-cyan-400';
    if (score >= 80) return 'from-amber-500 to-amber-400';
    if (score >= 70) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-rose-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-cyan-500/10';
    if (score >= 80) return 'bg-amber-500/10';
    if (score >= 70) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };

  const getScoreTextColor = (score: number): string => {
    if (score >= 90) return 'text-cyan-300';
    if (score >= 80) return 'text-amber-300';
    if (score >= 70) return 'text-orange-300';
    return 'text-rose-300';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      {/* Header with Status */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LINT-PRO
          </div>
          <div className="text-slate-400 text-sm font-medium">
            Professional Code Analysis Suite
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreTextColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className="text-slate-400 text-sm">Overall Score</div>
          </div>
          
          {/* Circular Progress Gauge */}
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.overallScore / 100)}`}
                className={`transition-all duration-1000 ${
                  result.overallScore >= 90 ? 'text-cyan-400' :
                  result.overallScore >= 80 ? 'text-amber-400' :
                  result.overallScore >= 70 ? 'text-orange-400' :
                  'text-rose-400'
                }`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - result.overallScore / 100)}` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${
                result.overallScore >= 90 ? 'text-cyan-300' :
                result.overallScore >= 80 ? 'text-amber-300' :
                result.overallScore >= 70 ? 'text-orange-300' :
                'text-rose-300'
              }`}>
                {result.overallScore}
              </span>
            </div>
          </div>

          <button
            onClick={onNewEvaluation}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            New Analysis
          </button>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Grade & Overview Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          onHoverStart={() => setActiveCard('overview')}
          onHoverEnd={() => setActiveCard(null)}
          className={`col-span-1 lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
            activeCard === 'overview' ? 'ring-2 ring-cyan-400/50 border-cyan-400/50' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Overview</h3>
            <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getScoreBgColor(result.overallScore)} ${getScoreTextColor(result.overallScore)}`}>
              Grade {result.grade}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Correctness</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getScoreColor(result.correctness.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.correctness.score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="text-cyan-300 text-sm w-12 text-right">{result.correctness.score}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Efficiency</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getScoreColor(result.efficiency.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.efficiency.score}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span className="text-cyan-300 text-sm w-12 text-right">{result.efficiency.score}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Readability</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getScoreColor(result.readability.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.readability.score}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <span className="text-cyan-300 text-sm w-12 text-right">{result.readability.score}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Best Practices</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getScoreColor(result.bestPractices.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.bestPractices.score}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-cyan-300 text-sm w-12 text-right">{result.bestPractices.score}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Results Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          onHoverStart={() => setActiveCard('testing')}
          onHoverEnd={() => setActiveCard(null)}
          className={`col-span-1 lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
            activeCard === 'testing' ? 'ring-2 ring-cyan-400/50 border-cyan-400/50' : ''
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-4">Test Results</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold text-green-400"
                >
                  {result.correctness.testResults.filter(t => t.passed).length}
                </motion.div>
                <div className="text-slate-400 text-sm">Tests Passed</div>
              </div>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl font-bold text-red-400"
                >
                  {result.correctness.testResults.filter(t => !t.passed).length}
                </motion.div>
                <div className="text-slate-400 text-sm">Tests Failed</div>
              </div>
            </div>

            {/* Edge Case Status */}
            <div className="bg-slate-900/50 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Edge Case Handling</h4>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.correctness.edgeCaseHandling.emptyInput ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-slate-300">Empty Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.correctness.edgeCaseHandling.nullHandling ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-slate-300">Null Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.correctness.edgeCaseHandling.largeInputHandling ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-slate-300">Large Input</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance & Complexity Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          onHoverStart={() => setActiveCard('performance')}
          onHoverEnd={() => setActiveCard(null)}
          className={`col-span-1 lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
            activeCard === 'performance' ? 'ring-2 ring-cyan-400/50 border-cyan-400/50' : ''
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-4">Performance</h3>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Complexity Analysis</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Complexity:</span>
                  <span className={`font-bold ${
                    result.efficiency.complexity.timeComplexity === 'O(1)' ? 'text-green-400' :
                    result.efficiency.complexity.timeComplexity === 'O(n)' ? 'text-cyan-400' :
                    result.efficiency.complexity.timeComplexity === 'O(n log n)' ? 'text-amber-400' :
                    result.efficiency.complexity.timeComplexity === 'O(n²)' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {result.efficiency.complexity.timeComplexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className={`font-bold ${
                    result.efficiency.complexity.spaceComplexity === 'O(1)' ? 'text-green-400' :
                    result.efficiency.complexity.spaceComplexity === 'O(n)' ? 'text-cyan-400' :
                    result.efficiency.complexity.spaceComplexity === 'O(n log n)' ? 'text-amber-400' :
                    result.efficiency.complexity.spaceComplexity === 'O(n²)' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {result.efficiency.complexity.spaceComplexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Loop Depth:</span>
                  <span className={`font-bold ${
                    result.efficiency.complexity.loopDepth === 0 ? 'text-green-400' :
                    result.efficiency.complexity.loopDepth === 1 ? 'text-cyan-400' :
                    result.efficiency.complexity.loopDepth === 2 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {result.efficiency.complexity.loopDepth}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Execution:</span>
                  <span className="font-mono text-cyan-300">
                    {result.efficiency.performance.averageTime.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Execution:</span>
                  <span className="font-mono text-cyan-300">
                    {result.efficiency.performance.maxTime.toFixed(2)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Memory Usage:</span>
                  <span className="font-mono text-cyan-300">
                    {(result.efficiency.performance.memoryUsage / 1024).toFixed(2)}KB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Senior Dev Feedback Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          onHoverStart={() => setActiveCard('mentorship')}
          onHoverEnd={() => setActiveCard(null)}
          className={`col-span-1 lg:col-span-3 row-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
            activeCard === 'mentorship' ? 'ring-2 ring-cyan-400/50 border-cyan-400/50' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Senior Developer Feedback</h3>
            <button
              onClick={onToggleDiff}
              className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
            >
              {showDiffView ? 'Hide Diff' : 'Show Diff'}
            </button>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6">
            <div className="font-garamond text-slate-200 leading-relaxed text-lg">
              {result.overallScore >= 90 && (
                <div>
                  <p className="mb-4">
                    <span className="text-cyan-300 font-semibold">Exceptional work!</span> Your code demonstrates professional-level quality with a score of {result.overallScore}/100. The architecture is clean, performance is optimized, and best practices are well implemented.
                  </p>
                  <p>
                    Consider mentoring others and contributing to open-source projects. Your understanding of algorithmic efficiency and code maintainability sets you apart as a senior developer.
                  </p>
                </div>
              )}

              {result.overallScore >= 80 && result.overallScore < 90 && (
                <div>
                  <p className="mb-4">
                    <span className="text-amber-300 font-semibold">Strong performance</span> with {result.overallScore}/100 points. Your code shows good understanding of core concepts with room for refinement.
                  </p>
                  <p>
                    Focus on optimization suggestions provided to reach the next level. Consider studying design patterns and advanced algorithms to elevate your craft further.
                  </p>
                </div>
              )}

              {result.overallScore >= 70 && result.overallScore < 80 && (
                <div>
                  <p className="mb-4">
                    <span className="text-orange-300 font-semibold">Solid foundation</span> with {result.overallScore}/100 points. Your code works but needs improvement in efficiency and readability.
                  </p>
                  <p>
                    Pay special attention to refactor suggestions - they'll help you write more professional code. Practice with larger datasets and edge cases to build robustness.
                  </p>
                </div>
              )}

              {result.overallScore < 70 && (
                <div>
                  <p className="mb-4">
                    <span className="text-red-300 font-semibold">Your code needs significant improvement</span> ({result.overallScore}/100 points). Focus on understanding fundamentals first.
                  </p>
                  <p>
                    Review basic programming concepts, syntax, and problem-solving approaches. Consider working with a mentor or taking foundational courses to build your skills.
                  </p>
                </div>
              )}
            </div>

            {/* Refactor Suggestions */}
            {result.refactorSuggestions.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-white font-semibold mb-3">Actionable Improvements</h4>
                {result.refactorSuggestions.slice(0, 2).map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30"
                  >
                    <h5 className="text-cyan-300 font-semibold mb-2">{suggestion.title}</h5>
                    <p className="text-slate-300 text-sm mb-3">{suggestion.description}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs">
                      <div className="text-red-400 mb-2">Before:</div>
                      <pre className="text-slate-400">{suggestion.currentCode}</pre>
                      <div className="text-green-400 mb-2 mt-3">After:</div>
                      <pre className="text-slate-400">{suggestion.optimizedCode}</pre>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <span className="text-slate-400">Est. Time: {suggestion.estimatedTime}</span>
                      <span className={`px-2 py-1 rounded ${
                        suggestion.priority === 'high' ? 'bg-red-500' :
                        suggestion.priority === 'medium' ? 'bg-amber-500' :
                        'bg-green-500'
                      } text-white`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BentoDashboard;
