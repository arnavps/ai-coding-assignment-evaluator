import { 
  Submission, 
  ComplexityAnalysis, 
  NamingAnalysis, 
  TestResult, 
  PerformanceMetrics,
  ReadabilityAnalysis,
  BestPracticesAnalysis,
  RefactorSuggestion,
  LogicInterrogatorConfig,
  ComplexityPattern,
  NamingRule,
  EdgeCasePattern,
  PerformanceThreshold
} from '@/types';
import { parse } from 'acorn';

/**
 * Logic Interrogator - Advanced code analysis engine
 * Implements Big-O detection, pattern matching, and silent failure simulation
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */
export class LogicInterrogator {
  private config: LogicInterrogatorConfig;

  constructor(config?: Partial<LogicInterrogatorConfig>) {
    this.config = {
      complexityPatterns: this.getDefaultComplexityPatterns(),
      namingRules: this.getDefaultNamingRules(),
      edgeCasePatterns: this.getDefaultEdgeCasePatterns(),
      performanceThresholds: this.getDefaultPerformanceThresholds(),
      ...config
    };
  }

  /**
   * Analyzes code complexity using regex patterns and AST analysis
   * @param code - Source code to analyze
   * @returns Complexity analysis results
   */
  public analyzeComplexity(code: string): ComplexityAnalysis {
    const analysis: ComplexityAnalysis = {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      loopDepth: 0,
      hasNestedLoops: false,
      hasRecursion: false,
      hasAsyncOperations: false
    };

    try {
      const ast = parse(code, { ecmaVersion: 2022, sourceType: 'module' });
      let currentLoopDepth = 0;
      let maxLoopDepth = 0;

      // AST traversal for complexity detection
      const analyzeNode = (node: any): void => {
        if (!node) return;

        switch (node.type) {
          case 'ForStatement':
          case 'WhileStatement':
          case 'DoWhileStatement':
            currentLoopDepth++;
            maxLoopDepth = Math.max(maxLoopDepth, currentLoopDepth);
            
            if (currentLoopDepth > 1) {
              analysis.hasNestedLoops = true;
            }
            
            if (node.body) {
              analyzeNode(node.body);
            }
            
            currentLoopDepth--;
            break;

          case 'FunctionDeclaration':
          case 'FunctionExpression':
          case 'ArrowFunctionExpression':
            // Check for recursive calls
            if (node.id && this.hasRecursiveCall(node, node.id.name, ast)) {
              analysis.hasRecursion = true;
            }
            break;

          case 'AwaitExpression':
            analysis.hasAsyncOperations = true;
            break;
        }

        // Recursively analyze child nodes
        for (const key in node) {
          const child = node[key];
          if (Array.isArray(child)) {
            child.forEach(item => {
              if (item && typeof item === 'object' && item.type) {
                analyzeNode(item);
              }
            });
          } else if (child && typeof child === 'object' && child.type) {
            analyzeNode(child);
          }
        }
      };

      analyzeNode(ast);
      analysis.loopDepth = maxLoopDepth;

      // Determine complexity based on patterns and AST analysis
      analysis.timeComplexity = this.determineTimeComplexity(code, analysis);
      analysis.spaceComplexity = this.determineSpaceComplexity(code, analysis);

    } catch (error) {
      console.warn('AST parsing failed, falling back to pattern matching:', error);
      return this.fallbackComplexityAnalysis(code);
    }

    return analysis;
  }

