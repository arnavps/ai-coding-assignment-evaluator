/**
 * Core type definitions for LINT-PRO AI Coding Evaluator
 * Following SOLID principles with comprehensive type safety
 */

/**
 * Represents a code submission for evaluation
 */
export interface Submission {
  /** Unique identifier for the submission */
  id: string;
  /** The source code to be evaluated */
  code: string;
  /** Programming language (currently only JavaScript/TypeScript supported) */
  language: 'javascript' | 'typescript';
  /** Timestamp of submission */
  timestamp: Date;
  /** Optional problem context */
  problemContext?: ProblemContext;
}

/**
 * Context information about the coding problem
 */
export interface ProblemContext {
  /** Problem identifier */
  problemId: string;
  /** Problem title */
  title: string;
  /** Problem description */
  description: string;
  /** Expected function signature */
  expectedSignature?: string;
  /** Problem difficulty level */
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Complexity analysis results
 */
export interface ComplexityAnalysis {
  /** Time complexity notation */
  timeComplexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Detected loop nesting depth */
  loopDepth: number;
  /** Whether nested loops were detected */
  hasNestedLoops: boolean;
  /** Recursion detection */
  hasRecursion: boolean;
  /** Async/await usage */
  hasAsyncOperations: boolean;
}

/**
 * Variable naming quality assessment
 */
export interface NamingAnalysis {
  /** List of poorly named variables */
  poorNames: VariableIssue[];
  /** Overall naming score (0-100) */
  namingScore: number;
  /** Naming convention compliance */
  followsConvention: boolean;
}

/**
 * Individual variable naming issue
 */
export interface VariableIssue {
  /** Variable name */
  name: string;
  /** Line number where variable appears */
  line: number;
  /** Issue type */
  issueType: 'too-short' | 'non-descriptive' | 'convention-violation';
  /** Suggested better name */
  suggestion: string;
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
}

/**
 * Test case execution result
 */
export interface TestResult {
  /** Test case identifier */
  id: string;
  /** Test case name */
  name: string;
  /** Test case category */
  category: 'edge' | 'normal' | 'performance';
  /** Input data */
  input: any;
  /** Expected output */
  expected: any;
  /** Actual output from code */
  actual: any;
  /** Whether test passed */
  passed: boolean;
  /** Execution time in milliseconds */
  executionTime: number;
  /** Error message if any */
  error?: string;
}

/**
 * Performance metrics from test execution
 */
export interface PerformanceMetrics {
  /** Average execution time across all tests */
  averageTime: number;
  /** Maximum execution time */
  maxTime: number;
  /** Minimum execution time */
  minTime: number;
  /** Total execution time */
  totalTime: number;
  /** Memory usage estimate */
  memoryUsage: number;
  /** Performance issues detected */
  issues: PerformanceIssue[];
}

/**
 * Performance issue details
 */
export interface PerformanceIssue {
  /** Issue description */
  description: string;
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
  /** Affected test case */
  testCase: string;
  /** Optimization suggestion */
  suggestion: string;
}

/**
 * Readability assessment
 */
export interface ReadabilityAnalysis {
  /** Overall readability score (0-100) */
  score: number;
  /** Lines of code */
  linesOfCode: number;
  /** Cyclomatic complexity */
  cyclomaticComplexity: number;
  /** Comment coverage percentage */
  commentCoverage: number;
  /** Function count */
  functionCount: number;
  /** Maximum function length */
  maxFunctionLength: number;
  /** Readability issues */
  issues: ReadabilityIssue[];
}

/**
 * Readability issue details
 */
export interface ReadabilityIssue {
  /** Issue description */
  description: string;
  /** Line number */
  line: number;
  /** Issue type */
  type: 'long-function' | 'deep-nesting' | 'magic-number' | 'missing-comments';
  /** Suggestion for improvement */
  suggestion: string;
}

/**
 * Best practices compliance
 */
export interface BestPracticesAnalysis {
  /** Overall compliance score (0-100) */
  score: number;
  /** Security issues detected */
  securityIssues: SecurityIssue[];
  /** Code quality issues */
  qualityIssues: CodeQualityIssue[];
  /** Design pattern usage */
  patternsUsed: string[];
  /** SOLID principles compliance */
  solidCompliance: SolidCompliance;
}

/**
 * Security issue details
 */
export interface SecurityIssue {
  /** Issue description */
  description: string;
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** CWE identifier if applicable */
  cweId?: string;
  /** Remediation advice */
  remediation: string;
}

/**
 * Code quality issue details
 */
export interface CodeQualityIssue {
  /** Issue description */
  description: string;
  /** Category */
  category: 'duplication' | 'dead-code' | 'anti-pattern' | 'technical-debt';
  /** Suggestion */
  suggestion: string;
}

/**
 * SOLID principles compliance assessment
 */
export interface SolidCompliance {
  /** Single Responsibility Principle compliance (0-100) */
  srp: number;
  /** Open/Closed Principle compliance (0-100) */
  ocp: number;
  /** Liskov Substitution Principle compliance (0-100) */
  lsp: number;
  /** Interface Segregation Principle compliance (0-100) */
  isp: number;
  /** Dependency Inversion Principle compliance (0-100) */
  dip: number;
  /** Overall SOLID score */
  overall: number;
}

/**
 * Actionable refactor suggestion
 */
export interface RefactorSuggestion {
  /** Unique identifier */
  id: string;
  /** Suggestion title */
  title: string;
  /** Detailed description */
  description: string;
  /** Current problematic code */
  currentCode: string;
  /** Optimized code suggestion */
  optimizedCode: string;
  /** Expected improvement */
  improvement: {
    /** Performance gain percentage */
    performanceGain: number;
    /** Readability improvement */
    readabilityGain: number;
    /** Complexity reduction */
    complexityReduction: string;
  };
  /** Priority level */
  priority: 'low' | 'medium' | 'high';
  /** Estimated implementation time */
  estimatedTime: string;
}

/**
 * Comprehensive evaluation result
 */
export interface EvaluationResult {
  /** Result identifier */
  id: string;
  /** Associated submission */
  submission: Submission;
  /** Overall score (0-100) */
  overallScore: number;
  /** Grade assignment */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Correctness analysis (40% weight) */
  correctness: CorrectnessAnalysis;
  /** Efficiency analysis (30% weight) */
  efficiency: EfficiencyAnalysis;
  /** Readability analysis (20% weight) */
  readability: ReadabilityAnalysis;
  /** Best practices analysis (10% weight) */
  bestPractices: BestPracticesAnalysis;
  /** Technical debt assessment */
  technicalDebt: TechnicalDebt;
  /** Actionable refactor suggestions */
  refactorSuggestions: RefactorSuggestion[];
  /** Evaluation metadata */
  metadata: EvaluationMetadata;
}

/**
 * Correctness analysis results
 */
export interface CorrectnessAnalysis {
  /** Score (0-100) */
  score: number;
  /** Test results */
  testResults: TestResult[];
  /** Pass rate percentage */
  passRate: number;
  /** Edge case handling */
  edgeCaseHandling: {
    /** Empty input handling */
    emptyInput: boolean;
    /** Null/undefined handling */
    nullHandling: boolean;
    /** Large input handling */
    largeInputHandling: boolean;
  };
  /** Silent failures detected */
  silentFailures: SilentFailure[];
}

/**
 * Silent failure detection
 */
export interface SilentFailure {
  /** Test case where failure occurred */
  testCase: string;
  /** Type of silent failure */
  type: 'wrong-output' | 'timeout' | 'memory-leak' | 'infinite-loop';
  /** Description */
  description: string;
  /** Suggested fix */
  suggestedFix: string;
}

/**
 * Efficiency analysis results
 */
export interface EfficiencyAnalysis {
  /** Score (0-100) */
  score: number;
  /** Complexity analysis */
  complexity: ComplexityAnalysis;
  /** Performance metrics */
  performance: PerformanceMetrics;
  /** Optimization opportunities */
  optimizationOpportunities: string[];
}

/**
 * Technical debt assessment
 */
export interface TechnicalDebt {
  /** Debt score (0-100) */
  score: number;
  /** Debt level */
  level: 'low' | 'medium' | 'high' | 'critical';
  /** Estimated hours to resolve */
  estimatedHours: number;
  /** Debt categories */
  categories: {
    /** Code complexity debt */
    complexity: number;
    /** Documentation debt */
    documentation: number;
    /** Testing debt */
    testing: number;
    /** Architectural debt */
    architectural: number;
  };
  /** Description */
  description: string;
}

/**
 * Evaluation metadata
 */
export interface EvaluationMetadata {
  /** Evaluation timestamp */
  timestamp: Date;
  /** Evaluation duration in milliseconds */
  duration: number;
  /** Engine version */
  engineVersion: string;
  /** Analysis phases completed */
  phasesCompleted: string[];
  /** Confidence score */
  confidence: number;
}

/**
 * Evaluation state for UI management
 */
export interface EvaluationState {
  /** Current evaluation state */
  status: 'idle' | 'analyzing' | 'testing' | 'generating' | 'completed' | 'error';
  /** Current analysis phase */
  currentPhase?: string;
  /** Progress percentage */
  progress: number;
  /** Error message if any */
  error?: string;
  /** Is processing */
  isProcessing: boolean;
}

/**
 * Scoring weights configuration
 */
export interface ScoringWeights {
  /** Correctness weight (default: 40%) */
  correctness: number;
  /** Efficiency weight (default: 30%) */
  efficiency: number;
  /** Readability weight (default: 20%) */
  readability: number;
  /** Best practices weight (default: 10%) */
  bestPractices: number;
}

/**
 * Logic Interrogator configuration
 */
export interface LogicInterrogatorConfig {
  /** Big-O detection patterns */
  complexityPatterns: ComplexityPattern[];
  /** Naming convention rules */
  namingRules: NamingRule[];
  /** Edge case test patterns */
  edgeCasePatterns: EdgeCasePattern[];
  /** Performance thresholds */
  performanceThresholds: PerformanceThreshold;
}

/**
 * Big-O complexity detection pattern
 */
export interface ComplexityPattern {
  /** Pattern regex */
  pattern: RegExp;
  /** Detected complexity */
  complexity: string;
  /** Description */
  description: string;
}

/**
 * Naming convention rule
 */
export interface NamingRule {
  /** Rule name */
  name: string;
  /** Pattern to match */
  pattern: RegExp;
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
  /** Suggestion template */
  suggestion: string;
}

/**
 * Edge case test pattern
 */
export interface EdgeCasePattern {
  /** Test case name */
  name: string;
  /** Input generator function */
  inputGenerator: () => any;
  /** Expected output generator */
  expectedGenerator: (input: any) => any;
  /** Category */
  category: 'edge' | 'normal' | 'performance';
}

/**
 * Performance threshold configuration
 */
export interface PerformanceThreshold {
  /** Maximum acceptable execution time (ms) */
  maxExecutionTime: number;
  /** Maximum acceptable memory usage (MB) */
  maxMemoryUsage: number;
  /** Large dataset size for performance testing */
  largeDatasetSize: number;
}
