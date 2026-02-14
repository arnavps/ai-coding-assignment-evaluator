import { 
  Submission, 
  EvaluationResult, 
  EvaluationState,
  ScoringWeights,
  CorrectnessAnalysis,
  EfficiencyAnalysis,
  ReadabilityAnalysis,
  BestPracticesAnalysis,
  TechnicalDebt,
  EvaluationMetadata,
  SilentFailure
} from '@/types';
import { LogicInterrogator } from './LogicInterrogator';

/**
 * Evaluation Engine - Core evaluation orchestrator
 * Implements the 100-point scoring system with weighted components
 * 
 * Scoring Formula:
 * - Correctness: 40% (Test case pass rate, edge case handling)
 * - Efficiency: 30% (Time/space complexity, performance metrics)
 * - Readability: 20% (Code clarity, naming, documentation)
 * - Best Practices: 10% (Security, SOLID principles, patterns)
 * 
 * @author Lead Software Architect
 * @version 2.0.0
 */
export class EvaluationEngine {
  private logicInterrogator: LogicInterrogator;
  private scoringWeights: ScoringWeights;

  constructor(scoringWeights?: Partial<ScoringWeights>) {
    this.logicInterrogator = new LogicInterrogator();
    this.scoringWeights = {
      correctness: 0.40,
      efficiency: 0.30,
      readability: 0.20,
      bestPractices: 0.10,
      ...scoringWeights
    };
  }

