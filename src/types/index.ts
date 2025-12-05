/**
 * Application-wide type definitions
 */

import type { Message } from "ai";

/**
 * Chat message with additional metadata
 */
export interface ChatMessage extends Message {
  timestamp?: Date;
  model?: string;
}

/**
 * Model provider configuration
 */
export interface ModelProvider {
  id: string;
  name: string;
  description: string;
  free: boolean;
}

/**
 * Model configuration
 */
export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: readonly string[];
  contextWindow: number;
  free: boolean;
}

/**
 * Chat session state
 */
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Action types for CUA
 */
export type ActionType = 
  | "click"
  | "type"
  | "scroll"
  | "hover"
  | "wait"
  | "screenshot";

/**
 * CUA Action definition
 */
export interface CUAAction {
  type: ActionType;
  target?: string;
  value?: string;
  position?: { x: number; y: number };
  description: string;
}

/**
 * CUA Task definition
 */
export interface CUATask {
  id: string;
  description: string;
  actions: CUAAction[];
  status: "pending" | "in_progress" | "completed" | "failed";
  result?: string;
}
