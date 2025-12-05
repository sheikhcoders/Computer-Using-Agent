/**
 * Multi-Agent Orchestrator
 * 
 * Coordinates multiple specialized agents to complete complex tasks:
 * 1. Analyzes incoming tasks
 * 2. Decomposes into sub-tasks
 * 3. Routes to appropriate agents
 * 4. Aggregates results
 */

import { generateText, generateObject, streamText, tool } from "ai";
import { z } from "zod";
import { registry } from "@/lib/ai/registry";
import { agentConfigs, getAgentConfig } from "./config";
import type {
  Task,
  SubTask,
  AgentType,
  AgentContext,
  AgentResponse,
  Artifact,
} from "./types";

/**
 * Task decomposition schema
 */
const taskDecompositionSchema = z.object({
  analysis: z.string().describe("Analysis of the task requirements"),
  subTasks: z.array(
    z.object({
      title: z.string().describe("Brief title for the sub-task"),
      description: z.string().describe("Detailed description of what needs to be done"),
      assignedAgent: z.enum(["code", "research", "ppt", "multimodal"]).describe("Which agent should handle this"),
      priority: z.number().min(1).max(5).describe("Priority 1-5, 1 being highest"),
      dependencies: z.array(z.string()).describe("Titles of tasks that must complete first"),
    })
  ),
  executionPlan: z.string().describe("Step-by-step execution plan"),
});

/**
 * Orchestrator system prompt
 */
const orchestratorPrompt = `You are the Task Orchestrator for a multi-agent system. Your role is to:

1. ANALYZE complex tasks and understand requirements
2. DECOMPOSE tasks into smaller, actionable sub-tasks
3. ASSIGN each sub-task to the most appropriate specialized agent
4. COORDINATE execution order based on dependencies
5. AGGREGATE results into a cohesive final output

## Available Agents:

### Code Agent
- Full-stack web development (Next.js, React, APIs)
- Authentication (NextAuth, OAuth, JWT)
- Database integration (Prisma, PostgreSQL)
- Payment integration (Stripe)
- End-to-end testing (Playwright, Jest)

### Research Agent  
- Web search and information gathering
- Deep analysis and insights
- Browser automation for data extraction
- Chart and visualization generation
- Report compilation

### PPT Agent
- Professional presentation creation
- Beautiful flexible layouts
- Data visualization in slides
- PPTX export with high fidelity

### Multimodal Agent
- Image analysis and generation
- Audio transcription and synthesis
- Video content analysis
- OCR and document processing

## Guidelines:
- Break complex tasks into 3-7 sub-tasks
- Identify clear dependencies between tasks
- Prioritize foundational work first
- Consider parallel execution where possible
- Each sub-task should be completable in one agent session
`;

/**
 * Decompose a complex task into sub-tasks
 */
export async function decomposeTask(task: Task): Promise<SubTask[]> {
  const config = agentConfigs.orchestrator;
  const model = registry.languageModel(config.model);

  const result = await generateObject({
    model,
    schema: taskDecompositionSchema,
    system: orchestratorPrompt,
    prompt: `Analyze and decompose this task:

Title: ${task.title}
Description: ${task.description}

Provide a detailed breakdown of sub-tasks with agent assignments.`,
    temperature: config.temperature,
  });

  // Convert to SubTask objects with IDs
  const subTasks: SubTask[] = result.object.subTasks.map((st, index) => ({
    id: `${task.id}-sub-${index + 1}`,
    parentId: task.id,
    title: st.title,
    description: st.description,
    assignedAgent: st.assignedAgent as AgentType,
    status: "pending",
    priority: st.priority,
    dependencies: st.dependencies,
    createdAt: new Date(),
  }));

  // Sort by priority and dependencies
  return sortSubTasks(subTasks);
}

/**
 * Sort sub-tasks by dependencies and priority
 */
function sortSubTasks(subTasks: SubTask[]): SubTask[] {
  const sorted: SubTask[] = [];
  const remaining = [...subTasks];
  const completed = new Set<string>();

  while (remaining.length > 0) {
    // Find tasks with all dependencies satisfied
    const ready = remaining.filter((task) =>
      task.dependencies.every(
        (dep) =>
          completed.has(dep) ||
          !subTasks.some((t) => t.title === dep)
      )
    );

    if (ready.length === 0 && remaining.length > 0) {
      // Circular dependency or missing dependency, add remaining
      sorted.push(...remaining.sort((a, b) => a.priority - b.priority));
      break;
    }

    // Sort ready tasks by priority
    ready.sort((a, b) => a.priority - b.priority);

    for (const task of ready) {
      sorted.push(task);
      completed.add(task.title);
      const index = remaining.findIndex((t) => t.id === task.id);
      if (index !== -1) remaining.splice(index, 1);
    }
  }

  return sorted;
}

