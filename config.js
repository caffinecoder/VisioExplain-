// config.js - Optional configuration for non-sensitive settings
// This file is for constants and settings, NOT API keys!

export const CONFIG = {
  // API endpoints
  // FIX: Updated model name from 1.5-flash to 2.5-flash
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  
  // Model settings
  GEMINI_MODEL: 'gemini-2.5-flash',
  GEMINI_PRO_MODEL: 'gemini-2.5-pro',
  
  // App settings
  MAX_HISTORY_ITEMS: 10,
  SCREENSHOT_FORMAT: 'png',
  SCREENSHOT_QUALITY: 100,
  
  // Timeout settings (in milliseconds)
  API_TIMEOUT: 30000,
  PROMPT_API_TIMEOUT: 15000,
  
  // UI settings
  LOADING_MIN_DISPLAY_TIME: 500, // Minimum time to show loading spinner
  TOAST_DURATION: 3000,
  
  // Feature flags
  ENABLE_PROMPT_API: true,
  ENABLE_GEMINI_FALLBACK: true,
  ENABLE_HISTORY: true,
  ENABLE_CUSTOM_PROMPTS: true,
  
  // Prompt templates
  PROMPTS: {
    simple: "Explain what you see in this image in simple terms that a 10-year-old could understand. Be clear, friendly, and use everyday language.",
    technical: "Provide a detailed technical analysis of this image. Include specific terminology, measurements, technical concepts, and expert-level insights.",
    translate: "Identify and translate any text visible in this image to English. Preserve formatting and context. If there's no text, describe the image instead.",
    creative: "Describe this image in a creative and imaginative way, as if telling a story.",
    accessibility: "Describe this image in detail for accessibility purposes, including colors, layout, text, and any important visual elements."
  },
  
  // Error messages
  ERRORS: {
    NO_API_KEY: 'No Gemini API key configured. Please add one in Settings.',
    PROMPT_API_FAILED: 'Prompt API is not available on this device.',
    SCREENSHOT_FAILED: 'Failed to capture screenshot. Please try again.',
    API_REQUEST_FAILED: 'Failed to analyze image. Please check your connection.',
    INVALID_RESPONSE: 'Received invalid response from AI service.'
  }
};

// Export individual constants for convenience
export const {
  GEMINI_API_URL,
  MAX_HISTORY_ITEMS,
  PROMPTS,
  ERRORS
} = CONFIG;