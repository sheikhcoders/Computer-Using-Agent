/**
 * MCP (Model Context Protocol) Integration
 * 
 * Supports:
 * - Custom MCPs created from scratch
 * - Pre-built MCPs (GitHub, Slack, Figma, etc.)
 * - MiniMax MCP for extended capabilities
 */

import { tool } from "ai";
import { z } from "zod";
import type { MCPConfig, MCPTool } from "@/lib/agents/types";

/**
 * Pre-built MCP configurations
 */
export const prebuiltMCPs: MCPConfig[] = [
  {
    id: "github",
    name: "GitHub MCP",
    description: "Interact with GitHub repositories, issues, and PRs",
    tools: [
      {
        name: "github_search_repos",
        description: "Search GitHub repositories",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            language: { type: "string" },
          },
        },
      },
      {
        name: "github_get_file",
        description: "Get file contents from a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string" },
            repo: { type: "string" },
            path: { type: "string" },
          },
        },
      },
      {
        name: "github_create_issue",
        description: "Create a new issue",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string" },
            repo: { type: "string" },
            title: { type: "string" },
            body: { type: "string" },
          },
        },
      },
    ],
  },
  {
    id: "slack",
    name: "Slack MCP",
    description: "Send messages and interact with Slack",
    tools: [
      {
        name: "slack_send_message",
        description: "Send a message to a Slack channel",
        inputSchema: {
          type: "object",
          properties: {
            channel: { type: "string" },
            message: { type: "string" },
          },
        },
      },
      {
        name: "slack_list_channels",
        description: "List available Slack channels",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  },
  {
    id: "google_maps",
    name: "Google Maps MCP",
    description: "Search places and get directions",
    tools: [
      {
        name: "maps_search_places",
        description: "Search for places",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            location: { type: "string" },
          },
        },
      },
      {
        name: "maps_get_directions",
        description: "Get directions between locations",
        inputSchema: {
          type: "object",
          properties: {
            origin: { type: "string" },
            destination: { type: "string" },
          },
        },
      },
    ],
  },
  {
    id: "figma",
    name: "Figma MCP",
    description: "Access Figma designs and components",
    tools: [
      {
        name: "figma_get_file",
        description: "Get a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: { type: "string" },
          },
        },
      },
      {
        name: "figma_get_components",
        description: "Get components from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            fileKey: { type: "string" },
          },
        },
      },
    ],
  },
];

/**
 * Custom MCP registry for user-defined MCPs
 */
class MCPRegistry {
  private mcps: Map<string, MCPConfig> = new Map();

  constructor() {
    // Register pre-built MCPs
    for (const mcp of prebuiltMCPs) {
      this.mcps.set(mcp.id, mcp);
    }
  }

  /**
   * Register a custom MCP
   */
  register(config: MCPConfig): void {
    this.mcps.set(config.id, config);
  }

  /**
   * Get an MCP by ID
   */
  get(id: string): MCPConfig | undefined {
    return this.mcps.get(id);
  }

  /**
   * Get all registered MCPs
   */
  getAll(): MCPConfig[] {
    return Array.from(this.mcps.values());
  }

  /**
   * Convert MCP tools to AI SDK format
   */
  getTools(mcpId: string): Record<string, ReturnType<typeof tool>> {
    const mcp = this.mcps.get(mcpId);
    if (!mcp) return {};

    const tools: Record<string, ReturnType<typeof tool>> = {};

    for (const mcpTool of mcp.tools) {
      tools[mcpTool.name] = this.createTool(mcp, mcpTool);
    }

    return tools;
  }

  /**
   * Create an AI SDK tool from MCP tool definition
   */
  private createTool(mcp: MCPConfig, mcpTool: MCPTool): ReturnType<typeof tool> {
    // Build Zod schema from JSON schema
    const params = this.jsonSchemaToZod(mcpTool.inputSchema);

    return tool({
      description: mcpTool.description,
      parameters: params,
      execute: async (args) => {
        // In production, this would call the MCP endpoint
        return this.executeMCPTool(mcp, mcpTool.name, args);
      },
    });
  }

  /**
   * Convert JSON Schema to Zod schema
   */
  private jsonSchemaToZod(schema: Record<string, unknown>): z.ZodObject<Record<string, z.ZodTypeAny>> {
    const props = (schema.properties || {}) as Record<string, { type: string; description?: string }>;
    const zodProps: Record<string, z.ZodTypeAny> = {};

    for (const [key, value] of Object.entries(props)) {
      switch (value.type) {
        case "string":
          zodProps[key] = z.string().describe(value.description || key);
          break;
        case "number":
          zodProps[key] = z.number().describe(value.description || key);
          break;
        case "boolean":
          zodProps[key] = z.boolean().describe(value.description || key);
          break;
        default:
          zodProps[key] = z.string().describe(value.description || key);
      }
    }

    return z.object(zodProps);
  }

  /**
   * Execute an MCP tool call
   */
  private async executeMCPTool(
    mcp: MCPConfig,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // In production, this would make HTTP requests to the MCP endpoint
    console.log(`Executing MCP tool: ${mcp.id}/${toolName}`, args);

    // Simulated response
    return {
      success: true,
      tool: toolName,
      mcp: mcp.id,
      result: `Executed ${toolName} with args: ${JSON.stringify(args)}`,
    };
  }
}

// Export singleton instance
export const mcpRegistry = new MCPRegistry();

/**
 * Create a custom MCP from a configuration
 */
export function createCustomMCP(
  id: string,
  name: string,
  description: string,
  tools: MCPTool[],
  endpoint?: string,
  apiKey?: string
): MCPConfig {
  const config: MCPConfig = {
    id,
    name,
    description,
    endpoint,
    apiKey,
    tools,
  };

  mcpRegistry.register(config);
  return config;
}

/**
 * Get all available MCPs with their tools
 */
export function getAvailableMCPs(): Array<{
  id: string;
  name: string;
  description: string;
  toolCount: number;
}> {
  return mcpRegistry.getAll().map((mcp) => ({
    id: mcp.id,
    name: mcp.name,
    description: mcp.description,
    toolCount: mcp.tools.length,
  }));
}
