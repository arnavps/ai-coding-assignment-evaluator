# LINT-PRO API Documentation

## Overview

LINT-PRO provides a comprehensive TypeScript-based API for code evaluation, analysis, and feedback generation. This document covers all public interfaces, classes, and methods.

## Core Interfaces

### Submission

```typescript
interface Submission {
  id: string;
  code: string;
  language: 'javascript' | 'typescript';
  timestamp: Date;
  problemContext?: ProblemContext;
}
```

Represents a code submission for evaluation.

### EvaluationResult

```typescript
interface EvaluationResult {
  id: string;
  submission: Submission;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  correctness: CorrectnessAnalysis;
  efficiency: EfficiencyAnalysis;
  readability: ReadabilityAnalysis;
  bestPractices: BestPracticesAnalysis;
  technicalDebt: TechnicalDebt;
  refactorSuggestions: RefactorSuggestion[];
  metadata: EvaluationMetadata;
}
```

Complete evaluation result with all analysis components.

## Core Classes

### LogicInterrogator

Advanced code analysis engine with Big-O detection and pattern matching.

```typescript
class LogicInterrogator {
  constructor(config?: Partial<LogicInterrogatorConfig>);
  
  analyzeComplexity(code: string): ComplexityAnalysis;
  analyzeNaming(code: string): NamingAnalysis;
  generateEdgeCaseTests(code: string, problemType: string): TestResult[];
  executeTests(code: string, testCases: TestResult[]): { results: TestResult[], metrics: PerformanceMetrics };
  generateRefactorSuggestions(code: string, analysis: any): RefactorSuggestion[];
  detectSilentFailures(code: string, testResults: TestResult[]): SilentFailure[];
}
```

#### Methods

##### analyzeComplexity(code: string): ComplexityAnalysis

Analyzes code complexity using AST parsing and pattern matching.

**Parameters:**
- `code`: Source code to analyze

**Returns:** `ComplexityAnalysis` object with time/space complexity metrics

**Example:**
```typescript
const interrogator = new LogicInterrogator();
const complexity = interrogator.analyzeComplexity(myCode);
console.log(complexity.timeComplexity); // "O(n)"
```

##### generateEdgeCaseTests(code: string, problemType: string): TestResult[]

Generates comprehensive edge case test scenarios.

**Parameters:**
- `code`: Source code to test
- `problemType`: Type of problem (e.g., 'two-sum', 'string-reversal')

**Returns:** Array of `TestResult` objects

### EvaluationEngine

Main evaluation orchestrator implementing the 100-point scoring system.

```typescript
class EvaluationEngine {
  constructor(scoringWeights?: Partial<ScoringWeights>);
  
  evaluate(submission: Submission): Promise<EvaluationResult>;
}
```

#### Methods

##### evaluate(submission: Submission): Promise<EvaluationResult>

Evaluates a code submission through all analysis phases.

**Parameters:**
- `submission`: Code submission to evaluate

**Returns:** Promise resolving to `EvaluationResult`

**Example:**
```typescript
const engine = new EvaluationEngine();
const result = await engine.evaluate(submission);
console.log(`Overall Score: ${result.overallScore}/100`);
```

## React Hooks

### useEvaluation

Custom hook for managing evaluation lifecycle and state.

```typescript
const useEvaluation = () => {
  // State
  state: EvaluationState['status'];
  currentPhase: string;
  progress: number;
  result: EvaluationResult | null;
  error: string | null;
  isProcessing: boolean;
  
  // Actions
  evaluate: (code: string, problemContext?: ProblemContext) => Promise<EvaluationResult>;
  reset: () => void;
  retry: () => Promise<EvaluationResult>;
  exportResults: () => string;
  
  // Computed
  statusMessage: string;
  performanceMetrics: PerformanceMetrics | null;
};
```

#### Usage Example

```typescript
import { useEvaluation } from '@/hooks/useEvaluation';

const MyComponent = () => {
  const { 
    evaluate, 
    result, 
    isProcessing, 
    statusMessage,
    reset 
  } = useEvaluation();

  const handleEvaluate = async () => {
    try {
      const evaluation = await evaluate(myCode);
      console.log('Evaluation complete:', evaluation);
    } catch (error) {
      console.error('Evaluation failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleEvaluate} disabled={isProcessing}>
        {isProcessing ? 'Analyzing...' : 'Evaluate Code'}
      </button>
      <p>{statusMessage}</p>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};
```

## React Components

### CodeEditor

Advanced code input component with real-time analysis and scanning animations.

```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  scanningPhase?: string;
  isProcessing?: boolean;
}
```

#### Props

- `value`: Current code value
- `onChange`: Change handler
- `disabled`: Whether editor is disabled
- `scanningPhase`: Current scanning phase for animation
- `isProcessing`: Whether evaluation is in progress

### EvaluationDashboard

Comprehensive results display with staggered animations and typing effects.

```typescript
interface EvaluationDashboardProps {
  result: EvaluationResult;
  onNewEvaluation: () => void;
}
```

#### Features

