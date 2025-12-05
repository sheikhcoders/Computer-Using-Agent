/**
 * Agent Configuration
 * Defines all specialized agents and their capabilities
 */

import type { AgentConfig, AgentCapability } from "./types";

/**
 * Code Agent Capabilities
 */
const codeCapabilities: AgentCapability[] = [
  {
    id: "fullstack",
    name: "Full-Stack Development",
    description: "Build complete web applications with frontend, backend, and database",
    examples: [
      "Create a Next.js app with authentication",
      "Build a REST API with database integration",
      "Implement a real-time chat application",
    ],
  },
  {
    id: "auth",
    name: "Authentication & Authorization",
    description: "Implement secure auth flows with various providers",
    examples: [
      "Add NextAuth.js with Google OAuth",
      "Implement JWT authentication",
      "Set up role-based access control",
    ],
  },
  {
    id: "database",
    name: "Database Integration",
    description: "Design schemas and integrate databases",
    examples: [
      "Set up Prisma with PostgreSQL",
      "Create database migrations",
      "Implement data models with relations",
    ],
  },
  {
    id: "testing",
    name: "End-to-End Testing",
    description: "Write comprehensive tests to ensure bug-free code",
    examples: [
      "Add Playwright e2e tests",
      "Write unit tests with Jest",
      "Create integration test suites",
    ],
  },
  {
    id: "stripe",
    name: "Payment Integration",
    description: "Integrate Stripe for payments and subscriptions",
    examples: [
      "Add Stripe checkout",
      "Implement subscription billing",
      "Set up webhook handlers",
    ],
  },
];

/**
 * Research Agent Capabilities
 */
const researchCapabilities: AgentCapability[] = [
  {
    id: "web_search",
    name: "Web Search",
    description: "Search the web for current information",
    examples: [
      "Find latest news on a topic",
      "Research market trends",
      "Gather competitive analysis",
    ],
  },
  {
    id: "deep_analysis",
    name: "Deep Analysis",
    description: "Analyze data and generate insights",
    examples: [
      "Analyze financial reports",
      "Compare product features",
      "Evaluate research papers",
    ],
  },
  {
    id: "browser_use",
    name: "Browser Automation",
    description: "Navigate and extract data from websites",
    examples: [
      "Extract data from web pages",
      "Fill out online forms",
      "Monitor website changes",
    ],
  },
  {
    id: "chart_generation",
    name: "Chart & Visualization",
    description: "Generate charts and data visualizations",
    examples: [
      "Create comparison charts",
      "Generate trend graphs",
      "Build interactive dashboards",
    ],
  },
];

/**
 * PPT Agent Capabilities
 */
const pptCapabilities: AgentCapability[] = [
  {
    id: "presentation",
    name: "Presentation Creation",
    description: "Create beautiful, professional presentations",
    examples: [
      "Create a pitch deck",
      "Build a product demo presentation",
      "Design a training course",
    ],
  },
  {
    id: "layout",
    name: "Flexible Layouts",
    description: "Design stunning layouts beyond templates",
    examples: [
      "Multi-column layouts",
      "Timeline visualizations",
      "Comparison matrices",
    ],
  },
  {
    id: "export",
    name: "PPTX Export",
    description: "Export high-quality PowerPoint files",
    examples: [
      "Export to PPTX format",
      "Maintain formatting fidelity",
      "Include animations",
    ],
  },
];

/**
 * Multimodal Agent Capabilities
 */
const multimodalCapabilities: AgentCapability[] = [
  {
    id: "image_understanding",
    name: "Image Understanding",
    description: "Analyze and understand images",
    examples: [
      "Describe image contents",
      "Extract text from images (OCR)",
      "Analyze charts and diagrams",
    ],
  },
  {
    id: "image_generation",
    name: "Image Generation",
    description: "Generate images from descriptions",
    examples: [
      "Create illustrations",
      "Generate UI mockups",
      "Design logos",
    ],
  },
  {
    id: "audio_processing",
    name: "Audio Processing",
    description: "Transcribe and generate audio",
    examples: [
      "Transcribe meetings",
      "Generate voiceovers",
      "Create podcast summaries",
    ],
  },
  {
    id: "video_analysis",
    name: "Video Analysis",
    description: "Analyze and process video content",
    examples: [
      "Summarize video content",
      "Extract key frames",
      "Generate video transcripts",
    ],
  },
];

/**
 * Agent configurations
 */
export const agentConfigs: Record<string, AgentConfig> = {
  orchestrator: {
    type: "orchestrator",
    name: "Task Orchestrator",
    description: "Routes complex tasks to specialized agents and coordinates execution",
    model: "google:gemini-2.5-flash",
    capabilities: [],
    maxSteps: 20,
    temperature: 0.3,
    tools: ["task_decompose", "delegate_task", "aggregate_results"],
  },
  code: {
    type: "code",
    name: "Code Agent",
    description: "Full-stack development with auth, database, testing, and payments",
    model: "google:gemini-2.5-flash",
    capabilities: codeCapabilities,
    maxSteps: 15,
    temperature: 0.2,
    tools: [
      "execute_code",
      "write_file",
      "read_file",
      "run_tests",
      "deploy_preview",
    ],
  },
  research: {
    type: "research",
    name: "Research Agent",
    description: "Deep research with search, analysis, and visualization",
    model: "google:gemini-2.5-flash",
    capabilities: researchCapabilities,
    maxSteps: 15,
    temperature: 0.4,
    tools: [
      "web_search",
      "browse_url",
      "extract_content",
      "generate_chart",
      "analyze_data",
    ],
  },
  ppt: {
    type: "ppt",
    name: "PPT Agent",
    description: "Create beautiful presentations with flexible layouts",
    model: "google:gemini-2.5-flash",
    capabilities: pptCapabilities,
    maxSteps: 10,
    temperature: 0.5,
    tools: [
      "create_slide",
      "add_chart",
      "add_image",
      "export_pptx",
    ],
  },
  multimodal: {
    type: "multimodal",
    name: "Multimodal Agent",
    description: "Process and generate images, audio, and video",
    model: "google:gemini-2.5-flash",
    capabilities: multimodalCapabilities,
    maxSteps: 10,
    temperature: 0.6,
    tools: [
      "analyze_image",
      "generate_image",
      "transcribe_audio",
      "generate_audio",
      "analyze_video",
    ],
  },
};

/**
 * Get agent config by type
 */
export function getAgentConfig(type: string): AgentConfig | undefined {
  return agentConfigs[type];
}

/**
 * Get all agent types
 */
export function getAgentTypes(): string[] {
  return Object.keys(agentConfigs);
}
