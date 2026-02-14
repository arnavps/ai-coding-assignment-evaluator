/**
 * Logic Gate C: The "Explainability" Engine
 * Maps specific code failures to constructive "Senior Dev" advice
 */

// Senior dev advice templates
const adviceTemplates = {
  performance: {
    'nested-loops': {
      title: 'Algorithm Optimization',
      advice: [
        "Consider using a hash map or dictionary to reduce time complexity from O(n²) to O(n)",
        "Think about whether you can pre-process data to avoid nested iterations",
        "Sometimes a space-time tradeoff is worth it - use extra memory to save computation time"
      ],
      codeExample: `// Instead of nested loops:
// for (let i = 0; i < nums.length; i++) {
//   for (let j = i + 1; j < nums.length; j++) {
//     if (nums[i] + nums[j] === target) return [i, j];
//   }
// }

// Use a hash map:
const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) {
    return [map.get(complement), i];
  }
  map.set(nums[i], i);
}`
    },
    'slow-execution': {
      title: 'Performance Tuning',
      advice: [
        "Profile your code to identify bottlenecks",
        "Consider using built-in methods which are often optimized",
        "Look for redundant computations that can be cached or memoized"
      ],
      codeExample: `// Cache expensive computations:
const memo = new Map();
function expensiveOperation(input) {
  if (memo.has(input)) return memo.get(input);
  const result = /* complex calculation */;
  memo.set(input, result);
  return result;
}`
    },
    'memory-inefficient': {
      title: 'Memory Optimization',
      advice: [
        "Consider using generators for large datasets to process items lazily",
        "In-place modifications can save significant memory",
        "Be mindful of creating unnecessary intermediate arrays"
      ],
      codeExample: `// Use generators for memory efficiency:
function* processLargeDataset(data) {
  for (const item of data) {
    yield transform(item); // Process one item at a time
  }
}

// In-place modification:
for (let i = 0; i < arr.length; i++) {
  arr[i] = transform(arr[i]); // Modify existing array
}`
    }
  },
  correctness: {
    'edge-case-failure': {
      title: 'Edge Case Handling',
      advice: [
        "Always consider null, undefined, empty, and boundary conditions",
        "Add defensive programming checks at the start of functions",
        "Think about what happens with minimum and maximum valid inputs"
      ],
      codeExample: `// Defensive programming:
function safeOperation(input) {
  if (!input) return defaultValue; // Handle null/undefined/empty
  if (input.length === 0) return [];
  if (input.length === 1) return handleSingleItem(input[0]);
  
  // Main logic here
  return processInput(input);
}`
    },
    'off-by-one': {
      title: 'Boundary Conditions',
      advice: [
        "Double-check loop bounds and array indices",
        "Consider using inclusive/exclusive ranges consistently",
        "Test with arrays of size 0, 1, and 2 to catch boundary issues"
      ],
      codeExample: `// Be explicit about boundaries:
// Instead of: for (let i = 0; i <= arr.length; i++)
// Use: for (let i = 0; i < arr.length; i++)

// Or use inclusive ranges clearly:
for (let i = 0; i <= lastIndex; i++) {
  // Process elements 0 through lastIndex
}`
    },
    'type-mismatch': {
      title: 'Type Safety',
      advice: [
        "Validate input types before processing",
        "Use TypeScript or JSDoc for better type documentation",
        "Consider using type guards for runtime type checking"
      ],
      codeExample: `// Type validation:
function processArray(input) {
  if (!Array.isArray(input)) {
    throw new TypeError('Expected array input');
  }
  
  return input.map(item => {
    if (typeof item !== 'string') {
      throw new TypeError('Expected string items');
    }
    return item.trim();
  });
}`
    }
  },
  readability: {
    'poor-naming': {
      title: 'Code Clarity',
      advice: [
        "Use descriptive variable names that explain the purpose",
        "Follow consistent naming conventions (camelCase for variables)",
        "Avoid abbreviations unless they're universally understood"
      ],
      codeExample: `// Instead of:
// const x = arr[0];
// const y = arr[1];

// Use descriptive names:
const firstElement = arr[0];
const secondElement = arr[1];
const targetSum = firstElement + secondElement;`
    },
    'missing-comments': {
      title: 'Documentation',
      advice: [
        "Add comments for complex business logic or algorithms",
        "Document function parameters and return values",
        "Explain the 'why' not just the 'what' in your comments"
      ],
      codeExample: `/**
 * Finds two numbers that sum to the target
 * @param {number[]} nums - Array of numbers to search
 * @param {number} target - Target sum to find
 * @returns {number[]} Indices of the two numbers, or empty array if not found
 */
function twoSum(nums, target) {
  // Use hash map for O(n) time complexity
  const seenNumbers = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seenNumbers.has(complement)) {
      return [seenNumbers.get(complement), i];
    }
    seenNumbers.set(nums[i], i);
  }
  
  return [];
}`
    },
    'complex-structure': {
      title: 'Code Organization',
      advice: [
        "Break down complex functions into smaller, focused units",
        "Use early returns to reduce nesting levels",
        "Consider extracting complex conditions into well-named variables"
      ],
      codeExample: `// Break down complex logic:
function processUser(user) {
  // Early returns for validation
  if (!user) return null;
  if (!user.isActive) return null;
  if (!hasPermission(user.role)) return null;
  
  // Main processing
  const processedData = transformUserData(user);
  return saveToDatabase(processedData);
}

// Extract complex conditions:
const isValidUser = user => user && user.isActive && hasPermission(user.role);`
    }
  }
};

/**
 * Generate senior dev advice based on analysis results
 */
