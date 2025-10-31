
import { 
  GEMINI_API_URL, 
  PROMPTS, 
  MAX_HISTORY_ITEMS 
} from './config.js'; 

import { GEMINI_API_KEY } from './api-key-loader.js';

let currentMode = null;
let apiKey = null; 
let promptAPIAvailable = false;
let translatorAPIAvailable = false;


document.addEventListener('DOMContentLoaded', async () => {
  apiKey = GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE" ? GEMINI_API_KEY : null;

  promptAPIAvailable = await checkPromptAPIAvailability();
  translatorAPIAvailable = await checkTranslatorAPIAvailability();

  console.log('API Availability Check:');
  console.log('- Prompt API:', promptAPIAvailable);
  console.log('- Translator API:', translatorAPIAvailable);
  console.log('- Gemini API Key:', apiKey ? 'Configured' : 'Not configured');

  if (!promptAPIAvailable && !apiKey) {
    showMessage('mainMessage', 'Error: No AI service available. Please configure your Gemini API Key in api-key-loader.js.', 'error');
  }
  
  showView('main');
  setupEventListeners();
});

async function checkPromptAPIAvailability() {
  try {
    if ('ai' in window && 'languageModel' in window.ai) {
      const capabilities = await window.ai.languageModel.capabilities();
      return capabilities.available === 'readily';
    }
    return false;
  } catch (error) {
    console.log('Prompt API not available:', error);
    return false;
  }
}

async function checkTranslatorAPIAvailability() {
  try {
    if (!('translation' in self)) {
      console.log('translation not in self');
      return false;
    }

    if (!('canTranslate' in self.translation)) {
      console.log('canTranslate not in self.translation');
      return false;
    }

    const testResult = await self.translation.canTranslate({
      sourceLanguage: 'es',
      targetLanguage: 'en'
    });

    console.log('Translator API test result (es->en):', testResult);
    return testResult !== 'no';
  } catch (error) {
    console.log('Translator API not available:', error);
    return false;
  }
}

async function detectLanguage(text) {
  try {
    if (!('translation' in self)) {
      console.log('Language Detector: translation API not available');
      return null;
    }

    if (!('canDetect' in self.translation)) {
      console.log('Language Detector: canDetect not available');
      return null;
    }

    const detector = await self.translation.createDetector();
    const results = await detector.detect(text);
    
    if (results && results.length > 0) {
      // Return the most confident language detection
      const topResult = results.sort((a, b) => b.confidence - a.confidence)[0];
      console.log(`Detected language: ${topResult.detectedLanguage} (confidence: ${topResult.confidence})`);
      return topResult.detectedLanguage;
    }
    
    console.log('Language detection returned no results');
    return null;
  } catch (error) {
    console.error('Language detection error:', error);
    return null;
  }
}

async function translateWithChromeAPI(text, sourceLanguage, targetLanguage = 'en') {
  console.log(`Translation attempt: ${sourceLanguage} -> ${targetLanguage}`);
  
  if (!translatorAPIAvailable) {
    console.log('Translator API not available');
    return null;
  }

  try {
    if (sourceLanguage === targetLanguage) {
      console.log('Source and target languages are the same');
      return text;
    }

    const canTranslateResult = await self.translation.canTranslate({
      sourceLanguage,
      targetLanguage
    });

    console.log(`Can translate result: ${canTranslateResult}`);

    if (canTranslateResult === 'no') {
      console.log(`Translation not supported for ${sourceLanguage} to ${targetLanguage}`);
      return null;
    }

    if (canTranslateResult === 'after-download') {
      console.log('Downloading translation model...');
      document.getElementById('loadingText').textContent = `Downloading ${sourceLanguage} → ${targetLanguage} translation model...`;
    }

    document.getElementById('loadingText').textContent = `Translating from ${sourceLanguage} to ${targetLanguage}...`;

    const translator = await self.translation.createTranslator({
      sourceLanguage,
      targetLanguage
    });

    const translatedText = await translator.translate(text);
    console.log('Translation successful');
    
    return translatedText;
  } catch (error) {
    console.error('Chrome Translation API error:', error);
    return null;
  }
}

function setupEventListeners() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMode(btn.dataset.mode));
  });

  document.getElementById('copyBtn').addEventListener('click', copyResult);
  document.getElementById('newAnalysisBtn').addEventListener('click', () => showView('main'));

  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  document.getElementById('backFromHistoryBtn').addEventListener('click', () => showView('main'));

  document.getElementById('historyLink').addEventListener('click', showHistory);
}

function selectMode(mode) {
  if (!promptAPIAvailable && !apiKey) {
    showMessage('mainMessage', 'Error: No AI service available.', 'error');
    return;
  }
  
  currentMode = mode;
  
  // Set/manage the active button state for UI feedback
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  // Set 'active' class on the clicked button
  document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');

  const customPromptGroup = document.getElementById('customPromptGroup');
  if (mode === 'custom') {
    customPromptGroup.style.display = 'block';
    document.getElementById('customPrompt').focus();
  } else {
    customPromptGroup.style.display = 'none';
  }
  
  captureAndAnalyze(mode);
}

