/**
 * Application constants
 */

// App metadata
export const APP_NAME = "Computer-Using Agent";
export const APP_DESCRIPTION = "An AI-powered agent that performs tasks on your behalf";
export const APP_URL = "https://github.com/sheikhcoders/Computer-Using-Agent";

// API configuration
export const API_ROUTES = {
  CHAT: "/api/chat",
} as const;

// UI constants
export const UI = {
  // MUST: Hit target ≥24px (mobile ≥44px)
  MIN_HIT_TARGET_DESKTOP: 24,
  MIN_HIT_TARGET_MOBILE: 44,
  
  // Maximum message length
  MAX_MESSAGE_LENGTH: 10000,
  
  // Animation durations (ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 200,
  ANIMATION_SLOW: 300,
  
  // Toast duration (ms)
  TOAST_DURATION: 5000,
  
  // Debounce delays (ms)
  DEBOUNCE_INPUT: 300,
  DEBOUNCE_SCROLL: 100,
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: {
    key: "Enter",
    meta: true, // Cmd on Mac, Ctrl on Windows
    description: "Send message",
  },
  NEW_CHAT: {
    key: "n",
    meta: true,
    shift: true,
    description: "New chat",
  },
  TOGGLE_THEME: {
    key: "t",
    meta: true,
    shift: true,
    description: "Toggle theme",
  },
} as const;