export const generateAdvice = (structuralAnalysis, testResults) => {
  const advice = {
    overall: '',
    specific: [],
    codeExamples: [],
    priority: 'medium',
    nextSteps: []
  };

  const issues = [];

  // Analyze structural issues
  if (structuralAnalysis.issues) {
    structuralAnalysis.issues.forEach(issue => {
      switch (issue.type) {
        case 'performance':
          if (issue.message.includes('nested')) {
            issues.push({
              type: 'performance',
              severity: issue.severity,
              category: 'nested-loops',
              message: issue.message,
              suggestion: issue.suggestion
            });
          }
          break;

        case 'naming':
          issues.push({
            type: 'readability',
            severity: issue.severity,
            category: 'poor-naming',
            message: issue.message,
            suggestion: issue.suggestion
          });
          break;

        case 'syntax':
          issues.push({
            type: 'correctness',
            severity: issue.severity,
            category: 'syntax-error',
            message: issue.message,
            suggestion: issue.suggestion
          });
          break;

        default:
          // Handle unknown issue types
          issues.push({
            type: 'unknown',
            severity: issue.severity,
            category: 'unclassified',
            message: issue.message,
            suggestion: 'Review this issue manually'
          });
          break;
      }
    });
  }

  // Analyze test results
  if (testResults.results) {
    testResults.results.forEach(result => {
      if (!result.passed && result.category === 'edge') {
        issues.push({
          type: 'correctness',
          severity: 'high',
          category: 'edge-case-failure',
          message: `Failed edge case: ${result.name}`,
          suggestion: 'Add proper input validation and edge case handling'
        });
      }

      if (result.executionTime > 1000) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          category: 'slow-execution',
          message: `Slow execution in ${result.name}: ${result.executionTime}ms`,
          suggestion: 'Optimize algorithm for better performance'
        });
      }
    });
  }

  // Generate advice based on identified issues
  const processedCategories = new Set();

  issues.forEach(issue => {
    if (!processedCategories.has(issue.category)) {
      processedCategories.add(issue.category);

      const template = adviceTemplates[issue.type]?.[issue.category];
      if (template) {
        advice.specific.push({
          title: template.title,
          priority: issue.severity,
          points: template.advice,
          codeExample: template.codeExample,
          relatedIssue: issue.message
        });
      }
    }
  });

  // Generate overall assessment
  const criticalIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;

  if (criticalIssues > 0) {
    advice.overall = `Your code has ${criticalIssues} critical issue${criticalIssues > 1 ? 's' : ''} that need immediate attention. Focus on correctness before optimization.`;
    advice.priority = 'high';
  } else if (mediumIssues > 0) {
    advice.overall = `Good foundation! Address ${mediumIssues} improvement area${mediumIssues > 1 ? 's' : ''} to enhance code quality.`;
    advice.priority = 'medium';
  } else {
    advice.overall = 'Excellent work! Your code demonstrates solid programming practices.';
    advice.priority = 'low';
  }

  // Generate next steps
  advice.nextSteps = generateNextSteps(issues, structuralAnalysis, testResults);

  return advice;
};

/**
 * Generate actionable next steps
 */
const generateNextSteps = (issues, structuralAnalysis, testResults) => {
  const steps = [];

  // Prioritize correctness issues
  const correctnessIssues = issues.filter(i => i.type === 'correctness');
  if (correctnessIssues.length > 0) {
    steps.push({
      priority: 1,
      action: 'Fix correctness issues',
      description: 'Address failing test cases and syntax errors first',
      estimatedTime: '15-30 minutes'
    });
  }

  // Performance optimization
  const performanceIssues = issues.filter(i => i.type === 'performance');
  if (performanceIssues.length > 0) {
    steps.push({
      priority: 2,
      action: 'Optimize performance',
      description: 'Improve algorithm efficiency and reduce execution time',
      estimatedTime: '30-60 minutes'
    });
  }

  // Code readability
  const readabilityIssues = issues.filter(i => i.type === 'readability');
  if (readabilityIssues.length > 0) {
    steps.push({
      priority: 3,
      action: 'Enhance readability',
      description: 'Improve variable naming and add documentation',
      estimatedTime: '10-20 minutes'
    });
  }

  // Add comprehensive testing step if test coverage is low
  if (testResults.summary && testResults.summary.score < 80) {
    steps.push({
      priority: 4,
      action: 'Add comprehensive tests',
      description: 'Write additional test cases to improve coverage',
      estimatedTime: '20-40 minutes'
    });
  }

  return steps;
};

/**
 * Generate a technical debt score
 */
export const calculateTechnicalDebt = (structuralAnalysis, testResults) => {
  let debtScore = 0;
  let maxDebt = 100;

  // Structural issues contribute to debt
  if (structuralAnalysis.issues) {
    structuralAnalysis.issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': debtScore += 25; break;
        case 'high': debtScore += 15; break;
        case 'medium': debtScore += 10; break;
        case 'low': debtScore += 5; break;
        default: debtScore += 3; break;
      }
    });
  }

  // Test failures contribute to debt
  if (testResults.summary) {
    const failedTests = testResults.summary.total - testResults.summary.passed;
    debtScore += failedTests * 8;
  }

  // Performance issues
  if (testResults.summary?.performanceIssues?.length > 0) {
    debtScore += testResults.summary.performanceIssues.length * 12;
  }

  // Cap at 100
  debtScore = Math.min(debtScore, maxDebt);

  return {
    score: debtScore,
    level: debtScore > 70 ? 'high' : debtScore > 40 ? 'medium' : 'low',
    description: getDebtDescription(debtScore)
  };
};

const getDebtDescription = (score) => {
  if (score > 70) return 'Significant technical debt requires immediate refactoring';
  if (score > 40) return 'Moderate technical debt should be addressed soon';
  if (score > 20) return 'Low technical debt with room for improvement';
  return 'Minimal technical debt - well maintained code';
};