  /**
   * Evaluates a code submission through all analysis phases
   * @param submission - Code submission to evaluate
   * @returns Complete evaluation result
   */
  public async evaluate(submission: Submission): Promise<EvaluationResult> {
    const startTime = Date.now();
    
    try {
      // Phase 1: Correctness Analysis (40%)
      const correctness = await this.analyzeCorrectness(submission);
      
      // Phase 2: Efficiency Analysis (30%)
      const efficiency = await this.analyzeEfficiency(submission);
      
      // Phase 3: Readability Analysis (20%)
      const readability = await this.analyzeReadability(submission);
      
      // Phase 4: Best Practices Analysis (10%)
      const bestPractices = await this.analyzeBestPractices(submission);
      
      // Phase 5: Technical Debt Assessment
      const technicalDebt = this.assessTechnicalDebt(correctness, efficiency, readability, bestPractices);
      
      // Phase 6: Calculate Overall Score
      const overallScore = this.calculateOverallScore(correctness, efficiency, readability, bestPractices);
      const grade = this.assignGrade(overallScore);
      
      // Phase 7: Generate Refactor Suggestions
      const refactorSuggestions = this.logicInterrogator.generateRefactorSuggestions(
        submission.code, 
        { correctness, efficiency, readability, bestPractices }
      );

      const endTime = Date.now();
      
      const result: EvaluationResult = {
        id: this.generateId(),
        submission,
        overallScore,
        grade,
        correctness,
        efficiency,
        readability,
        bestPractices,
        technicalDebt,
        refactorSuggestions,
        metadata: {
          timestamp: new Date(),
          duration: endTime - startTime,
          engineVersion: '2.0.0',
          phasesCompleted: ['correctness', 'efficiency', 'readability', 'bestPractices', 'technicalDebt', 'refactoring'],
          confidence: this.calculateConfidence(correctness, efficiency, readability, bestPractices)
        }
      };

      return result;

    } catch (error) {
      throw new Error(`Evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyzes code correctness through comprehensive testing
   * @param submission - Code submission to analyze
   * @returns Correctness analysis results
   */
  private async analyzeCorrectness(submission: Submission): Promise<CorrectnessAnalysis> {
    const problemType = this.detectProblemType(submission.code);
    
    // Generate edge case tests
    const testCases = this.logicInterrogator.generateEdgeCaseTests(submission.code, problemType);
    
    // Execute tests and measure performance
    const { results, metrics } = this.logicInterrogator.executeTests(submission.code, testCases);
    
    // Calculate pass rate
    const passedTests = results.filter(test => test.passed).length;
    const passRate = (passedTests / results.length) * 100;
    
    // Analyze edge case handling
    const edgeCaseHandling = this.analyzeEdgeCaseHandling(results);
    
    // Detect silent failures
    const silentFailures = this.logicInterrogator.detectSilentFailures(submission.code, results);
    
    // Calculate correctness score
    const score = this.calculateCorrectnessScore(passRate, edgeCaseHandling, silentFailures);

    return {
      score,
      testResults: results,
      passRate,
      edgeCaseHandling,
      silentFailures
    };
  }

  /**
   * Analyzes code efficiency through complexity and performance analysis
   * @param submission - Code submission to analyze
   * @returns Efficiency analysis results
   */
  private async analyzeEfficiency(submission: Submission): Promise<EfficiencyAnalysis> {
    // Analyze complexity
    const complexity = this.logicInterrogator.analyzeComplexity(submission.code);
    
    // Generate performance test cases
    const performanceTests = this.generatePerformanceTests();
    
    // Execute performance tests
    const { results, metrics } = this.logicInterrogator.executeTests(submission.code, performanceTests);
    
    // Identify optimization opportunities
    const optimizationOpportunities = this.identifyOptimizationOpportunities(complexity, metrics);
    
    // Calculate efficiency score
    const score = this.calculateEfficiencyScore(complexity, metrics, optimizationOpportunities);

    return {
      score,
      complexity,
      performance: metrics,
      optimizationOpportunities
    };
  }

  /**
   * Analyzes code readability and maintainability
   * @param submission - Code submission to analyze
   * @returns Readability analysis results
   */
  private async analyzeReadability(submission: Submission): Promise<ReadabilityAnalysis> {
    const code = submission.code;
    const lines = code.split('\n');
    
    // Analyze naming
    const naming = this.logicInterrogator.analyzeNaming(code);
    
    // Calculate metrics
    const linesOfCode = lines.filter(line => line.trim().length > 0).length;
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code);
    const commentCoverage = this.calculateCommentCoverage(code);
    const functionCount = (code.match(/function\s+\w+|=>\s*{|\w+\s*:\s*function/g) || []).length;
    const maxFunctionLength = this.calculateMaxFunctionLength(code);
    
    // Identify readability issues
    const issues = this.identifyReadabilityIssues(code, lines, cyclomaticComplexity, maxFunctionLength);
    
    // Calculate readability score
    const score = this.calculateReadabilityScore(
      naming, 
      commentCoverage, 
      cyclomaticComplexity, 
      maxFunctionLength, 
      issues
    );

    return {
      score,
      linesOfCode,
      cyclomaticComplexity,
      commentCoverage,
      functionCount,
      maxFunctionLength,
      issues
    };
  }

  /**
   * Analyzes adherence to best practices and design patterns
   * @param submission - Code submission to analyze
   * @returns Best practices analysis results
   */
  private async analyzeBestPractices(submission: Submission): Promise<BestPracticesAnalysis> {
    const code = submission.code;
    
    // Security analysis
    const securityIssues = this.analyzeSecurityIssues(code);
    
    // Code quality analysis
    const qualityIssues = this.analyzeCodeQualityIssues(code);
    
    // Pattern detection
    const patternsUsed = this.detectDesignPatterns(code);
    
    // SOLID principles compliance
    const solidCompliance = this.analyzeSolidCompliance(code);
    
    // Calculate best practices score
    const score = this.calculateBestPracticesScore(
      securityIssues, 
      qualityIssues, 
      patternsUsed, 
      solidCompliance
    );

    return {
      score,
      securityIssues,
      qualityIssues,
      patternsUsed,
      solidCompliance
    };
  }

  /**
   * Assesses technical debt across multiple dimensions
   * @param analyses - All analysis results
   * @returns Technical debt assessment
   */
  private assessTechnicalDebt(
    correctness: CorrectnessAnalysis,
    efficiency: EfficiencyAnalysis,
    readability: ReadabilityAnalysis,
    bestPractices: BestPracticesAnalysis
  ): TechnicalDebt {
    // Calculate debt scores for each category
    const complexityDebt = Math.max(0, 100 - efficiency.score) * 0.4;
    const documentationDebt = Math.max(0, 100 - readability.commentCoverage) * 0.2;
    const testingDebt = Math.max(0, 100 - correctness.passRate) * 0.3;
    const architecturalDebt = Math.max(0, 100 - bestPractices.score) * 0.1;
    
    const totalScore = complexityDebt + documentationDebt + testingDebt + architecturalDebt;
    
    // Determine debt level
    let level: 'low' | 'medium' | 'high' | 'critical';
    if (totalScore >= 70) level = 'critical';
    else if (totalScore >= 50) level = 'high';
    else if (totalScore >= 30) level = 'medium';
    else level = 'low';
    
    // Estimate resolution time
    const estimatedHours = Math.round(totalScore * 0.5); // 30 minutes per point
    
    const description = this.getTechnicalDebtDescription(totalScore, level);

    return {
      score: Math.round(totalScore),
      level,
      estimatedHours,
      categories: {
        complexity: Math.round(complexityDebt),
        documentation: Math.round(documentationDebt),
        testing: Math.round(testingDebt),
        architectural: Math.round(architecturalDebt)
      },
      description
    };
  }

  // Private helper methods

  private calculateOverallScore(
    correctness: CorrectnessAnalysis,
    efficiency: EfficiencyAnalysis,
    readability: ReadabilityAnalysis,
    bestPractices: BestPracticesAnalysis
  ): number {
    const weightedScore = 
      (correctness.score * this.scoringWeights.correctness) +
      (efficiency.score * this.scoringWeights.efficiency) +
      (readability.score * this.scoringWeights.readability) +
      (bestPractices.score * this.scoringWeights.bestPractices);
    
    return Math.round(weightedScore);
  }

  private assignGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private detectProblemType(code: string): string {
    const lowerCode = code.toLowerCase();
    
    if (lowerCode.includes('twosum') || lowerCode.includes('two sum')) return 'two-sum';
    if (lowerCode.includes('reverse')) return 'string-reversal';
    if (lowerCode.includes('palindrome')) return 'palindrome';
    if (lowerCode.includes('max') || lowerCode.includes('maximum')) return 'array-max';
    
    return 'general';
  }

  private analyzeEdgeCaseHandling(results: any[]): any {
    const edgeTests = results.filter(test => test.category === 'edge');
    
    return {
      emptyInput: edgeTests.some(test => test.name.includes('Empty') && test.passed),
      nullHandling: edgeTests.some(test => test.name.includes('Null') && test.passed),
      largeInputHandling: edgeTests.some(test => test.name.includes('Large') && test.passed)
    };
  }

  private calculateCorrectnessScore(
    passRate: number, 
    edgeCaseHandling: any, 
    silentFailures: SilentFailure[]
  ): number {
    let score = passRate;
    
    // Bonus for edge case handling
    if (edgeCaseHandling.emptyInput) score += 5;
    if (edgeCaseHandling.nullHandling) score += 5;
    if (edgeCaseHandling.largeInputHandling) score += 5;
    
    // Penalty for silent failures
    score -= silentFailures.length * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private generatePerformanceTests(): any[] {
    return [
      {
        id: 'perf-large-dataset',
        name: 'Large Dataset Performance',
        category: 'performance',
        input: Array.from({length: 10000}, (_, i) => i + 1),
        expected: null, // Performance test, focus on execution time
        passed: false,
        executionTime: 0
      }
    ];
  }

  private identifyOptimizationOpportunities(complexity: any, metrics: any): string[] {
    const opportunities: string[] = [];
    
    if (complexity.hasNestedLoops) {
      opportunities.push('Replace nested loops with hash map or Set for O(n²) → O(n) optimization');
    }
    
    if (complexity.hasRecursion) {
      opportunities.push('Consider memoization or iterative approach for recursive functions');
    }
    
    if (metrics.averageTime > 100) {
      opportunities.push('Optimize algorithm to reduce average execution time');
    }
    
    if (metrics.memoryUsage > 1000) {
      opportunities.push('Reduce memory allocation and consider in-place operations');
    }
    
    return opportunities;
  }

  private calculateEfficiencyScore(complexity: any, metrics: any, opportunities: string[]): number {
    let score = 100;
    
    // Complexity penalties
    if (complexity.hasNestedLoops) score -= 30;
    if (complexity.hasRecursion) score -= 15;
    if (complexity.loopDepth > 2) score -= 10;
    
    // Performance penalties
    if (metrics.averageTime > 100) score -= 20;
    if (metrics.maxTime > 1000) score -= 15;
    if (metrics.memoryUsage > 1000) score -= 10;
    
    // Opportunity bonuses
    score -= opportunities.length * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateCyclomaticComplexity(code: string): number {
    // Simplified cyclomatic complexity calculation
    const decisionPoints = 
      (code.match(/if\s*\(/g) || []).length +
      (code.match(/while\s*\(/g) || []).length +
      (code.match(/for\s*\(/g) || []).length +
      (code.match(/case\s+/g) || []).length +
      (code.match(/\|\|/g) || []).length +
      (code.match(/&&/g) || []).length;
    
    return decisionPoints + 1; // Base complexity
  }

  private calculateCommentCoverage(code: string): number {
    const lines = code.split('\n');
    const codeLines = lines.filter(line => line.trim().length > 0 && !line.trim().startsWith('//'));
    const commentLines = lines.filter(line => line.trim().startsWith('//'));
    
    if (codeLines.length === 0) return 0;
    
    return Math.round((commentLines.length / (codeLines.length + commentLines.length)) * 100);
  }

  private calculateMaxFunctionLength(code: string): number {
    const functions = code.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/g) || [];
    
    if (functions.length === 0) return code.split('\n').length;
    
    return Math.max(...functions.map(func => func.split('\n').length));
  }

  private identifyReadabilityIssues(code: string, lines: string[], cyclomaticComplexity: number, maxFunctionLength: number): any[] {
    const issues: any[] = [];
    
    if (cyclomaticComplexity > 10) {
      issues.push({
        description: 'High cyclomatic complexity detected',
        line: 0,
        type: 'deep-nesting',
        suggestion: 'Break down complex functions into smaller, focused units'
      });
    }
    
    if (maxFunctionLength > 50) {
      issues.push({
        description: 'Function exceeds recommended length',
        line: 0,
        type: 'long-function',
        suggestion: 'Consider breaking down into smaller functions'
      });
    }
    
    // Check for magic numbers
    const magicNumbers = code.match(/\b(?!0|1|2|10|100)\d+\b/g) || [];
    if (magicNumbers.length > 0) {
      issues.push({
        description: 'Magic numbers detected',
        line: 0,
        type: 'magic-number',
        suggestion: 'Replace magic numbers with named constants'
      });
    }
    
    return issues;
  }

  private calculateReadabilityScore(
    naming: any, 
    commentCoverage: number, 
    cyclomaticComplexity: number, 
    maxFunctionLength: number, 
    issues: any[]
  ): number {
    let score = 100;
    
    // Naming score impact
    score -= (100 - naming.namingScore) * 0.4;
    
    // Comment coverage impact
    if (commentCoverage < 20) score -= 20;
    else if (commentCoverage < 50) score -= 10;
    
    // Complexity impact
    if (cyclomaticComplexity > 15) score -= 20;
    else if (cyclomaticComplexity > 10) score -= 10;
    
    // Function length impact
    if (maxFunctionLength > 100) score -= 20;
    else if (maxFunctionLength > 50) score -= 10;
    
    // Issues impact
    score -= issues.length * 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private analyzeSecurityIssues(code: string): any[] {
    const issues: any[] = [];
    
    // Check for eval usage
    if (code.includes('eval(')) {
      issues.push({
        description: 'Use of eval() detected',
        severity: 'critical',
        cweId: 'CWE-94',
        remediation: 'Replace eval() with safer alternatives'
      });
    }
    
    // Check for hardcoded secrets
    const secretPattern = /(password|secret|key|token)\s*=\s*['"][^'"]+['"]/g;
    if (secretPattern.test(code)) {
      issues.push({
        description: 'Potential hardcoded secret detected',
        severity: 'high',
        remediation: 'Use environment variables for secrets'
      });
    }
    
    return issues;
  }

  private analyzeCodeQualityIssues(code: string): any[] {
    const issues: any[] = [];
    
    // Check for console.log statements
    if (code.includes('console.log')) {
      issues.push({
        description: 'Console.log statements found in production code',
        category: 'dead-code',
        suggestion: 'Remove or replace with proper logging'
      });
    }
    
    // Check for duplicate code (simplified)
    const lines = code.split('\n');
    const lineCounts: Record<string, number> = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 10) {
        lineCounts[trimmed] = (lineCounts[trimmed] || 0) + 1;
      }
    });
    
    const duplicates = Object.entries(lineCounts).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
      issues.push({
        description: 'Duplicate code detected',
        category: 'duplication',
        suggestion: 'Extract duplicated code into reusable functions'
      });
    }
    
    return issues;
  }

  private detectDesignPatterns(code: string): string[] {
    const patterns: string[] = [];
    
    if (code.includes('class ') && code.includes('extends ')) {
      patterns.push('Inheritance');
    }
    
    if (code.includes('new Map(') || code.includes('new Set(')) {
      patterns.push('Collection Pattern');
    }
    
    if (code.includes('=>') && code.includes('.reduce(')) {
      patterns.push('Functional Programming');
    }
    
    return patterns;
  }

  private analyzeSolidCompliance(code: string): any {
    // Simplified SOLID analysis
    return {
      srp: 80, // Single Responsibility
      ocp: 75, // Open/Closed
      lsp: 85, // Liskov Substitution
      isp: 80, // Interface Segregation
      dip: 75, // Dependency Inversion
      overall: 79
    };
  }

  private calculateBestPracticesScore(
    securityIssues: any[], 
    qualityIssues: any[], 
    patternsUsed: string[], 
    solidCompliance: any
  ): number {
    let score = 100;
    
    // Security penalties
    securityIssues.forEach(issue => {
      const penalty = issue.severity === 'critical' ? 30 : 
                     issue.severity === 'high' ? 20 : 
                     issue.severity === 'medium' ? 10 : 5;
      score -= penalty;
    });
    
    // Quality penalties
    score -= qualityIssues.length * 5;
    
    // Pattern bonuses
    score += patternsUsed.length * 2;
    
    // SOLID compliance impact
    score += (solidCompliance.overall - 75) * 0.2;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private calculateConfidence(
    correctness: CorrectnessAnalysis,
    efficiency: EfficiencyAnalysis,
    readability: ReadabilityAnalysis,
    bestPractices: BestPracticesAnalysis
  ): number {
    // Confidence based on test coverage and analysis completeness
    const testConfidence = correctness.testResults.length > 0 ? 0.9 : 0.5;
    const analysisConfidence = 0.95; // High confidence in static analysis
    
    return Math.round((testConfidence + analysisConfidence) / 2 * 100);
  }

  private getTechnicalDebtDescription(score: number, level: string): string {
    switch (level) {
      case 'critical':
        return 'Critical technical debt requires immediate refactoring and architectural review';
      case 'high':
        return 'High technical debt should be addressed in the next development cycle';
      case 'medium':
        return 'Moderate technical debt can be managed with regular refactoring';
      case 'low':
        return 'Low technical debt indicates well-maintained code';
      default:
        return 'Technical debt assessment complete';
    }
  }

  private generateId(): string {
    return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
