import React, { useState } from 'react';
import { useEvaluator } from './hooks/useEvaluator';
import CodeEditor from './components/CodeEditor';
import Dashboard from './components/Dashboard';
import './App.css';

/**
 * Main App component for LINT-PRO AI Coding Evaluator
 * Features precision engineering aesthetic with comprehensive code analysis
 */

const App = () => {
  const {
    state,
    currentStage,
    results,
    error,
    code,
    isProcessing,
    evaluateCode,
    reset,
    setCode,
    statusMessage
  } = useEvaluator();

  const [showResults, setShowResults] = useState(false);

  const handleEvaluate = () => {
    setShowResults(false);
    evaluateCode(code);
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
  };

  const handleNewEvaluation = () => {
    reset();
    setCode('');
    setShowResults(false);
  };

  // Show results when evaluation is complete
  React.useEffect(() => {
    if (state === 'completed' && results) {
      setShowResults(true);
    }
  }, [state, results]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title typography-main">
            LINT-PRO
          </h1>
          <p className="subtitle typography-academic">
            Deep AI Coding Evaluator with Precision Engineering
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className="status-indicator">
          <div className={`status-dot ${state}`}></div>
          <span className="status-text typography-main">
            {statusMessage}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!showResults ? (
          /* Code Input Section */
          <div className="evaluation-section">
            <div className="section-header">
              <h2 className="section-title typography-main">
                Code Analysis
              </h2>
              <p className="section-description typography-academic">
                Submit your JavaScript code for comprehensive analysis including structural complexity, 
                edge-case testing, and senior developer recommendations.
              </p>
            </div>

            <div className="editor-section">
              <CodeEditor
                code={code}
                setCode={setCode}
                isProcessing={isProcessing}
                currentStage={currentStage}
              />
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleEvaluate}
                disabled={isProcessing || !code.trim()}
                className="btn-primary btn-evaluate"
              >
                {isProcessing ? 'Analyzing...' : 'Evaluate Code'}
              </button>
              
              {error && (
                <button
                  onClick={handleReset}
                  className="btn-secondary btn-reset"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <div className="error-text typography-academic">
                  {error}
                </div>
              </div>
            )}

            {/* Sample Code Suggestions */}
            {!code && !isProcessing && (
              <div className="sample-code-section">
                <h3 className="sample-title typography-main">
                  Try Sample Code:
                </h3>
                <div className="sample-buttons">
                  <button
                    onClick={() => setCode(getSampleCode('two-sum'))}
                    className="btn-sample"
                  >
                    Two Sum
                  </button>
                  <button
                    onClick={() => setCode(getSampleCode('string-reversal'))}
                    className="btn-sample"
                  >
                    String Reversal
                  </button>
                  <button
                    onClick={() => setCode(getSampleCode('nested-loops'))}
                    className="btn-sample"
                  >
                    Nested Loops (Performance Issue)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Dashboard */
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title typography-main">
                Evaluation Results
              </h2>
              <button
                onClick={handleNewEvaluation}
                className="btn-primary btn-new-evaluation"
              >
                Evaluate New Code
              </button>
            </div>
            
            <Dashboard results={results} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text typography-academic">
            LINT-PRO © 2024 | Precision Engineering for Code Quality
          </p>
          <div className="footer-info">
            <span className="info-item">
              Logic Gates: AST Analysis • Edge Cases • Explainability
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Sample code snippets for testing
 */
const getSampleCode = (type) => {
  switch (type) {
    case 'two-sum':
      return `function twoSum(nums, target) {
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

    case 'string-reversal':
      return `function reverseString(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  
  return reversed;
}`;

    case 'nested-loops':
      return `function findPairs(arr, target) {
  const pairs = [];
  
  // This has O(n²) complexity - can be optimized!
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }
  
  return pairs;
}`;

    default:
      return '';
  }
};

export default App;
