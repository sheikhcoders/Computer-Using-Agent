/**
 * Multi-Agent System Type Definitions
 * Following AI SDK patterns for agent orchestration
 */

import type { CoreMessage, ToolResultPart } from "ai";

/**
 * Available specialized agents
 */
export type AgentType =
  | "orchestrator" // Routes tasks to specialized agents
  | "code"         // Full-stack development, testing
  | "research"     // Deep research, search, analysis
  | "ppt"          // Presentation generation
  | "multimodal";  // Image, audio, video processing

/**
 * Agent capability definitions
 */
export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  model: string;
  capabilities: AgentCapability[];
  maxSteps: number;
  temperature: number;
  tools: string[]; // Tool IDs available to this agent
}

/**
 * Task status in the agent workflow
 */
export type TaskStatus =
  | "pending"
  | "planning"
  | "in_progress"
  | "waiting_input"
  | "completed"
  | "failed";

/**
 * Sub-task created by task decomposition
 */
export interface SubTask {
  id: string;
  parentId: string;
  title: string;
  description: string;
  assignedAgent: AgentType;
  status: TaskStatus;
  priority: number;
  dependencies: string[]; // IDs of tasks that must complete first
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Main task submitted by user
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  subTasks: SubTask[];
  messages: CoreMessage[];
  result?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Agent execution context
 */
export interface AgentContext {
  taskId: string;
  subTaskId?: string;
  messages: CoreMessage[];
  previousResults: Map<string, string>;
  artifacts: Artifact[];
}

/**
 * Artifact produced by agents (code, files, images, etc.)
 */
export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  language?: string; // For code artifacts
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type ArtifactType =
  | "code"
  | "file"
  | "image"
  | "chart"
  | "presentation"
  | "document"
  | "audio"
  | "video";

/**
 * Tool execution result
 */
export interface ToolResult {
  success: boolean;
  output: string;
  artifacts?: Artifact[];
  error?: string;
}

/**
 * MCP (Model Context Protocol) integration
 */
export interface MCPConfig {
  id: string;
  name: string;
  description: string;
  endpoint?: string;
  apiKey?: string;
  tools: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

/**
 * Agent response with structured output
 */
export interface AgentResponse {
  message: string;
  thinking?: string; // Chain-of-thought reasoning
  plan?: string[];   // Planned steps
  artifacts?: Artifact[];
  subTasks?: Omit<SubTask, "id" | "parentId" | "createdAt">[];
  toolCalls?: Array<{
    tool: string;
    args: Record<string, unknown>;
    result?: ToolResult;
  }>;
  nextAction?: "continue" | "wait_input" | "delegate" | "complete";
  delegateTo?: AgentType;
}
