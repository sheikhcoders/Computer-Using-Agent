import { createProviderRegistry } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * AI Provider Registry
 * 
 * Manages multiple FREE AI providers with a unified interface.
 * Access models using: registry.languageModel("providerId:modelId")
 * 
 * FREE Providers:
 * - Groq: Fast inference with Llama, Gemma, Mixtral (30 req/min free)
 * - Google: Gemini models with generous free tier
 */

// Initialize Groq provider (FREE tier available)
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Google Gemini provider (FREE tier available)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Create the provider registry
export const registry = createProviderRegistry({
  groq,
  google,
});

/**
 * Available FREE models configuration
 * Each model includes its capabilities and recommended use cases
 */
export const availableModels = [
  {
    id: "groq:llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    provider: "Groq",
    description: "Best overall performance, fast inference",
    capabilities: ["chat", "reasoning", "coding"],
    contextWindow: 128000,
    free: true,
  },
  {
    id: "groq:gemma2-9b-it",
    name: "Gemma 2 9B",
    provider: "Groq",
    description: "Efficient model, good for quick tasks",
    capabilities: ["chat", "structured-output"],
    contextWindow: 8192,
    free: true,
  },
  {
    id: "groq:mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "Groq",
    description: "Strong multilingual support",
    capabilities: ["chat", "multilingual"],
    contextWindow: 32768,
    free: true,
  },
  {
    id: "groq:llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    provider: "Groq",
    description: "Fastest response times",
    capabilities: ["chat"],
    contextWindow: 128000,
    free: true,
  },
  {
    id: "google:gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    description: "Latest Gemini, multimodal, Google Search",
    capabilities: ["chat", "vision", "google-search", "reasoning"],
    contextWindow: 1000000,
    free: true,
  },
  {
    id: "google:gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    description: "Fast multimodal model with long context",
    capabilities: ["chat", "vision", "long-context"],
    contextWindow: 1000000,
    free: true,
  },
  {
    id: "google:gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    provider: "Google",
    description: "Lightweight, fastest Gemini model",
    capabilities: ["chat", "vision"],
    contextWindow: 1000000,
    free: true,
  },
] as const;

export type ModelId = (typeof availableModels)[number]["id"];
