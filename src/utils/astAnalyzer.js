import { parse } from 'acorn';

/**
 * Logic Gate A: Structural Analysis (AST)
 * Analyzes code complexity, loop nesting, and variable naming quality
 */

export const analyzeComplexity = (code) => {
  try {
    const ast = parse(code, { ecmaVersion: 2022, sourceType: 'module' });
    
    const analysis = {
      complexity: 'O(1)',
      hasLoops: false,
      nestedLoops: false,
      loopDepth: 0,
      variableNamingIssues: [],
      functionCount: 0,
      variableCount: 0,
      issues: []
    };

    // Track loop nesting depth
    let currentLoopDepth = 0;
    let maxLoopDepth = 0;

    // Analyze AST nodes
    const analyzeNode = (node, parentDepth = 0) => {
      if (!node) return;

      switch (node.type) {
        case 'ForStatement':
        case 'WhileStatement':
        case 'DoWhileStatement':
          currentLoopDepth++;
          maxLoopDepth = Math.max(maxLoopDepth, currentLoopDepth);
          analysis.hasLoops = true;
          
          if (currentLoopDepth > 1) {
            analysis.nestedLoops = true;
          }
          
          // Analyze loop body
          if (node.body) {
            analyzeNode(node.body, currentLoopDepth);
          }
          
          currentLoopDepth--;
          break;

        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          analysis.functionCount++;
          break;

        case 'VariableDeclarator':
          analysis.variableCount++;
          
          // Check variable naming quality
          if (node.id && node.id.name) {
            const varName = node.id.name;
            
            // Flag 1-2 character variable names (except common iterators)
            if (varName.length <= 2 && !['i', 'j', 'k', 'x', 'y', 'z'].includes(varName)) {
              analysis.variableNamingIssues.push({
                name: varName,
                issue: 'Variable name too short',
                suggestion: `Consider a more descriptive name instead of '${varName}'`
              });
            }
            
            // Check for camelCase
            if (varName.includes('_') && varName !== varName.toUpperCase()) {
              analysis.variableNamingIssues.push({
                name: varName,
                issue: 'Inconsistent naming convention',
                suggestion: `Consider using camelCase for '${varName}'`
              });
            }
          }
          break;
      }

      // Recursively analyze child nodes
      for (const key in node) {
        if (key === 'body' && node.type.includes('Statement')) {
          continue; // Already handled above
        }
        
        const child = node[key];
        if (Array.isArray(child)) {
          child.forEach(item => {
            if (item && typeof item === 'object' && item.type) {
              analyzeNode(item, parentDepth);
            }
          });
        } else if (child && typeof child === 'object' && child.type) {
          analyzeNode(child, parentDepth);
        }
      }
    };

    analyzeNode(ast);

    // Determine complexity based on loop analysis
    if (analysis.nestedLoops) {
      analysis.complexity = 'O(n²)';
      analysis.issues.push({
        type: 'performance',
        severity: 'high',
        message: 'Nested loops detected - potential O(n²) complexity',
        suggestion: 'Consider optimizing algorithm or using hash maps'
      });
    } else if (analysis.hasLoops) {
      analysis.complexity = 'O(n)';
    }

    // Add variable naming issues to general issues
    analysis.variableNamingIssues.forEach(issue => {
      analysis.issues.push({
        type: 'naming',
        severity: 'medium',
        message: `${issue.issue}: ${issue.name}`,
        suggestion: issue.suggestion
      });
    });

    // Calculate code quality score
    const namingScore = Math.max(0, 100 - (analysis.variableNamingIssues.length * 15));
    const complexityScore = analysis.nestedLoops ? 40 : analysis.hasLoops ? 70 : 100;
    const structureScore = analysis.functionCount > 0 ? 90 : 80;
    
    analysis.qualityScore = Math.round((namingScore + complexityScore + structureScore) / 3);
    analysis.loopDepth = maxLoopDepth;

    return analysis;
  } catch (error) {
    return {
      error: `Syntax error: ${error.message}`,
      complexity: 'O(1)',
      hasLoops: false,
      nestedLoops: false,
      loopDepth: 0,
      variableNamingIssues: [],
      functionCount: 0,
      variableCount: 0,
      issues: [{
        type: 'syntax',
        severity: 'critical',
        message: `Syntax error: ${error.message}`,
        suggestion: 'Fix syntax errors before analysis'
      }],
      qualityScore: 0
    };
  }
};

/**
 * Detects specific patterns in code
 */
export const detectPatterns = (code) => {
  const patterns = {
    hasRecursion: /function\s+\w+.*\{[\s\S]*?return\s+\w+\(/.test(code),
    hasAsync: /async|await/.test(code),
    hasErrorHandling: /try\s*\{|catch\s*\(/.test(code),
    hasComments: /\/\*[\s\S]*?\*\/|\/\/.*/.test(code),
    hasConsoleLog: /console\.log/.test(code)
  };

  return patterns;
};

/**
 * Extract function signatures and their parameters
 */
export const extractFunctions = (code) => {
  try {
    const ast = parse(code, { ecmaVersion: 2022, sourceType: 'module' });
    const functions = [];

    const analyzeNode = (node) => {
      if (!node) return;

      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
        const func = {
          name: node.id?.name || 'anonymous',
          params: node.params.map(p => p.name || 'unknown'),
          isAsync: node.async || false,
          line: node.loc?.start?.line || 0
        };
        functions.push(func);
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
    return functions;
  } catch (error) {
    return [];
  }
};
