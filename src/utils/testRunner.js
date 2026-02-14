/**
 * Logic Gate B: Edge-Case Interrogation
 * Mock test suite runner for various coding problems
 */

// Test case definitions for common problems
const testSuites = {
  'two-sum': {
    name: 'Two Sum',
    description: 'Find two numbers that add up to a target',
    testCases: [
      {
        name: 'Empty Input',
        input: { nums: [], target: 9 },
        expected: [],
        category: 'edge'
      },
      {
        name: 'Null/Undefined Input',
        input: { nums: null, target: 9 },
        expected: null,
        category: 'edge'
      },
      {
        name: 'Single Element',
        input: { nums: [5], target: 5 },
        expected: [],
        category: 'edge'
      },
      {
        name: 'Standard Case',
        input: { nums: [2, 7, 11, 15], target: 9 },
        expected: [0, 1],
        category: 'normal'
      },
      {
        name: 'Large Dataset (10k items)',
        input: {
          nums: Array.from({ length: 10000 }, (_, i) => i + 1),
          target: 19999
        },
        expected: [9998, 9999],
        category: 'performance'
      },
      {
        name: 'No Solution',
        input: { nums: [1, 2, 3], target: 7 },
        expected: [],
        category: 'normal'
      }
    ]
  },
  'string-reversal': {
    name: 'String Reversal',
    description: 'Reverse a string',
    testCases: [
      {
        name: 'Empty String',
        input: '',
        expected: '',
        category: 'edge'
      },
      {
        name: 'Null Input',
        input: null,
        expected: null,
        category: 'edge'
      },
      {
        name: 'Single Character',
        input: 'a',
        expected: 'a',
        category: 'edge'
      },
      {
        name: 'Standard Case',
        input: 'hello',
        expected: 'olleh',
        category: 'normal'
      },
      {
        name: 'Large String (10k chars)',
        input: 'a'.repeat(10000),
        expected: 'a'.repeat(10000),
        category: 'performance'
      },
      {
        name: 'Special Characters',
        input: 'Hello, World! 123',
        expected: '321 !dlroW ,olleH',
        category: 'normal'
      }
    ]
  },
  'palindrome-checker': {
    name: 'Palindrome Checker',
    description: 'Check if a string is a palindrome',
    testCases: [
      {
        name: 'Empty String',
        input: '',
        expected: true,
        category: 'edge'
      },
      {
        name: 'Null Input',
        input: null,
        expected: false,
        category: 'edge'
      },
      {
        name: 'Single Character',
        input: 'a',
        expected: true,
        category: 'edge'
      },
      {
        name: 'Valid Palindrome',
        input: 'racecar',
        expected: true,
        category: 'normal'
      },
      {
        name: 'Invalid Palindrome',
        input: 'hello',
        expected: false,
        category: 'normal'
      },
      {
        name: 'Large String (10k chars)',
        input: 'a'.repeat(5000) + 'b' + 'a'.repeat(5000),
        expected: false,
        category: 'performance'
      }
    ]
  },
  'array-max': {
    name: 'Array Maximum',
    description: 'Find the maximum value in an array',
    testCases: [
      {
        name: 'Empty Array',
        input: [],
        expected: null,
        category: 'edge'
      },
      {
        name: 'Null Input',
        input: null,
        expected: null,
        category: 'edge'
      },
      {
        name: 'Single Element',
        input: [5],
        expected: 5,
        category: 'edge'
      },
      {
        name: 'Standard Case',
        input: [1, 5, 3, 9, 2],
        expected: 9,
        category: 'normal'
      },
      {
        name: 'Large Array (10k items)',
        input: Array.from({ length: 10000 }, (_, i) => i),
        expected: 9999,
        category: 'performance'
      },
      {
        name: 'Negative Numbers',
        input: [-5, -2, -8, -1],
        expected: -1,
        category: 'normal'
      }
    ]
  }
};

/**
 * Execute user code against test cases
 */
