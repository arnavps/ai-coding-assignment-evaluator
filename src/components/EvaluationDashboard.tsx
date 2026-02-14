import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvaluationResult } from '@/types';

/**
 * EvaluationDashboard Component - Comprehensive results display with staggered animations
 * Features typing effects, technical debt visualization, and actionable insights
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */

interface EvaluationDashboardProps {
  /** Evaluation results to display */
  result: EvaluationResult;
  /** Callback for new evaluation */
  onNewEvaluation: () => void;
}

const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({
  result,
  onNewEvaluation
}) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [typedText, setTypedText] = useState<Record<string, string>>({});

  // Staggered section reveal with typing effect
  useEffect(() => {
    const sections = ['overview', 'correctness', 'efficiency', 'readability', 'bestPractices', 'technicalDebt'];
    const delays = [0, 800, 1600, 2400, 3200, 4000];

    sections.forEach((section, index) => {
      setTimeout(() => {
        setVisibleSections(prev => new Set(prev).add(section));
        
        // Start typing effect for mentorship text
        if (section === 'bestPractices') {
          startTypingEffect(section, getMentorshipText(result));
        }
      }, delays[index]);
    });
  }, [result]);

  // Typing effect implementation
  const startTypingEffect = (section: string, text: string) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypedText(prev => ({
          ...prev,
          [section]: text.substring(0, currentIndex)
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  // Get mentorship text based on results
  const getMentorshipText = (result: EvaluationResult): string => {
    const { grade, overallScore } = result;
    
    if (grade === 'A') {
      return `Exceptional work! Your code demonstrates professional-level quality with a score of ${overallScore}/100. The architecture is clean, performance is optimized, and best practices are well implemented. Consider mentoring others and contributing to open-source projects.`;
    } else if (grade === 'B') {
      return `Strong performance with ${overallScore}/100 points. Your code shows good understanding of core concepts with room for refinement. Focus on the optimization suggestions provided to reach the next level. Consider studying design patterns and advanced algorithms.`;
    } else if (grade === 'C') {
      return `Solid foundation with ${overallScore}/100 points. Your code works but needs improvement in efficiency and readability. Pay special attention to the refactor suggestions - they'll help you write more professional code. Practice with larger datasets and edge cases.`;
    } else if (grade === 'D') {
      return `Your code needs significant improvement (${overallScore}/100). Focus on understanding the fundamentals first - algorithm complexity, proper error handling, and code organization. Start with simpler problems and gradually increase complexity.`;
    } else {
      return `Critical issues detected (${overallScore}/100). Your code has fundamental problems that need immediate attention. Review basic programming concepts, syntax, and problem-solving approaches. Consider working with a mentor or taking foundational courses.`;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'text-success';
      case 'B': return 'text-warning';
      case 'C': return 'text-warning';
      case 'D': return 'text-error';
      case 'F': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <AnimatePresence>
        {visibleSections.has('overview') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border-2 border-border-default rounded-2xl p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Grade Display */}
                <div className="text-center">
                  <div className={`text-6xl font-bold font-helvetica ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                  <div className="text-text-secondary font-helvetica text-sm mt-2">
                    Grade
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="font-helvetica text-text-primary font-semibold">
                      Overall Score:
                    </span>
                    <span className={`text-2xl font-bold font-helvetica ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}/100
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">Correctness:</span>
                      <span className={`font-semibold ${getScoreColor(result.correctness.score)}`}>
                        {result.correctness.score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">Efficiency:</span>
                      <span className={`font-semibold ${getScoreColor(result.efficiency.score)}`}>
                        {result.efficiency.score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">Readability:</span>
                      <span className={`font-semibold ${getScoreColor(result.readability.score)}`}>
                        {result.readability.score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary">Best Practices:</span>
                      <span className={`font-semibold ${getScoreColor(result.bestPractices.score)}`}>
                        {result.bestPractices.score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onNewEvaluation}
                className="px-6 py-3 bg-success text-midnight-obsidian font-helvetica font-semibold rounded-lg hover:bg-success/90 transition-colors"
              >
                Evaluate New Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Correctness Analysis */}
      <AnimatePresence>
        {visibleSections.has('correctness') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border border-border-default rounded-xl p-6"
          >
            <h3 className="text-xl font-bold font-helvetica text-text-primary mb-4">
              Correctness Analysis (40%)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold font-helvetica ${getScoreColor(result.correctness.score)}`}>
                  {result.correctness.passRate.toFixed(1)}%
                </div>
                <div className="text-text-secondary text-sm mt-1">Test Pass Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold font-helvetica text-success">
                  {result.correctness.testResults.filter(t => t.passed).length}
                </div>
                <div className="text-text-secondary text-sm mt-1">Tests Passed</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold font-helvetica text-warning">
                  {result.correctness.silentFailures.length}
                </div>
                <div className="text-text-secondary text-sm mt-1">Silent Failures</div>
              </div>
            </div>

            {/* Edge Case Handling */}
            <div className="mt-6 p-4 bg-midnight-obsidian rounded-lg">
              <h4 className="font-semibold font-helvetica text-text-primary mb-3">Edge Case Handling</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${result.correctness.edgeCaseHandling.emptyInput ? 'bg-success' : 'bg-error'}`} />
                  <span className="text-text-secondary">Empty Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${result.correctness.edgeCaseHandling.nullHandling ? 'bg-success' : 'bg-error'}`} />
                  <span className="text-text-secondary">Null Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${result.correctness.edgeCaseHandling.largeInputHandling ? 'bg-success' : 'bg-error'}`} />
                  <span className="text-text-secondary">Large Input</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efficiency Analysis */}
      <AnimatePresence>
        {visibleSections.has('efficiency') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border border-border-default rounded-xl p-6"
          >
            <h3 className="text-xl font-bold font-helvetica text-text-primary mb-4">
              Efficiency Analysis (30%)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Complexity Metrics */}
              <div>
                <h4 className="font-semibold font-helvetica text-text-primary mb-3">Complexity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Time Complexity:</span>
                    <span className="font-mono text-text-primary">{result.efficiency.complexity.timeComplexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Space Complexity:</span>
                    <span className="font-mono text-text-primary">{result.efficiency.complexity.spaceComplexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Loop Depth:</span>
                    <span className="font-mono text-text-primary">{result.efficiency.complexity.loopDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Nested Loops:</span>
                    <span className={`font-semibold ${result.efficiency.complexity.hasNestedLoops ? 'text-error' : 'text-success'}`}>
                      {result.efficiency.complexity.hasNestedLoops ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold font-helvetica text-text-primary mb-3">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Avg Execution:</span>
                    <span className="font-mono text-text-primary">{result.efficiency.performance.averageTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Max Execution:</span>
                    <span className="font-mono text-text-primary">{result.efficiency.performance.maxTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Memory Usage:</span>
                    <span className="font-mono text-text-primary">{(result.efficiency.performance.memoryUsage / 1024).toFixed(2)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Performance Issues:</span>
                    <span className={`font-semibold ${result.efficiency.performance.issues.length > 0 ? 'text-warning' : 'text-success'}`}>
                      {result.efficiency.performance.issues.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Readability Analysis */}
      <AnimatePresence>
        {visibleSections.has('readability') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border border-border-default rounded-xl p-6"
          >
            <h3 className="text-xl font-bold font-helvetica text-text-primary mb-4">
              Readability Analysis (20%)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold font-helvetica text-text-primary">
                  {result.readability.linesOfCode}
                </div>
                <div className="text-text-secondary text-xs mt-1">Lines of Code</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-helvetica text-text-primary">
                  {result.readability.cyclomaticComplexity}
                </div>
                <div className="text-text-secondary text-xs mt-1">Cyclomatic Complexity</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-helvetica text-text-primary">
                  {result.readability.commentCoverage}%
                </div>
                <div className="text-text-secondary text-xs mt-1">Comment Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-helvetica text-text-primary">
                  {result.readability.functionCount}
                </div>
                <div className="text-text-secondary text-xs mt-1">Functions</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Best Practices & Mentorship */}
      <AnimatePresence>
        {visibleSections.has('bestPractices') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border border-border-default rounded-xl p-6"
          >
            <h3 className="text-xl font-bold font-helvetica text-text-primary mb-4">
              Senior Developer Mentorship
            </h3>
            
            {/* Typing Effect for Mentorship Text */}
            <div className="mb-6 p-6 bg-midnight-obsidian rounded-lg border-l-4 border-success">
              <div className="font-garamond text-text-primary leading-relaxed text-lg">
                {typedText.bestPractices || ''}
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {/* SOLID Principles */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(result.bestPractices.solidCompliance).map(([principle, score]) => (
                <div key={principle} className="text-center">
                  <div className={`text-lg font-bold font-helvetica ${getScoreColor(score)}`}>
                    {score}%
                  </div>
                  <div className="text-text-secondary text-xs mt-1">
                    {principle.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technical Debt */}
      <AnimatePresence>
        {visibleSections.has('technicalDebt') && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-obsidian-secondary border border-border-default rounded-xl p-6"
          >
            <h3 className="text-xl font-bold font-helvetica text-text-primary mb-4">
              Technical Debt Analysis
            </h3>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={`text-3xl font-bold font-helvetica ${
                  result.technicalDebt.level === 'low' ? 'text-success' :
                  result.technicalDebt.level === 'medium' ? 'text-warning' :
                  result.technicalDebt.level === 'high' ? 'text-error' : 'text-error'
                }`}>
                  {result.technicalDebt.score}%
                </div>
                <div className="text-text-secondary mt-1">
                  {result.technicalDebt.level.toUpperCase()} • {result.technicalDebt.estimatedHours}h to resolve
                </div>
              </div>
              
              {/* Technical Debt Gauge */}
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-border-default"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.technicalDebt.score / 100)}`}
                    className={`transition-all duration-1000 ${
                      result.technicalDebt.level === 'low' ? 'text-success' :
                      result.technicalDebt.level === 'medium' ? 'text-warning' :
                      result.technicalDebt.level === 'high' ? 'text-error' : 'text-error'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold font-helvetica ${
                    result.technicalDebt.level === 'low' ? 'text-success' :
                    result.technicalDebt.level === 'medium' ? 'text-warning' :
                    result.technicalDebt.level === 'high' ? 'text-error' : 'text-error'
                  }`}>
                    {result.technicalDebt.score}%
                  </span>
                </div>
              </div>
            </div>

            <p className="font-garamond text-text-secondary italic">
              {result.technicalDebt.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EvaluationDashboard;
