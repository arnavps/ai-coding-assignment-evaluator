import React from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

/**
 * Dashboard component with Framer Motion staggered entrance animations
 * Displays comprehensive evaluation results with precision engineering aesthetic
 */

const Dashboard = ({ results }) => {
  if (!results) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'var(--pass)';
      case 'B': return 'var(--warn)';
      case 'C': return 'var(--warn)';
      case 'D': return 'var(--fail)';
      case 'F': return 'var(--fail)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusClass = (score) => {
    if (score >= 80) return 'status-pass';
    if (score >= 60) return 'status-warn';
    return 'status-fail';
  };

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overall Score Header */}
      <motion.div variants={itemVariants} className="score-header">
        <div className="grade-display" style={{ color: getGradeColor(results.summary.grade) }}>
          <div className="grade-letter">{results.summary.grade}</div>
          <div className="grade-score">{results.overallScore}/100</div>
        </div>
        <div className="score-details">
          <h2 className="typography-main">Evaluation Complete</h2>
          <p className="typography-academic feedback-text">
            {results.advice.overall}
          </p>
        </div>
      </motion.div>

      {/* Technical Debt Gauge */}
      <motion.div variants={itemVariants} className="technical-debt-section">
        <h3 className="section-title typography-main">Technical Debt Analysis</h3>
        <TechnicalDebtGauge debt={results.technicalDebt} />
        <p className="debt-description typography-academic">
          {results.technicalDebt.description}
        </p>
      </motion.div>

      {/* Score Cards Grid */}
      <div className="score-grid">
        {/* Structural Analysis Card */}
        <motion.div variants={itemVariants} className="score-card">
          <h3 className="card-title typography-main">Structural Analysis</h3>
          <div className="metric-row">
            <span className="metric-label">Complexity:</span>
            <span className={`metric-value ${getStatusClass(results.structuralAnalysis.qualityScore)}`}>
              {results.structuralAnalysis.complexity}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Quality Score:</span>
            <span className={`metric-value ${getStatusClass(results.structuralAnalysis.qualityScore)}`}>
              {results.structuralAnalysis.qualityScore}/100
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Functions:</span>
            <span className="metric-value">{results.structuralAnalysis.functions.length}</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Variables:</span>
            <span className="metric-value">{results.structuralAnalysis.variableCount}</span>
          </div>
          {results.structuralAnalysis.nestedLoops && (
            <div className="warning-badge">
              ⚠️ Nested loops detected
            </div>
          )}
        </motion.div>

        {/* Test Results Card */}
        <motion.div variants={itemVariants} className="score-card">
          <h3 className="card-title typography-main">Test Results</h3>
          <div className="metric-row">
            <span className="metric-label">Pass Rate:</span>
            <span className={`metric-value ${getStatusClass(results.testResults.summary.score)}`}>
              {results.testResults.summary.passed}/{results.testResults.summary.total}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Score:</span>
            <span className={`metric-value ${getStatusClass(results.testResults.summary.score)}`}>
              {results.testResults.summary.score}%
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Edge Cases:</span>
            <span className="metric-value">
              {results.testResults.summary.edgeCasesPassed}/2 passed
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Avg Time:</span>
            <span className="metric-value">
              {results.testResults.performanceMetrics.averageTime}ms
            </span>
          </div>
        </motion.div>

        {/* Performance Metrics Card */}
        <motion.div variants={itemVariants} className="score-card">
          <h3 className="card-title typography-main">Performance Metrics</h3>
          <div className="metric-row">
            <span className="metric-label">Avg Execution:</span>
            <span className="metric-value">
              {results.testResults.performanceMetrics.averageTime}ms
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Max Time:</span>
            <span className="metric-value">
              {results.testResults.performanceMetrics.maxTime}ms
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Total Time:</span>
            <span className="metric-value">
              {results.testResults.performanceMetrics.totalTime}ms
            </span>
          </div>
          {results.testResults.summary.performanceIssues.length > 0 && (
            <div className="warning-badge">
              ⚠️ {results.testResults.summary.performanceIssues.length} performance issue(s)
            </div>
          )}
        </motion.div>
      </div>

      {/* Strengths and Improvements */}
      <div className="insights-grid">
        <motion.div variants={itemVariants} className="insights-card strengths">
          <h3 className="card-title typography-main">💪 Strengths</h3>
          {results.summary.strengths.length > 0 ? (
            <ul className="insights-list typography-academic">
              {results.summary.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  {strength}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="typography-academic text-muted">Keep practicing to build strengths!</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="insights-card improvements">
          <h3 className="card-title typography-main">🎯 Improvements</h3>
          {results.summary.improvements.length > 0 ? (
            <ul className="insights-list typography-academic">
              {results.summary.improvements.map((improvement, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  {improvement}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="typography-academic text-muted">Excellent work! No major improvements needed.</p>
          )}
        </motion.div>
      </div>

      {/* Senior Dev Advice */}
      {results.advice.specific.length > 0 && (
        <motion.div variants={itemVariants} className="advice-section">
          <h3 className="section-title typography-main">Senior Dev Recommendations</h3>
          <div className="advice-grid">
            {results.advice.specific.map((advice, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="advice-card"
                transition={{ delay: index * 0.15 }}
              >
                <h4 className="advice-title typography-main">{advice.title}</h4>
                <div className="advice-priority">
                  Priority: <span className={`priority-${advice.priority}`}>{advice.priority}</span>
                </div>
                <ul className="advice-points typography-academic">
                  {advice.points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
                {advice.codeExample && (
                  <div className="code-example">
                    <pre><code>{advice.codeExample}</code></pre>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Steps */}
      {results.advice.nextSteps.length > 0 && (
        <motion.div variants={itemVariants} className="next-steps">
          <h3 className="section-title typography-main">🚀 Next Steps</h3>
          <div className="steps-timeline">
            {results.advice.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="step-item"
                transition={{ delay: index * 0.1 }}
              >
                <div className="step-number">{step.priority}</div>
                <div className="step-content">
                  <h4 className="step-title typography-main">{step.action}</h4>
                  <p className="step-description typography-academic">{step.description}</p>
                  <span className="step-time">⏱️ {step.estimatedTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Technical Debt Gauge Component
 */
const TechnicalDebtGauge = ({ debt }) => {
  const percentage = debt.score;
  const rotation = (percentage * 180) / 100 - 90; // Convert to degrees, offset by -90
  
  const getGaugeColor = (score) => {
    if (score <= 30) return 'var(--pass)';
    if (score <= 60) return 'var(--warn)';
    return 'var(--fail)';
  };

  return (
    <div className="technical-debt-gauge">
      <svg width="200" height="100" viewBox="0 0 200 100">
        {/* Background arc */}
        <path
          d="M 30 90 A 60 60 0 0 1 170 90"
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <motion.path
          d="M 30 90 A 60 60 0 0 1 170 90"
          fill="none"
          stroke={getGaugeColor(percentage)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 188.5} 188.5`}
          initial={{ strokeDasharray: "0 188.5" }}
          animate={{ strokeDasharray: `${(percentage / 100) * 188.5} 188.5` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Center text */}
        <text x="100" y="70" textAnchor="middle" className="gauge-text">
          <tspan className="gauge-percentage" style={{ fill: getGaugeColor(percentage) }}>
            {percentage}%
          </tspan>
          <tspan x="100" dy="15" className="gauge-label">
            {debt.level.toUpperCase()}
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default Dashboard;