export const runTestSuite = (code, problemType = 'two-sum') => {
  const testSuite = testSuites[problemType];
  if (!testSuite) {
    return {
      error: `Unknown problem type: ${problemType}`,
      results: [],
      summary: { passed: 0, total: 0, score: 0 }
    };
  }

  const results = [];
  let passedTests = 0;
  let performanceIssues = [];

  try {
    // Create a safe execution environment
    const executeCode = (testInput) => {
      try {
        // Create a sandboxed environment
        const sandbox = {
          console: { log: () => { } }, // Disable console.log
          Math,
          Array,
          Object,
          String,
          Number
        };

        // Wrap user code in a function
        const wrappedCode = `
          (function() {
            ${code}
            
            // Try to call the main function based on problem type
            if (typeof twoSum === 'function') {
              return twoSum(nums, target);
            } else if (typeof reverseString === 'function') {
              return reverseString(str);
            } else if (typeof isPalindrome === 'function') {
              return isPalindrome(str);
            } else if (typeof findMax === 'function') {
              return findMax(arr);
            } else if (typeof main === 'function') {
              return main(${JSON.stringify(testInput)});
            }
            
            return null;
          })()
        `;

        // Execute in sandbox
        // Using eval alternative for dynamic code execution
        const funcBody = `return (${wrappedCode})`;
        const func = function () {
          // eslint-disable-next-line no-eval
          return eval(funcBody);
        };
        return func.call(sandbox);
      } catch (error) {
        throw new Error(`Runtime error: ${error.message}`);
      }
    };

    // Run each test case
    for (const testCase of testSuite.testCases) {
      const startTime = performance.now();

      try {
        const result = executeCode(testCase.input);
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

        if (passed) {
          passedTests++;
        }

        // Check for performance issues
        if (testCase.category === 'performance' && executionTime > 1000) {
          performanceIssues.push({
            test: testCase.name,
            time: executionTime,
            suggestion: 'Consider optimizing your algorithm for better performance'
          });
        }

        results.push({
          name: testCase.name,
          category: testCase.category,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          passed,
          executionTime: Math.round(executionTime * 100) / 100,
          error: null
        });

      } catch (error) {
        results.push({
          name: testCase.name,
          category: testCase.category,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          executionTime: 0,
          error: error.message
        });
      }
    }

  } catch (error) {
    return {
      error: `Code execution failed: ${error.message}`,
      results: [],
      summary: { passed: 0, total: 0, score: 0 }
    };
  }

  const totalTests = results.length;
  const score = Math.round((passedTests / totalTests) * 100);

  // Categorize results
  const edgeCaseResults = results.filter(r => r.category === 'edge');
  const normalResults = results.filter(r => r.category === 'normal');
  const performanceResults = results.filter(r => r.category === 'performance');

  const summary = {
    passed: passedTests,
    total: totalTests,
    score,
    edgeCasesPassed: edgeCaseResults.filter(r => r.passed).length,
    normalCasesPassed: normalResults.filter(r => r.passed).length,
    performanceCasesPassed: performanceResults.filter(r => r.passed).length,
    performanceIssues
  };

  return {
    results,
    summary,
    testSuite: testSuite.name
  };
};

/**
 * Detect problem type from code
 */
export const detectProblemType = (code) => {
  const lowerCode = code.toLowerCase();

  if (lowerCode.includes('twosum') || lowerCode.includes('two sum') ||
    (lowerCode.includes('target') && lowerCode.includes('nums'))) {
    return 'two-sum';
  }

  if (lowerCode.includes('reverse') || lowerCode.includes('reversal')) {
    return 'string-reversal';
  }

  if (lowerCode.includes('palindrome')) {
    return 'palindrome-checker';
  }

  if (lowerCode.includes('max') || lowerCode.includes('maximum')) {
    return 'array-max';
  }

  return 'two-sum'; // Default
};

/**
 * Generate performance metrics
 */
export const generatePerformanceMetrics = (results) => {
  const executionTimes = results.map(r => r.executionTime).filter(t => t > 0);

  if (executionTimes.length === 0) {
    return {
      averageTime: 0,
      maxTime: 0,
      minTime: 0,
      totalTime: 0
    };
  }

  return {
    averageTime: Math.round((executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length) * 100) / 100,
    maxTime: Math.max(...executionTimes),
    minTime: Math.min(...executionTimes),
    totalTime: Math.round(executionTimes.reduce((a, b) => a + b, 0) * 100) / 100
  };
};
