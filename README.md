# LINT-PRO - Deep AI Coding Evaluator

A sophisticated React-based code evaluation engine that processes submissions through three logic gates: Structural Analysis (AST), Edge-Case Interrogation, and an Explainability Engine with senior developer recommendations.

## 🚀 Features

### Logic Gate A: Structural Analysis (AST)
- **Complexity Detection**: Identifies O(n²) nested loops vs O(n) single loops
- **Variable Naming Quality**: Flags 1-2 character variable names (x, y, i, j)
- **Code Structure Analysis**: Function counting, variable tracking, and pattern detection
- **Real-time AST Parsing**: Uses Acorn for accurate JavaScript parsing

### Logic Gate B: Edge-Case Interrogation
- **Comprehensive Test Suites**: Pre-built test cases for common problems (Two Sum, String Reversal, Palindrome Checker, Array Max)
- **Edge Case Coverage**: Empty input, null/undefined, single elements, large datasets (10k+ items)
- **Performance Metrics**: Execution time tracking and performance issue identification
- **Mock Test Runner**: Safe sandboxed code execution environment

### Logic Gate C: Explainability Engine
- **Senior Dev Advice**: Maps specific failures to constructive, actionable recommendations
- **Code Examples**: Provides optimized code examples for common issues
- **Technical Debt Analysis**: Calculates and visualizes technical debt with actionable insights
- **Priority-based Recommendations**: Next steps with time estimates

## 🎨 Precision Engineering Aesthetic

### Typography
- **Main UI**: Helvetica Neue (Clean, neutral, authoritative)
- **Feedback/Narrative**: Apple Garamond (Academic, classic, trustworthy)

### Visual Design
- **Background**: Deep Charcoal (#0B0B0B) with CSS-grid pattern overlay
- **Color Scheme**: High-contrast CSS variables
  - Pass: #00FF94
  - Warn: #FFD600  
  - Fail: #FF0055
- **Scanning Animation**: Staggered text reveals during analysis
- **Technical Debt Gauge**: Animated semi-circle SVG visualization

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Framer Motion**: Staggered entrance animations and micro-interactions
- **Acorn**: JavaScript AST parsing
- **CSS Variables**: Consistent theming and design system
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Main results dashboard with animations
│   ├── Dashboard.css         # Dashboard styling
│   ├── CodeEditor.js         # Code input with scanning overlay
│   └── CodeEditor.css        # Editor styling
├── hooks/
│   └── useEvaluator.js       # Main evaluation state management
├── utils/
│   ├── astAnalyzer.js        # Logic Gate A: Structural analysis
│   ├── testRunner.js         # Logic Gate B: Test suite execution
│   └── explainabilityEngine.js # Logic Gate C: Senior dev advice
├── App.js                    # Main application component
├── App.css                   # App-level styling
├── index.js                  # React entry point
└── index.css                 # Global styles and CSS variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-coding-evaluator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

## 📊 Usage

1. **Enter Code**: Paste or write JavaScript code in the editor
2. **Sample Code**: Use provided samples for Two Sum, String Reversal, or Nested Loops
3. **Evaluate**: Click "Evaluate Code" to run through all three logic gates
4. **Review Results**: View comprehensive analysis with:
   - Overall grade (A-F) and score
   - Technical debt gauge
   - Structural analysis metrics
   - Test results and performance metrics
   - Strengths and improvement areas
   - Senior developer recommendations
   - Actionable next steps

## 🔧 Core Components

### useEvaluator Hook
Manages the complete evaluation lifecycle:
- State management (Idle → Processing → Success)
- Scanning stage animations
- Error handling and recovery
- Results aggregation

### Dashboard Component
Features Framer Motion animations:
- Staggered entrance effects
- Technical debt gauge animation
- Hover states and micro-interactions
- Responsive grid layouts

### Analysis Engines

#### AST Analyzer (`astAnalyzer.js`)
```javascript
const analysis = analyzeComplexity(code);
// Returns complexity, loop detection, naming issues, quality score
```

#### Test Runner (`testRunner.js`)
```javascript
const results = runTestSuite(code, problemType);
// Returns test results, performance metrics, edge case coverage
```

#### Explainability Engine (`explainabilityEngine.js`)
```javascript
const advice = generateAdvice(structuralAnalysis, testResults);
// Returns senior dev recommendations, code examples, next steps
```

## 🎯 Supported Problem Types

- **Two Sum**: Array-based target sum problem
- **String Reversal**: String manipulation and edge cases
- **Palindrome Checker**: Algorithmic thinking and validation
- **Array Maximum**: Basic array operations and performance

## 🔍 Analysis Features

### Structural Analysis
- Loop nesting detection (O(n²) vs O(n))
- Variable naming convention checking
- Function and variable counting
- Pattern detection (recursion, async, error handling)

### Performance Testing
- Large dataset execution (10k+ items)
- Execution time tracking
- Memory efficiency analysis
- Performance bottleneck identification

### Code Quality Assessment
- Technical debt calculation
- Best practices adherence
- Readability and maintainability scoring
- Industry standards compliance

## 🎨 Design System

### CSS Variables
```css
:root {
  --pass: #00FF94;
  --warn: #FFD600;
  --fail: #FF0055;
  --bg-primary: #0B0B0B;
  --bg-secondary: #1A1A1A;
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --border-color: #333333;
}
```

### Typography Classes
- `.typography-main`: Helvetica Neue for UI elements
- `.typography-academic`: Apple Garamond for feedback content

## 🚀 Future Enhancements

- [ ] Additional programming language support
- [ ] Custom test case creation
- [ ] Code comparison and diff analysis
- [ ] Team collaboration features
- [ ] Integration with CI/CD pipelines
- [ ] Advanced performance profiling
- [ ] Machine learning-based recommendations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**LINT-PRO** - Precision Engineering for Code Quality Evaluation