async function captureAndAnalyze(mode) {
  showView('loading');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const screenshot = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    
    let prompt = PROMPTS[mode];
    if (mode === 'custom') {
      prompt = document.getElementById('customPrompt').value.trim();
      if (!prompt) {
        showMessage('mainMessage', 'Please enter a custom prompt', 'error');
        showView('main');
        return;
      }
    }
    
    let explanation;
    let usedAPI;
    
    if (mode === 'translate') {
      console.log('TRANSLATE MODE STARTED');
      document.getElementById('loadingText').textContent = 'Extracting text from image...';
      
      const extractPrompt = "Extract all visible text from this image. Return ONLY the text content, without any additional commentary, formatting, or explanation. If there's no text, reply with 'NO_TEXT_FOUND'.";
      const extractedText = await callGeminiAPI(screenshot, extractPrompt);
      console.log('Extracted text length:', extractedText.length);
      
      if (extractedText.trim() === 'NO_TEXT_FOUND' || extractedText.trim() === '') {
        console.log('No text found in image');
        explanation = "No text was found in the image.";
        usedAPI = 'gemini';
      } else {
        // Try Chrome Translator API if available
        if (translatorAPIAvailable) {
          console.log('Attempting Chrome Translator...');
          
          document.getElementById('loadingText').textContent = 'Detecting language...';
          let detectedLanguage = await detectLanguage(extractedText);
          
          if (!detectedLanguage) {
            console.log('Trying common languages...');
            const languagesToTry = ['es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko'];
            
            for (const lang of languagesToTry) {
              const translated = await translateWithChromeAPI(extractedText, lang, 'en');
              if (translated && translated !== extractedText) {
                detectedLanguage = lang;
                const languageNames = {
                  'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
                  'pt': 'Portuguese', 'ja': 'Japanese', 'zh': 'Chinese', 'ko': 'Korean'
                };
                const langName = languageNames[lang] || lang.toUpperCase();
                explanation = `**Original Text (${langName}):**\n${extractedText}\n\n**English Translation (Chrome Translator API):**\n${translated}`;
                usedAPI = 'chrome-translator';
                console.log('Translation successful with:', lang);
                break;
              }
            }
          } else if (detectedLanguage === 'en') {
            explanation = `**Text (English):**\n${extractedText}\n\n(Text is already in English - no translation needed)`;
            usedAPI = 'gemini';
          } else {
            // Try translating with detected language
            const translated = await translateWithChromeAPI(extractedText, detectedLanguage, 'en');
            if (translated && translated !== extractedText) {
              const languageNames = {
                'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
                'pt': 'Portuguese', 'ja': 'Japanese', 'zh': 'Chinese', 'ko': 'Korean',
                'ru': 'Russian', 'ar': 'Arabic', 'hi': 'Hindi'
              };
              const langName = languageNames[detectedLanguage] || detectedLanguage.toUpperCase();
              explanation = `**Original Text (${langName}):**\n${extractedText}\n\n**English Translation (Chrome Translator API):**\n${translated}`;
              usedAPI = 'chrome-translator';
            }
          }
        }
        
        // Fallback to Gemini if Chrome Translator didn't work
        if (!usedAPI || usedAPI !== 'chrome-translator') {
          console.log('🔄 INITIATING GEMINI FALLBACK');
          document.getElementById('loadingText').textContent = '🔄 Chrome Translator unavailable - Using Gemini API fallback...';
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const fallbackPrompt = `Translate the following text to English. Provide both the original text and the English translation in a clear format.\n\nText: ${extractedText}`;
          explanation = "**Chrome Translator API Unavailable - Using Gemini API**\n\n" + await callGeminiAPI(screenshot, fallbackPrompt);
          usedAPI = 'gemini-fallback';
          console.log('Gemini fallback completed');
        }
      }
    }
    // Try Prompt API first if available for non-translate modes
    else if (promptAPIAvailable) {
      try {
        document.getElementById('loadingText').textContent = 'Analyzing with Prompt API...';
        explanation = await callPromptAPI(screenshot, prompt);
        usedAPI = 'prompt';
      } catch (error) {
        console.log('Prompt API failed, falling back to Gemini:', error);
        if (apiKey) {
          document.getElementById('loadingText').textContent = 'Falling back to Gemini API...';
          explanation = await callGeminiAPI(screenshot, prompt);
          usedAPI = 'gemini';
        } else {
          throw new Error('Prompt API failed and no Gemini API key available');
        }
      }
    } else if (apiKey) {
      document.getElementById('loadingText').textContent = 'Analyzing with Gemini API...';
      explanation = await callGeminiAPI(screenshot, prompt);
      usedAPI = 'gemini';
    } else {
      throw new Error('No AI service available. Please configure an API key in api-key-loader.js.');
    }
    
    await saveToHistory(mode, explanation, usedAPI);
    
    document.getElementById('resultText').textContent = explanation;
    
    const indicator = document.getElementById('apiModeIndicator');
    if (usedAPI === 'prompt') {
      indicator.textContent = 'Prompt API';
      indicator.className = 'api-mode-indicator api-mode-prompt';
    } else if (usedAPI === 'chrome-translator') {
      indicator.textContent = 'Chrome Translator API';
      indicator.className = 'api-mode-indicator api-mode-translator';
    } else if (usedAPI === 'gemini-fallback') {
      indicator.textContent = 'Gemini API (Fallback)';
      indicator.className = 'api-mode-indicator api-mode-gemini';
    } else {
      indicator.textContent = 'Gemini API';
      indicator.className = 'api-mode-indicator api-mode-gemini';
    }
    
    showView('result');
    
  } catch (error) {
    console.error('Error:', error);
    showMessage('mainMessage', `Error: ${error.message}`, 'error');
    showView('main');
  }
}