/**
 * Route a sub-task to the appropriate agent
 */
export async function routeToAgent(
  subTask: SubTask,
  context: AgentContext
): Promise<AgentResponse> {
  const agentConfig = getAgentConfig(subTask.assignedAgent);
  if (!agentConfig) {
    throw new Error(`Unknown agent type: ${subTask.assignedAgent}`);
  }

  // Import and execute the appropriate agent
  switch (subTask.assignedAgent) {
    case "code":
      const { executeCodeAgent } = await import("./code-agent");
      return executeCodeAgent(subTask, context);
    case "research":
      const { executeResearchAgent } = await import("./research-agent");
      return executeResearchAgent(subTask, context);
    case "ppt":
      const { executePPTAgent } = await import("./ppt-agent");
      return executePPTAgent(subTask, context);
    case "multimodal":
      const { executeMultimodalAgent } = await import("./multimodal-agent");
      return executeMultimodalAgent(subTask, context);
    default:
      throw new Error(`No handler for agent: ${subTask.assignedAgent}`);
  }
}

/**
 * Aggregate results from multiple agents
 */
export async function aggregateResults(
  task: Task,
  subTaskResults: Map<string, AgentResponse>
): Promise<string> {
  const config = agentConfigs.orchestrator;
  const model = registry.languageModel(config.model);

  // Compile all results
  const resultsText = Array.from(subTaskResults.entries())
    .map(([taskId, response]) => {
      const subTask = task.subTasks.find((t) => t.id === taskId);
      return `## ${subTask?.title || taskId}\n${response.message}`;
    })
    .join("\n\n");

  const result = await generateText({
    model,
    system: `You are synthesizing results from multiple specialized agents into a cohesive final response.
Provide a clear, well-organized summary that addresses the original task.`,
    prompt: `Original Task: ${task.title}\n${task.description}\n\n---\n\nAgent Results:\n\n${resultsText}\n\n---\n\nProvide a comprehensive final response that synthesizes all agent outputs.`,
    temperature: 0.3,
  });

  return result.text;
}

/**
 * Execute a complete task through the multi-agent system
 */
export async function executeTask(
  task: Task,
  onProgress?: (update: { subTask: SubTask; status: string }) => void
): Promise<Task> {
  // Phase 1: Decompose task
  task.status = "planning";
  task.subTasks = await decomposeTask(task);
  task.updatedAt = new Date();

  // Phase 2: Execute sub-tasks
  task.status = "in_progress";
  const results = new Map<string, AgentResponse>();
  const context: AgentContext = {
    taskId: task.id,
    messages: task.messages,
    previousResults: new Map(),
    artifacts: [],
  };

  for (const subTask of task.subTasks) {
    try {
      // Check dependencies
      const dependenciesMet = subTask.dependencies.every((dep) => {
        const depTask = task.subTasks.find((t) => t.title === dep);
        return depTask?.status === "completed";
      });

      if (!dependenciesMet) {
        subTask.status = "failed";
        subTask.error = "Dependencies not met";
        continue;
      }

      // Execute
      subTask.status = "in_progress";
      onProgress?.({ subTask, status: "started" });

      const response = await routeToAgent(subTask, {
        ...context,
        subTaskId: subTask.id,
      });

      // Store result
      results.set(subTask.id, response);
      context.previousResults.set(subTask.id, response.message);
      if (response.artifacts) {
        context.artifacts.push(...response.artifacts);
      }

      subTask.status = "completed";
      subTask.result = response.message;
      subTask.completedAt = new Date();
      onProgress?.({ subTask, status: "completed" });
    } catch (error) {
      subTask.status = "failed";
      subTask.error = error instanceof Error ? error.message : "Unknown error";
      onProgress?.({ subTask, status: "failed" });
    }
  }

  // Phase 3: Aggregate results
  task.result = await aggregateResults(task, results);
  task.status = "completed";
  task.updatedAt = new Date();

  return task;
}
