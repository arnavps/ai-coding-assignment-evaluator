import React, { useState } from 'react';
import './CodeEditor.css';

/**
 * Code Editor component with precision engineering aesthetic
 * Features scanning animation overlay during analysis
 */

const CodeEditor = ({ code, setCode, isProcessing, currentStage }) => {
  const [focused, setFocused] = useState(false);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className={`code-editor-container ${focused ? 'focused' : ''}`}>
      <div className="editor-header">
        <div className="editor-title typography-main">
          <span className="editor-icon">{'</>'}</span>
          Code Input
        </div>
        <div className="editor-status">
          {isProcessing ? (
            <span className="status-processing">
              <span className="status-dot"></span>
              Analyzing...
            </span>
          ) : (
            <span className="status-ready">Ready</span>
          )}
        </div>
      </div>
      
      <div className="editor-wrapper">
        <textarea
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="code-input typography-main"
          placeholder="Enter your JavaScript code here..."
          disabled={isProcessing}
          spellCheck={false}
        />
        
        {/* Scanning Animation Overlay */}
        {isProcessing && currentStage && (
          <div className="scanning-overlay">
            <div className="pulse-loader"></div>
            <div className="scanning-text typography-main">
              {currentStage.text}
            </div>
          </div>
        )}
      </div>
      
      <div className="editor-footer">
        <div className="line-count">
          {code.split('\n').length} lines
        </div>
        <div className="character-count">
          {code.length} characters
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