async function callPromptAPI(base64Image, prompt) {
  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: "You are a helpful AI assistant that analyzes images and provides clear, accurate explanations."
    });
    
    const fullPrompt = `${prompt}\n\nNote: Image analysis via Prompt API. If image support is not available, please indicate this limitation.`;
    const result = await session.prompt(fullPrompt);
    
    session.destroy();
    
    return result;
  } catch (error) {
    console.error('Prompt API error:', error);
    throw error;
  }
}

async function callGeminiAPI(base64Image, prompt) {
  const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: "image/png",
            data: imageData
          }
        }
      ]
    }]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid API response format');
  }

  return data.candidates[0].content.parts[0].text;
}

async function saveToHistory(mode, text, apiUsed) {
  const result = await chrome.storage.local.get(['history']);
  const history = result.history || [];
  
  history.unshift({
    mode,
    text,
    apiUsed,
    timestamp: Date.now()
  });
  
  if (history.length > MAX_HISTORY_ITEMS) { 
    history.pop();
  }
  
  await chrome.storage.local.set({ history });
}

async function showHistory() {
  const result = await chrome.storage.local.get(['history']);
  const history = result.history || [];
  
  const listEl = document.getElementById('historyList');
  
  if (history.length === 0) {
    listEl.innerHTML = '<p style="color: #888; text-align: center;">No history yet</p>';
  } else {
    listEl.innerHTML = history.map((item, index) => {
      const date = new Date(item.timestamp);
      let apiLabel = 'Gemini API';
      if (item.apiUsed === 'prompt') apiLabel = 'Prompt API';
      else if (item.apiUsed === 'chrome-translator') apiLabel = 'Chrome Translator';
      else if (item.apiUsed === 'gemini-fallback') apiLabel = 'Gemini API (Fallback)';
      
      return `
        <div class="history-item" data-index="${index}" style="cursor: pointer;">
          <div class="time">${date.toLocaleString()} • ${apiLabel}</div>
          <div class="mode">${item.mode}</div>
          <div class="text">${item.text}</div>
        </div>
      `;
    }).join('');
    
    // Add click event listeners to history items
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        viewHistoryItem(history[index]);
      });
    });
  }
  
  showView('history');
}

function viewHistoryItem(item) {
  document.getElementById('resultText').textContent = item.text;
  
  const indicator = document.getElementById('apiModeIndicator');
  if (item.apiUsed === 'prompt') {
    indicator.textContent = 'Prompt API';
    indicator.className = 'api-mode-indicator api-mode-prompt';
  } else if (item.apiUsed === 'chrome-translator') {
    indicator.textContent = 'Chrome Translator API';
    indicator.className = 'api-mode-indicator api-mode-translator';
  } else if (item.apiUsed === 'gemini-fallback') {
    indicator.textContent = 'Gemini API (Fallback)';
    indicator.className = 'api-mode-indicator api-mode-gemini';
  } else {
    indicator.textContent = 'Gemini API';
    indicator.className = 'api-mode-indicator api-mode-gemini';
  }
  
  showView('result');
}

async function clearHistory() {
  await chrome.storage.local.set({ history: [] });
  showHistory();
}

function copyResult() {
  const text = document.getElementById('resultText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
}

function showView(viewName) {
  document.querySelectorAll('.main-view, .result-view, .history-view').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById('loadingView').style.display = 'none';
  
  if (viewName === 'loading') {
    document.getElementById('loadingView').style.display = 'block';
  } else {
    const viewEl = document.getElementById(`${viewName}View`);
    if (viewEl) {
      viewEl.classList.add('active');
    }
  }
}

function showMessage(elementId, message, type) {
  const el = document.getElementById(elementId);
  el.className = type;
  el.textContent = message;
  el.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      el.style.display = 'none';
    }, 3000);
  }
}