- Staggered section reveal animations
- Typing effect for mentorship text
- Technical debt gauge visualization
- SOLID principles compliance display
- Actionable refactor suggestions

## Configuration

### ScoringWeights

Configure the 100-point scoring system weights.

```typescript
interface ScoringWeights {
  correctness: number;    // Default: 0.40
  efficiency: number;     // Default: 0.30
  readability: number;    // Default: 0.20
  bestPractices: number;  // Default: 0.10
}
```

### LogicInterrogatorConfig

Configure analysis engine behavior.

```typescript
interface LogicInterrogatorConfig {
  complexityPatterns: ComplexityPattern[];
  namingRules: NamingRule[];
  edgeCasePatterns: EdgeCasePattern[];
  performanceThresholds: PerformanceThreshold;
}
```

## Type Definitions

### ComplexityAnalysis

```typescript
interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  loopDepth: number;
  hasNestedLoops: boolean;
  hasRecursion: boolean;
  hasAsyncOperations: boolean;
}
```

### CorrectnessAnalysis

```typescript
interface CorrectnessAnalysis {
  score: number;
  testResults: TestResult[];
  passRate: number;
  edgeCaseHandling: {
    emptyInput: boolean;
    nullHandling: boolean;
    largeInputHandling: boolean;
  };
  silentFailures: SilentFailure[];
}
```

### TechnicalDebt

```typescript
interface TechnicalDebt {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  categories: {
    complexity: number;
    documentation: number;
    testing: number;
    architectural: number;
  };
  description: string;
}
```

## Error Handling

### Common Error Types

```typescript
// Evaluation errors
class EvaluationError extends Error {
  constructor(message: string, public code: string);
}

// Common error codes
const ERROR_CODES = {
  INVALID_CODE: 'INVALID_CODE',
  SYNTAX_ERROR: 'SYNTAX_ERROR',
  EXECUTION_TIMEOUT: 'EXECUTION_TIMEOUT',
  MEMORY_LIMIT_EXCEEDED: 'MEMORY_LIMIT_EXCEEDED'
};
```

### Error Handling Example

```typescript
try {
  const result = await engine.evaluate(submission);
  return result;
} catch (error) {
  if (error instanceof EvaluationError) {
    switch (error.code) {
      case 'SYNTAX_ERROR':
        console.log('Code has syntax errors');
        break;
      case 'EXECUTION_TIMEOUT':
        console.log('Code execution timed out');
        break;
      default:
        console.log('Unknown evaluation error');
    }
  }
  throw error;
}
```

## Performance Considerations

### Evaluation Speed

- **Small files** (<100 lines): <500ms
- **Medium files** (100-500 lines): <2s
- **Large files** (500+ lines): <5s

### Memory Usage

- **AST parsing**: ~2MB per 1000 lines
- **Test execution**: ~10MB for comprehensive suite
- **UI rendering**: ~50MB with animations

### Optimization Tips

1. **Debounce evaluations** for real-time analysis
2. **Cache results** for repeated code analysis
3. **Use Web Workers** for large file processing
4. **Implement pagination** for test results

## Integration Examples

### Node.js Integration

```typescript
import { EvaluationEngine } from 'lint-pro-core';

const engine = new EvaluationEngine();

async function analyzeCode(code: string) {
  const submission = {
    id: 'analysis-1',
    code,
    language: 'javascript',
    timestamp: new Date()
  };
  
  const result = await engine.evaluate(submission);
  return result;
}
```

### CI/CD Pipeline Integration

```yaml
# GitHub Actions example
- name: Code Quality Check
  uses: lint-pro/action@v2
  with:
    code: ${{ github.workspace }}/src
    threshold: 80
    fail-on-low-score: true
```

### VS Code Extension

```typescript
import { window, workspace } from 'vscode';
import { LogicInterrogator } from 'lint-pro-core';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'lint-pro.analyze',
    async () => {
      const editor = window.activeTextEditor;
      if (editor) {
        const code = editor.document.getText();
        const interrogator = new LogicInterrogator();
        const analysis = interrogator.analyzeComplexity(code);
        
        window.showInformationMessage(
          `Complexity: ${analysis.timeComplexity}`
        );
      }
    }
  );
  
  context.subscriptions.push(disposable);
}
```

## Contributing to API

### Adding New Analysis Types

1. **Extend interfaces** in `src/types/index.ts`
2. **Implement analysis logic** in `src/engine/`
3. **Add UI components** in `src/components/`
4. **Update documentation**

### Custom Pattern Rules

```typescript
const customPatterns: ComplexityPattern[] = [
  {
    pattern: /customPattern/g,
    complexity: 'O(n log n)',
    description: 'Custom pattern detected'
  }
];

const interrogator = new LogicInterrogator({
  complexityPatterns: customPatterns
});
```

## Support

- **Documentation**: [docs.lint-pro.dev](https://docs.lint-pro.dev)
- **API Reference**: [api.lint-pro.dev](https://api.lint-pro.dev)
- **Examples**: [github.com/lint-pro/examples](https://github.com/lint-pro/examples)
- **Issues**: [github.com/lint-pro/issues](https://github.com/lint-pro/issues)
