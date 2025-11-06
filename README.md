# VisioExplain
**AI-powered visual understanding for education and learning**

VisioExplain is a Chrome Extension that transforms how you learn from visual content on the web. Whether you're studying technical documentation, trying to understand complex diagrams, or solving math problems, VisioExplain provides instant, AI-powered explanations and guidance.

##  Educational Use Cases

**Understanding Complex Concepts**
- Explain technical architecture diagrams (APIs, system design, protocols)
- Break down flowcharts and process diagrams
- Understand infographics and data visualizations

**Math & Problem Solving**
- Solve mathematical equations from images
- Get step-by-step solution explanations
- Generate similar practice problems

**Learning Support**
- Translate foreign language content
- Simplify complex technical documentation
- Get beginner-friendly or advanced explanations on demand

##  Key Features

 **AI-Powered Visual Understanding** — Analyze any webpage, image, or diagram for clear, context-aware explanations

 **Dynamic Analysis Modes**
- **Simple**: Easy-to-understand explanations for beginners
- **Technical**: Detailed, expert-level analysis
- **Translate**: Multilingual support for global content
- **Custom**: Ask specific questions (Q&A mode)

 **Interactive Learning** — Ask follow-up questions to deepen your understanding

 **History Panel** — Save and revisit previous explanations for reference

##  Hybrid AI Architecture

VisioExplain employs intelligent routing between local and cloud AI to balance privacy, performance, and capability:

###  Local Processing (Privacy-First)
- **APIs Used**: Chrome's Prompt API & Translator API
- **Use Cases**: Text analysis, simple explanations, translation
- **Benefits**: 100% on-device, instant results, works offline, zero data transmission

###  Cloud Processing (Advanced Understanding)
- **API Used**: Gemini API
- **Use Cases**: Complex visual content, diagrams, mathematical expressions
- **Benefits**: Advanced multimodal understanding, handles sophisticated queries

**How It Works**: The extension automatically detects content type and routes to the most appropriate AI engine. Text-based content uses privacy-first local processing; complex visual content leverages cloud-based multimodal AI when needed.

##  Built for the Google Chrome Built-in AI Challenge 2025

VisioExplain demonstrates:

 **True Hybrid Architecture** — Strategic combination of Chrome's built-in APIs with Gemini fallback  
 **Multimodal Excellence** — Comprehensive support for text, images, diagrams, and mathematical content  
 **Privacy-First Design** — Local processing wherever possible  
 **Real Educational Impact** — Empowers learners, students, and professionals to understand complex content

##  Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Platform**: Chrome Extension (Manifest V3)
- **AI APIs**:
  - Chrome Prompt API (local text reasoning)
  - Chrome Translator API (local language translation & detection)
  - Gemini API (multimodal visual analysis)
- **Storage**: Chrome local storage (for history)

##  Privacy by Design

- All text-based analysis runs locally on your device via Chrome's built-in AI
- Only visual content requiring advanced understanding is processed via cloud
- No browsing history or personal data stored externally
- Full transparency - you always know which API is processing your data
- Clear API indicators show whether processing is local or cloud-based

## Installation & Setup

```bash
git clone https://github.com/<your-username>/VisioExplain.git
cd VisioExplain
```

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer Mode** (toggle in top-right)
3. Click **"Load unpacked"** and select the project folder
4. Configure your Gemini API key in `api-key-loader.js` (for fallback support)
5. Click the VisioExplain icon in your toolbar to start learning!

##  How to Use

### Understanding Technical Concepts
1. Navigate to documentation with architecture diagrams (e.g., system design, API flows)
2. Click VisioExplain icon → Select **"Technical"** mode
3. Get detailed explanations of the concepts and relationships shown

### Solving Math Problems
1. Navigate to a page with mathematical equations or problems
2. Click VisioExplain icon → Select **"Custom"** mode
3. Ask "Solve this equation and show steps" or "Generate similar practice problems"

### Learning in Multiple Languages
1. Visit content in any language
2. Click VisioExplain icon → Select **"Translate"** mode
3. Get instant translations with automatic language detection

### Simple Explanations
1. Find complex content you want to understand
2. Click VisioExplain icon → Select **"Simple"** mode
3. Get beginner-friendly explanations

##  Demo Scenarios

**Scenario 1: Understanding Technical Architecture**
- Navigate to a page explaining Model Context Protocol (MCP)
- Use "Technical" mode to understand the architecture
- Ask follow-up questions about specific components

**Scenario 2: Math Problem Solving**
- Find a page with mathematical equations
- Use "Custom" mode to solve problems step-by-step
- Request similar practice problems for learning

**Scenario 3: Multilingual Learning**
- Visit foreign language educational content
- Use "Translate" mode with automatic language detection
- Get explanations in your preferred language

**Scenario 4: Quick Understanding**
- Encounter unfamiliar diagrams or infographics
- Use "Simple" mode for accessible explanations
- Save to history for later reference

## Educational Impact

VisioExplain addresses real learning challenges:

- **Visual Learners**: Understand diagrams and visual content better
- **Self-Learners**: Get instant tutoring on complex topics
- **Language Barriers**: Access global educational content
- **Technical Documentation**: Navigate complex architecture and system designs
- **STEM Education**: Solve and understand mathematical problems

## Technical Implementation Notes

**Chrome Built-in AI Integration**:
- Implements Chrome Prompt API for text-based reasoning
- Uses Chrome Translator API with automatic language detection
- Graceful fallback to Gemini API for advanced multimodal scenarios
- Trial tokens configured for Early Preview Program access

**Known Limitations**:
- Chrome Prompt API does not yet support image input (as of current release)
- Image analysis requires Gemini API until Chrome's multimodal support is available
- Extension designed to seamlessly adopt new API capabilities as Chrome evolves

**Architecture Design**:
The hybrid approach ensures consistent functionality while prioritizing privacy. As Chrome's built-in AI capabilities expand, VisioExplain's architecture allows for transparent migration to fully local processing.

## Future Roadmap

**Enhanced Learning Features**:
- Speech API integration for audio explanations
- Interactive quiz generation from analyzed content
- Progress tracking and learning analytics
- Spaced repetition reminders for saved concepts

**Expanded Capabilities**:
- PDF and document analysis
- Domain-specific modes (coding, mathematics, science)
- Visual annotations and highlighting
- Collaborative learning (share explanations)
- Offline caching for repeated analyses

**API Integration**:
- Full migration to Chrome's multimodal Prompt API when available
- Enhanced on-device processing for privacy
- Support for additional Chrome AI APIs as they launch

##  License

MIT License

## Credits

**Developed for**: Google Chrome Built-in AI Challenge 2025

**Powered by**:
- Chrome Built-in AI APIs (Prompt & Translator)
- Gemini API (Multimodal fallback)

**Mission**: Making visual learning accessible, instant, and private for everyone.

---

*VisioExplain: Transforming how the web teaches, one screenshot at a time.* 