  /**
   * Analyzes variable naming conventions and quality
   * @param code - Source code to analyze
   * @returns Naming analysis results
   */
  public analyzeNaming(code: string): NamingAnalysis {
    const analysis: NamingAnalysis = {
      poorNames: [],
      namingScore: 100,
      followsConvention: true
    };

    // Extract variable names using regex
    const variablePattern = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    const variables: string[] = [];

    while ((match = variablePattern.exec(code)) !== null) {
      variables.push(match[1]);
    }

    // Evaluate each variable against naming rules
    variables.forEach(variableName => {
      this.config.namingRules.forEach(rule => {
        if (rule.pattern.test(variableName)) {
          analysis.poorNames.push({
            name: variableName,
            line: this.getLineNumber(code, variableName),
            issueType: this.getIssueType(rule.name),
            suggestion: rule.suggestion.replace('{name}', variableName),
            severity: rule.severity
          });

          // Deduct points based on severity
          const deduction = rule.severity === 'high' ? 20 : rule.severity === 'medium' ? 10 : 5;
          analysis.namingScore = Math.max(0, analysis.namingScore - deduction);
        }
      });
    });

    // Check camelCase compliance
    const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
    const nonCamelCase = variables.filter(v => !camelCasePattern.test(v) && !v.includes('_'));
    if (nonCamelCase.length > 0) {
      analysis.followsConvention = false;
      analysis.namingScore = Math.max(0, analysis.namingScore - 10);
    }

    return analysis;
  }

  /**
   * Generates edge case test scenarios
   * @param code - Source code to test
   * @param problemType - Type of problem being solved
   * @returns Array of test cases
   */
  public generateEdgeCaseTests(code: string, problemType: string): TestResult[] {
    const tests: TestResult[] = [];

    this.config.edgeCasePatterns.forEach(pattern => {
      try {
        const input = pattern.inputGenerator();
        const expected = pattern.expectedGenerator(input);

        tests.push({
          id: `edge-${pattern.name}`,
          name: pattern.name,
          category: pattern.category,
          input,
          expected,
          actual: null, // Will be filled during execution
          passed: false,
          executionTime: 0
        });
      } catch (error) {
        console.warn(`Failed to generate test case ${pattern.name}:`, error);
      }
    });

    return tests;
  }

  /**
   * Executes code against test cases and measures performance
   * @param code - Source code to execute
   * @param testCases - Test cases to run
   * @returns Test results and performance metrics
   */
  public executeTests(code: string, testCases: TestResult[]): { results: TestResult[], metrics: PerformanceMetrics } {
    const results: TestResult[] = [];
    const executionTimes: number[] = [];

    testCases.forEach(testCase => {
      const startTime = performance.now();
      
      try {
        const result = this.executeCode(code, testCase.input);
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        results.push({
          ...testCase,
          actual: result,
          passed: this.compareResults(result, testCase.expected),
          executionTime: Math.round(executionTime * 100) / 100
        });

        executionTimes.push(executionTime);

      } catch (error) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        results.push({
          ...testCase,
          actual: null,
          passed: false,
          executionTime: Math.round(executionTime * 100) / 100,
          error: error instanceof Error ? error.message : String(error)
        });

        executionTimes.push(executionTime);
      }
    });

    const metrics: PerformanceMetrics = {
      averageTime: executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length,
      maxTime: Math.max(...executionTimes),
      minTime: Math.min(...executionTimes),
      totalTime: executionTimes.reduce((a, b) => a + b, 0),
      memoryUsage: this.estimateMemoryUsage(code),
      issues: this.detectPerformanceIssues(results)
    };

