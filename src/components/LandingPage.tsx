import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * LandingPage Component - Professional landing page with IDE dashboard transition
 * Features hero section, feature showcase, and smooth transitions
 * 
 * @author Lead Software Architect
 * @version 2.1.0
 */

interface LandingPageProps {
  /** Callback to start evaluation */
  onStartEvaluation: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartEvaluation }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Features showcase
  const features = [
    {
      icon: '🧠',
      title: 'Logic Interrogator',
      description: 'Advanced Big-O detection and pattern matching engine that understands code intent and performance implications.',
      highlight: 'AST Analysis • Edge Cases • Silent Failures'
    },
    {
      icon: '📊',
      title: '100-Point Scoring',
      description: 'Transparent weighted system: 40% Correctness, 30% Efficiency, 20% Readability, 10% Best Practices.',
      highlight: 'Professional Grading • Technical Debt • Actionable Insights'
    },
    {
      icon: '🎨',
      title: 'Precision Engineering',
      description: 'Midnight Obsidian theme with glassmorphism, dynamic gauges, and professional typography.',
      highlight: 'Bento Grid Layout • Micro-interactions • Visual Delight'
    },
    {
      icon: '👨‍💻',
      title: 'Senior Dev Mentorship',
      description: 'Human-like feedback with Apple Garamond typography and actionable refactor suggestions.',
      highlight: 'Context-Aware • Educational • Constructive'
    }
  ];

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const heroVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.2
      }
    }
  };

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 14,
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/30"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg" />
            <span className="text-white font-bold text-xl">LINT-PRO</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={onStartEvaluation}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        variants={heroVariants}
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Loading State */}
          {!isLoaded && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-8"
            />
          )}

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isLoaded ? 0 : 0.3 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Code Analysis,
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of code evaluation with our professional-grade analysis engine.
              <br />
              <span className="text-cyan-400 font-semibold">AI-powered insights</span> that help you write better code.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={onStartEvaluation}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                Start Evaluating
              </button>
              
              <button
                onClick={() => {
                  const element = document.createElement('textarea');
                  element.value = `function twoSum(nums, target) {
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
                  document.body.appendChild(element);
                  element.select();
                  document.execCommand('copy');
                  document.body.removeChild(element);
                }}
                className="px-8 py-4 bg-slate-800 text-slate-300 font-bold text-lg rounded-xl border border-slate-700 hover:bg-slate-700 transition-all duration-200"
              >
                Try Sample Code
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              Professional-Grade Features
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Built for developers who demand excellence. Every feature designed to provide actionable insights.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className={`
                  relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/30 
                  rounded-2xl p-6 cursor-pointer transition-all duration-300
                  ${currentFeature === index ? 'ring-2 ring-cyan-400/20 border-cyan-400/50' : ''}
                `}
              >
                {/* Feature Icon */}
                <motion.div
                  animate={{ 
                    rotate: currentFeature === index ? [0, 10, -10, 0] : 0,
                    scale: currentFeature === index ? [1, 1.1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  {feature.icon}
                </motion.div>

                {/* Feature Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Feature Highlight */}
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-cyan-300 text-sm font-mono">
                    {feature.highlight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Trusted by Developers Worldwide
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-5xl font-bold text-cyan-400 mb-2"
                >
                  10K+
                </motion.div>
                <div className="text-slate-300">Code Evaluations</div>
                <div className="text-slate-500 text-sm">Per Day</div>
              </div>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-5xl font-bold text-green-400 mb-2"
                >
                  95%
                </motion.div>
                <div className="text-slate-300">Accuracy Rate</div>
                <div className="text-slate-500 text-sm">On Average</div>
              </div>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-5xl font-bold text-amber-400 mb-2"
                >
                  50ms
                </motion.div>
                <div className="text-slate-300">Avg Analysis</div>
                <div className="text-slate-500 text-sm">Time</div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={onStartEvaluation}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                Experience LINT-PRO Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
