import { useState, useCallback, useRef } from 'react';
import { analyzeComplexity, detectPatterns, extractFunctions } from '../utils/astAnalyzer';
import { runTestSuite, detectProblemType, generatePerformanceMetrics } from '../utils/testRunner';
import { generateAdvice, calculateTechnicalDebt } from '../utils/explainabilityEngine';

// Evaluation states
export const EVALUATION_STATES = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  TESTING: 'testing',
  GENERATING: 'generating',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Scanning stages for animation
const SCANNING_STAGES = [
  { id: 1, text: 'Constructing AST...', duration: 800 },
  { id: 2, text: 'Analyzing Complexity...', duration: 600 },
  { id: 3, text: 'Running Edge Cases...', duration: 1000 },
  { id: 4, text: 'Synthesizing Mentorship...', duration: 700 }
];

/**
 * Custom hook for managing code evaluation state and logic
 */
export const useEvaluator = () => {
  const [state, setState] = useState(EVALUATION_STATES.IDLE);
  const [currentStage, setCurrentStage] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const evaluationTimeoutRef = useRef(null);

  /**
   * Reset evaluator to initial state
   */
  const reset = useCallback(() => {
    setState(EVALUATION_STATES.IDLE);
    setCurrentStage(null);
    setResults(null);
    setError(null);
    if (evaluationTimeoutRef.current) {
      clearTimeout(evaluationTimeoutRef.current);
    }
  }, []);

  /**
   * Update scanning stage with timeout for animation
   */
  const updateStage = useCallback((stageIndex) => {
    if (stageIndex < SCANNING_STAGES.length) {
      const stage = SCANNING_STAGES[stageIndex];
      setCurrentStage(stage);

      evaluationTimeoutRef.current = setTimeout(() => {
        updateStage(stageIndex + 1);
      }, stage.duration);
    }
  }, []);

  /**
   * Main evaluation function - processes code through all logic gates
   */
  const evaluateCode = useCallback(async (codeToEvaluate) => {
    if (!codeToEvaluate || codeToEvaluate.trim().length === 0) {
      setError('Please provide code to evaluate');
      setState(EVALUATION_STATES.ERROR);
      return;
    }

    try {
      reset();
      setCode(codeToEvaluate);
      setState(EVALUATION_STATES.ANALYZING);
      setCurrentStage(SCANNING_STAGES[0]);

      // Logic Gate A: Structural Analysis
      const structuralAnalysis = analyzeComplexity(codeToEvaluate);
      const patterns = detectPatterns(codeToEvaluate);
      const functions = extractFunctions(codeToEvaluate);

      // Move to next stage
      setCurrentStage(SCANNING_STAGES[1]);

      // Logic Gate B: Edge-Case Testing
      setState(EVALUATION_STATES.TESTING);
      setCurrentStage(SCANNING_STAGES[2]);

      const problemType = detectProblemType(codeToEvaluate);
      const testResults = runTestSuite(codeToEvaluate, problemType);
      const performanceMetrics = generatePerformanceMetrics(testResults.results || []);

      // Move to final stage
      setCurrentStage(SCANNING_STAGES[3]);

      // Logic Gate C: Explainability Engine
      setState(EVALUATION_STATES.GENERATING);

      const advice = generateAdvice(structuralAnalysis, testResults);
      const technicalDebt = calculateTechnicalDebt(structuralAnalysis, testResults);

      // Calculate overall scores
      const overallScore = calculateOverallScore(
        structuralAnalysis,
        testResults,
        performanceMetrics
      );

      const evaluationResults = {
        timestamp: new Date().toISOString(),
        code: codeToEvaluate,
        problemType,
        structuralAnalysis: {
          ...structuralAnalysis,
          patterns,
          functions
        },
        testResults: {
          ...testResults,
          performanceMetrics
        },
        advice,
        technicalDebt,
        overallScore,
        summary: generateSummary(structuralAnalysis, testResults, advice, technicalDebt)
      };

      // Complete evaluation
      setState(EVALUATION_STATES.COMPLETED);
      setResults(evaluationResults);
      setCurrentStage(null);

    } catch (err) {
      console.error('Evaluation error:', err);
      setError(`Evaluation failed: ${err.message}`);
      setState(EVALUATION_STATES.ERROR);
      setCurrentStage(null);
    }
  }, [reset]);

  /**
   * Calculate overall score from all analysis components
   */
  const calculateOverallScore = useCallback((structural, tests, performance) => {
    const structureScore = structural.qualityScore || 0;
    const testScore = tests.summary?.score || 0;
    const performanceScore = calculatePerformanceScore(performance);

    // Weighted average: Structure 30%, Tests 50%, Performance 20%
    return Math.round((structureScore * 0.3) + (testScore * 0.5) + (performanceScore * 0.2));
  }, []);

  /**
   * Calculate performance score based on execution metrics
   */
  const calculatePerformanceScore = (metrics) => {
    if (!metrics.averageTime) return 100;

    // Score based on average execution time
    if (metrics.averageTime < 10) return 100;
    if (metrics.averageTime < 50) return 90;
    if (metrics.averageTime < 100) return 80;
    if (metrics.averageTime < 500) return 60;
    if (metrics.averageTime < 1000) return 40;
    return 20;
  };

  /**
   * Generate comprehensive summary
   */
  const generateSummary = useCallback((structural, tests, advice, debt) => {
    const summary = {
      grade: 'A',
      strengths: [],
      improvements: [],
      recommendations: []
    };

    // Determine grade based on scores
    const overallScore = calculateOverallScore(structural, tests, { averageTime: 0 });

    if (overallScore >= 90) summary.grade = 'A';
    else if (overallScore >= 80) summary.grade = 'B';
    else if (overallScore >= 70) summary.grade = 'C';
    else if (overallScore >= 60) summary.grade = 'D';
    else summary.grade = 'F';

    // Identify strengths
    if (structural.qualityScore >= 80) {
      summary.strengths.push('Well-structured code with good complexity');
    }

    if (tests.summary?.score >= 80) {
      summary.strengths.push('Comprehensive test coverage');
    }

    if (structural.variableNamingIssues.length === 0) {
      summary.strengths.push('Excellent variable naming conventions');
    }

    // Identify improvements needed
    if (structural.nestedLoops) {
      summary.improvements.push('Optimize nested loops for better performance');
    }

    if (tests.summary?.score < 80) {
      summary.improvements.push('Improve test case handling');
    }

    if (debt.score > 50) {
      summary.improvements.push('Reduce technical debt');
    }

    // Add recommendations from advice
    if (advice.nextSteps && advice.nextSteps.length > 0) {
      summary.recommendations = advice.nextSteps.slice(0, 3).map(step => step.action);
    }

    return summary;
  }, []);

  /**
   * Get current status message for UI
   */
  const getStatusMessage = () => {
    switch (state) {
      case EVALUATION_STATES.IDLE:
        return 'Ready to evaluate code';
      case EVALUATION_STATES.ANALYZING:
        return currentStage?.text || 'Analyzing code structure...';
      case EVALUATION_STATES.TESTING:
        return currentStage?.text || 'Running test cases...';
      case EVALUATION_STATES.GENERATING:
        return currentStage?.text || 'Generating insights...';
      case EVALUATION_STATES.COMPLETED:
        return 'Evaluation complete';
      case EVALUATION_STATES.ERROR:
        return error || 'Evaluation failed';
      default:
        return 'Processing...';
    }
  };

  /**
   * Check if evaluator is busy
   */
  const isProcessing = state !== EVALUATION_STATES.IDLE &&
    state !== EVALUATION_STATES.COMPLETED &&
    state !== EVALUATION_STATES.ERROR;

  return {
    // State
    state,
    currentStage,
    results,
    error,
    code,
    isProcessing,

    // Actions
    evaluateCode,
    reset,
    setCode,

    // Computed
    statusMessage: getStatusMessage(),
    hasResults: state === EVALUATION_STATES.COMPLETED && results !== null,

    // Constants
    EVALUATION_STATES,
    SCANNING_STAGES
  };
};