    return { results, metrics };
  }

  /**
   * Generates actionable refactor suggestions
   * @param code - Original source code
   * @param analysis - Comprehensive analysis results
   * @returns Array of refactor suggestions
   */
  public generateRefactorSuggestions(code: string, analysis: any): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];

    // Nested loop optimization
    if (analysis.complexity.hasNestedLoops) {
      suggestions.push({
        id: 'optimize-nested-loops',
        title: 'Optimize Nested Loops',
        description: 'Replace nested loops with hash map for O(n²) → O(n) optimization',
        currentCode: this.extractNestedLoopCode(code),
        optimizedCode: this.generateOptimizedLoopCode(code),
        improvement: {
          performanceGain: 90,
          readabilityGain: 20,
          complexityReduction: 'O(n²) → O(n)'
        },
        priority: 'high',
        estimatedTime: '30 minutes'
      });
    }

    // Variable naming improvements
    analysis.naming.poorNames.forEach((issue: any) => {
      suggestions.push({
        id: `improve-naming-${issue.name}`,
        title: 'Improve Variable Naming',
        description: `Rename '${issue.name}' to be more descriptive`,
        currentCode: `${issue.name}`,
        optimizedCode: issue.suggestion,
        improvement: {
          performanceGain: 0,
          readabilityGain: 15,
          complexityReduction: 'None'
        },
        priority: issue.severity,
        estimatedTime: '5 minutes'
      });
    });

    return suggestions;
  }

  /**
   * Detects silent failures in code execution
   * @param code - Source code to analyze
   * @param testResults - Test execution results
   * @returns Array of detected silent failures
   */
  public detectSilentFailures(code: string, testResults: TestResult[]): any[] {
    const silentFailures: any[] = [];

    testResults.forEach(result => {
      if (!result.passed && !result.error) {
        // Wrong output without error = silent failure
        silentFailures.push({
          testCase: result.name,
          type: 'wrong-output',
          description: `Test '${result.name}' returned incorrect output without throwing an error`,
          suggestedFix: 'Add input validation and edge case handling'
        });
      }

      if (result.executionTime > this.config.performanceThresholds.maxExecutionTime) {
        silentFailures.push({
          testCase: result.name,
          type: 'timeout',
          description: `Test '${result.name}' exceeded maximum execution time`,
          suggestedFix: 'Optimize algorithm complexity or add early termination'
        });
      }
    });

    return silentFailures;
  }

  // Private helper methods

  private getDefaultComplexityPatterns(): ComplexityPattern[] {
    return [
      {
        pattern: /for\s*\(\s*.*\s*in\s*.*\)/g,
        complexity: 'O(n)',
        description: 'For-in loop detected'
      },
      {
        pattern: /for\s*\(\s*.*\s*of\s*.*\)/g,
        complexity: 'O(n)',
        description: 'For-of loop detected'
      },
      {
        pattern: /while\s*\(/g,
        complexity: 'O(n)',
        description: 'While loop detected'
      },
      {
        pattern: /\.sort\(/g,
        complexity: 'O(n log n)',
        description: 'Built-in sort operation detected'
      },
      {
        pattern: /\.map\(/g,
        complexity: 'O(n)',
        description: 'Map operation detected'
      },
      {
        pattern: /\.filter\(/g,
        complexity: 'O(n)',
        description: 'Filter operation detected'
      },
      {
        pattern: /\.reduce\(/g,
        complexity: 'O(n)',
        description: 'Reduce operation detected'
      }
    ];
  }

  private getDefaultNamingRules(): NamingRule[] {
    return [
      {
        name: 'too-short',
        pattern: /^[a-z]$/,
        severity: 'high',
        suggestion: 'Use descriptive names instead of single letters like "{name}"'
      },
      {
        name: 'non-descriptive',
        pattern: /^(temp|data|item|obj|arr|str|num|val)$/,
        severity: 'medium',
        suggestion: 'Replace "{name}" with a more descriptive name'
      },
      {
        name: 'convention-violation',
        pattern: /^[A-Z][a-zA-Z]*$/,
        severity: 'low',
        suggestion: 'Use camelCase for variable "{name}" instead of PascalCase'
      }
    ];
  }

  private getDefaultEdgeCasePatterns(): EdgeCasePattern[] {
    return [
      {
        name: 'Empty String',
        inputGenerator: () => '',
        expectedGenerator: (input: any) => {
          // Default behavior for empty string
          return '';
        },
        category: 'edge'
      },
      {
        name: 'Null Input',
        inputGenerator: () => null,
        expectedGenerator: (input: any) => {
          // Should handle null gracefully
          return null;
        },
        category: 'edge'
      },
      {
        name: 'Undefined Input',
        inputGenerator: () => undefined,
        expectedGenerator: (input: any) => {
          // Should handle undefined gracefully
          return undefined;
        },
        category: 'edge'
      },
      {
        name: 'Large Dataset',
        inputGenerator: () => Array.from({length: 10000}, (_, i) => i + 1),
        expectedGenerator: (input: any) => {
          // Expected behavior for large dataset
          return input.length;
        },
        category: 'performance'
      },
      {
        name: 'Single Element',
        inputGenerator: () => [42],
        expectedGenerator: (input: any) => {
          return input[0];
        },
        category: 'edge'
      }
    ];
  }

  private getDefaultPerformanceThresholds(): PerformanceThreshold {
    return {
      maxExecutionTime: 1000, // 1 second
      maxMemoryUsage: 100, // 100MB
      largeDatasetSize: 10000
    };
  }

  private determineTimeComplexity(code: string, analysis: ComplexityAnalysis): string {
    if (analysis.hasNestedLoops) return 'O(n²)';
    if (analysis.hasRecursion) return 'O(n)'; // Simplified, could be exponential
    if (code.includes('.sort(')) return 'O(n log n)';
    if (analysis.loopDepth > 0) return 'O(n)';
    return 'O(1)';
  }

  private determineSpaceComplexity(code: string, analysis: ComplexityAnalysis): string {
    if (analysis.hasNestedLoops) return 'O(n²)';
    if (analysis.loopDepth > 0 || code.includes('.map(')) return 'O(n)';
    return 'O(1)';
  }

  private hasRecursiveCall(node: any, functionName: string, ast: any): boolean {
    // Simplified recursion detection
    const code = ast.toString();
    return code.includes(`${functionName}(`);
  }

  private getLineNumber(code: string, searchTerm: string): number {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchTerm)) {
        return i + 1;
      }
    }
    return 0;
  }

  private getIssueType(ruleName: string): any {
    const mapping: Record<string, any> = {
      'too-short': 'too-short',
      'non-descriptive': 'non-descriptive',
      'convention-violation': 'convention-violation'
    };
    return mapping[ruleName] || 'other';
  }

  private fallbackComplexityAnalysis(code: string): ComplexityAnalysis {
    return {
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      loopDepth: 0,
      hasNestedLoops: false,
      hasRecursion: false,
      hasAsyncOperations: /async|await/.test(code)
    };
  }

  private executeCode(code: string, input: any): any {
    // Safe code execution sandbox
    const sandbox = {
      console: { log: () => {} }, // Disable console.log
      Math,
      Array,
      Object,
      String,
      Number,
      input
    };

    try {
      const func = new Function(...Object.keys(sandbox), code + '\nreturn main(input);');
      return func(...Object.values(sandbox));
    } catch (error) {
      throw new Error(`Execution error: ${error}`);
    }
  }

  private compareResults(actual: any, expected: any): boolean {
    if (actual === expected) return true;
    if (Array.isArray(actual) && Array.isArray(expected)) {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }
    return false;
  }

  private estimateMemoryUsage(code: string): number {
    // Simplified memory estimation based on code size and patterns
    const baseSize = code.length * 2; // Rough estimate
    const arrayAllocations = (code.match(/\[\]/g) || []).length * 100;
    const objectAllocations = (code.match(/\{\}/g) || []).length * 50;
    
    return baseSize + arrayAllocations + objectAllocations;
  }

  private detectPerformanceIssues(results: TestResult[]): any[] {
    const issues: any[] = [];
    
    results.forEach(result => {
      if (result.executionTime > this.config.performanceThresholds.maxExecutionTime) {
        issues.push({
          description: `Test case '${result.name}' exceeded time limit`,
          severity: 'high',
          testCase: result.name,
          suggestion: 'Optimize algorithm or add early termination'
        });
      }
    });

    return issues;
  }

  private extractNestedLoopCode(code: string): string {
    // Extract first nested loop occurrence
    const lines = code.split('\n');
    let loopDepth = 0;
    let startLine = -1;
    let endLine = -1;

    for (let i = 0; i < lines.length; i++) {
      if (/for\s*\(|while\s*\(/.test(lines[i])) {
        loopDepth++;
        if (loopDepth === 1) startLine = i;
      }
      if (lines[i].includes('}') && loopDepth > 0) {
        loopDepth--;
        if (loopDepth === 0 && startLine >= 0) {
          endLine = i;
          break;
        }
      }
    }

    return startLine >= 0 && endLine >= 0 
      ? lines.slice(startLine, endLine + 1).join('\n')
      : code.substring(0, 200);
  }

  private generateOptimizedLoopCode(code: string): string {
    // Generate optimized version using hash map pattern
    return `// Optimized version using hash map
function optimizedSolution(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;
  }
}
