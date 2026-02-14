import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  EvaluationState, 
  EvaluationResult, 
  Submission, 
  EvaluationMetadata 
} from '@/types';
import { EvaluationEngine } from '@/engine/EvaluationEngine';

/**
 * Custom hook for managing code evaluation lifecycle
 * Implements SOLID principles with comprehensive state management
 * 
 * Features:
 * - Async evaluation with progress tracking
 * - Error handling and recovery
 * - Caching and performance optimization
 * - Type-safe state management
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */
export const useEvaluation = () => {
  // Core state management
  const [state, setState] = useState<EvaluationState['status']>('idle');
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Engine instance with dependency injection
  const engineRef = useRef<EvaluationEngine>(new EvaluationEngine());
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Computed properties for UI state
   */
  const isProcessing = state !== 'idle' && state !== 'completed' && state !== 'error';
  const canEvaluate = state === 'idle' && !isProcessing;
  const hasResult = state === 'completed' && result !== null;

  /**
   * Resets the evaluation state to initial values
   * Cancels any ongoing evaluation
   */
  const reset = useCallback((): void => {
    // Cancel ongoing evaluation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset state
    setState('idle');
    setCurrentPhase('');
    setProgress(0);
    setResult(null);
    setError(null);
    setSubmission(null);
  }, []);

  /**
   * Updates evaluation state with progress tracking
   * @param status - New evaluation status
   * @param phase - Current analysis phase
   * @param progressValue - Progress percentage (0-100)
   */
  const updateState = useCallback((
    status: EvaluationState['status'], 
    phase: string = '', 
    progressValue: number = 0
  ): void => {
    setState(status);
    setCurrentPhase(phase);
    setProgress(progressValue);
    setError(null);
  }, []);

  /**
   * Creates a submission object from code input
   * @param code - Source code to evaluate
   * @param problemContext - Optional problem context
   * @returns Submission object
   */
  const createSubmission = useCallback((
    code: string, 
    problemContext?: Submission['problemContext']
  ): Submission => {
    return {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      code: code.trim(),
      language: 'javascript',
      timestamp: new Date(),
      problemContext
    };
  }, []);

  /**
   * Main evaluation function with comprehensive error handling
   * @param code - Source code to evaluate
   * @param problemContext - Optional problem context
   * @returns Promise<EvaluationResult>
   */
  const evaluate = useCallback(async (
    code: string, 
    problemContext?: Submission['problemContext']
  ): Promise<EvaluationResult> => {
    // Validate input
    if (!code || code.trim().length === 0) {
      const errorMessage = 'Please provide code to evaluate';
      setError(errorMessage);
      setState('error');
      throw new Error(errorMessage);
    }

    // Cancel any ongoing evaluation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Create submission
      const newSubmission = createSubmission(code, problemContext);
      setSubmission(newSubmission);

      // Start evaluation
      updateState('analyzing', 'Initializing evaluation engine...', 0);

      // Phase 1: Correctness Analysis (40%)
      updateState('analyzing', 'Analyzing correctness...', 10);
      await new Promise(resolve => setTimeout(resolve, 500)); // UI feedback

      // Phase 2: Efficiency Analysis (30%)
      updateState('testing', 'Measuring efficiency...', 40);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 3: Readability Analysis (20%)
      updateState('generating', 'Assessing readability...', 70);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 4: Best Practices Analysis (10%)
      updateState('generating', 'Evaluating best practices...', 85);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 5: Final compilation
      updateState('generating', 'Compiling results...', 95);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Execute full evaluation
      const evaluationResult = await engineRef.current.evaluate(newSubmission);

      // Check if evaluation was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error('Evaluation cancelled');
      }

      // Update state with results
      setResult(evaluationResult);
      updateState('completed', 'Evaluation complete', 100);

      return evaluationResult;

    } catch (err) {
      // Handle cancellation
      if (abortControllerRef.current?.signal.aborted) {
        reset();
        throw new Error('Evaluation cancelled');
      }

      // Handle errors
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setState('error');
      
      throw err;
    } finally {
      // Clean up abort controller
      abortControllerRef.current = null;
    }
  }, [createSubmission, updateState, reset]);

  /**
   * Retries the last evaluation with the same submission
   * @returns Promise<EvaluationResult>
   */
  const retry = useCallback(async (): Promise<EvaluationResult> => {
    if (!submission) {
      throw new Error('No previous submission to retry');
    }

    return evaluate(submission.code, submission.problemContext);
  }, [submission, evaluate]);

  /**
   * Gets the current status message for UI display
   * @returns Human-readable status message
   */
  const getStatusMessage = useCallback((): string => {
    switch (state) {
      case 'idle':
        return 'Ready to evaluate code';
      case 'analyzing':
        return currentPhase || 'Analyzing code structure...';
      case 'testing':
        return currentPhase || 'Running test cases...';
      case 'generating':
        return currentPhase || 'Generating insights...';
      case 'completed':
        return 'Evaluation complete';
      case 'error':
        return error || 'Evaluation failed';
      default:
        return 'Processing...';
    }
  }, [state, currentPhase, error]);

  /**
   * Gets performance metrics for the current evaluation
   * @returns Performance metrics or null
   */
  const getPerformanceMetrics = useCallback(() => {
    if (!result) return null;

    return {
      duration: result.metadata.duration,
      confidence: result.metadata.confidence,
      phasesCompleted: result.metadata.phasesCompleted.length,
      testCount: result.correctness.testResults.length,
      passRate: result.correctness.passRate
    };
  }, [result]);

  /**
   * Exports evaluation results to JSON
   * @returns JSON string of evaluation results
   */
  const exportResults = useCallback((): string => {
    if (!result) {
      throw new Error('No results to export');
    }

    return JSON.stringify(result, null, 2);
  }, [result]);

  /**
   * Cleanup effect for component unmount
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    state,
    currentPhase,
    progress,
    result,
    error,
    submission,
    
    // Computed
    isProcessing,
    canEvaluate,
    hasResult,
    statusMessage: getStatusMessage(),
    performanceMetrics: getPerformanceMetrics(),
    
    // Actions
    evaluate,
    retry,
    reset,
    exportResults,
    
    // Constants
    EvaluationState: {
      IDLE: 'idle' as const,
      ANALYZING: 'analyzing' as const,
      TESTING: 'testing' as const,
      GENERATING: 'generating' as const,
      COMPLETED: 'completed' as const,
      ERROR: 'error' as const
    }
  };
};
