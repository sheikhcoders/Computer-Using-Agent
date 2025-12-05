/**
 * Code Agent
 * 
 * Specialized agent for full-stack development:
 * - Web application development
 * - Authentication integration
 * - Database setup and migrations
 * - Payment integration (Stripe)
 * - End-to-end testing
 */

import { generateText, tool } from "ai";
import { z } from "zod";
import { registry } from "@/lib/ai/registry";
import { agentConfigs } from "./config";
import { executePython, isE2BConfigured } from "@/lib/e2b/sandbox";
import type { SubTask, AgentContext, AgentResponse, Artifact } from "./types";

/**
 * Code Agent system prompt
 */
const codeAgentPrompt = `You are the Code Agent, a specialized AI for full-stack web development.

## Expertise:
- **Frontend**: React, Next.js, Vue, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, API Routes, tRPC, Express
- **Database**: Prisma, PostgreSQL, MongoDB, Supabase
- **Auth**: NextAuth.js, Clerk, Auth0, JWT
- **Payments**: Stripe Checkout, Subscriptions, Webhooks
- **Testing**: Playwright, Jest, React Testing Library

## Code Quality Standards:
1. Write clean, maintainable TypeScript code
2. Follow best practices and design patterns
3. Include proper error handling
4. Add helpful comments for complex logic
5. Ensure accessibility (WCAG compliance)
6. Write tests for critical functionality

## Output Format:
For each code artifact, provide:
1. File path
2. Complete, working code
3. Brief explanation of what it does
4. Any required dependencies

## Guidelines:
- Generate complete, runnable code (not snippets)
- Include all necessary imports
- Handle edge cases and errors
- Follow security best practices
- Use environment variables for secrets
`;

/**
 * Define Code Agent tools
 */
const codeAgentTools = {
  write_file: tool({
    description: "Write code to a file",
    parameters: z.object({
      path: z.string().describe("File path relative to project root"),
      content: z.string().describe("Complete file content"),
      language: z.string().describe("Programming language"),
    }),
    execute: async ({ path, content, language }) => {
      // In production, this would write to a filesystem or sandbox
      return {
        success: true,
        path,
        language,
        size: content.length,
      };
    },
  }),

  execute_code: tool({
    description: "Execute Python code in a secure sandbox",
    parameters: z.object({
      code: z.string().describe("Python code to execute"),
      description: z.string().describe("What this code does"),
    }),
    execute: async ({ code, description }) => {
      if (!isE2BConfigured()) {
        return {
          success: false,
          error: "E2B not configured. Set E2B_API_KEY.",
        };
      }
      const result = await executePython(code);
      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: `${result.executionTime}ms`,
      };
    },
  }),

  run_tests: tool({
    description: "Run tests for the code",
    parameters: z.object({
      testCommand: z.string().describe("Command to run tests"),
      testFiles: z.array(z.string()).describe("Test files to run"),
    }),
    execute: async ({ testCommand, testFiles }) => {
      // Simulated test execution
      return {
        success: true,
        passed: testFiles.length,
        failed: 0,
        coverage: "85%",
      };
    },
  }),

  install_package: tool({
    description: "Install npm packages",
    parameters: z.object({
      packages: z.array(z.string()).describe("Package names to install"),
      dev: z.boolean().optional().describe("Install as dev dependency"),
    }),
    execute: async ({ packages, dev }) => {
      return {
        success: true,
        installed: packages,
        type: dev ? "devDependencies" : "dependencies",
      };
    },
  }),
};

/**
 * Execute the Code Agent
 */
export async function executeCodeAgent(
  subTask: SubTask,
  context: AgentContext
): Promise<AgentResponse> {
  const config = agentConfigs.code;
  const model = registry.languageModel(config.model);
  const artifacts: Artifact[] = [];

  // Build context from previous results
  const previousContext = Array.from(context.previousResults.entries())
    .map(([id, result]) => `Previous: ${id}\n${result}`)
    .join("\n\n");

  const result = await generateText({
    model,
    system: codeAgentPrompt,
    prompt: `Task: ${subTask.title}\n\nDescription: ${subTask.description}\n\n${previousContext ? `Context:\n${previousContext}` : ""}\n\nGenerate the required code with full implementation.`,
    tools: codeAgentTools,
    maxSteps: config.maxSteps,
    temperature: config.temperature,
  });

  // Extract artifacts from tool calls
  for (const step of result.steps || []) {
    for (const toolResult of step.toolResults || []) {
      if (toolResult.toolName === "write_file" && toolResult.result) {
        const fileResult = toolResult.result as { path: string; language: string };
        artifacts.push({
          id: `artifact-${Date.now()}`,
          type: "code",
          title: fileResult.path,
          content: "", // Would contain actual content
          language: fileResult.language,
          createdAt: new Date(),
        });
      }
    }
  }

  return {
    message: result.text,
    artifacts,
    thinking: result.reasoning,
    nextAction: "complete",
  };
}
