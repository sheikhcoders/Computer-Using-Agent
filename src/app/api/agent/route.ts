/**
 * Multi-Agent API Route
 * 
 * Handles complex tasks through the multi-agent orchestration system:
 * 1. Receives task description
 * 2. Decomposes into sub-tasks
 * 3. Routes to specialized agents
 * 4. Streams progress and results
 */

import { NextRequest } from "next/server";
import { executeTask, decomposeTask } from "@/lib/agents/orchestrator";
import type { Task } from "@/lib/agents/types";

// Allow long-running agent tasks
export const maxDuration = 120; // 2 minutes

/**
 * POST /api/agent
 * Execute a complex task through the multi-agent system
 */
export async function POST(req: NextRequest) {
  try {
    const { title, description, stream = true } = await req.json();

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create task
    const task: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      status: "pending",
      subTasks: [],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (stream) {
      // Stream progress using SSE
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const send = (data: Record<string, unknown>) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          };

          try {
            // Send initial task
            send({ type: "task_created", task: { id: task.id, title, status: "pending" } });

            // Execute with progress callback
            const result = await executeTask(task, ({ subTask, status }) => {
              send({
                type: "subtask_update",
                subTask: {
                  id: subTask.id,
                  title: subTask.title,
                  agent: subTask.assignedAgent,
                  status,
                },
              });
            });

            // Send final result
            send({
              type: "task_complete",
              task: {
                id: result.id,
                status: result.status,
                result: result.result,
                subTasks: result.subTasks.map((st) => ({
                  id: st.id,
                  title: st.title,
                  agent: st.assignedAgent,
                  status: st.status,
                  result: st.result,
                })),
              },
            });

            controller.close();
          } catch (error) {
            send({
              type: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            });
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      // Non-streaming response
      const result = await executeTask(task);

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Agent API error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/agent/decompose
 * Preview task decomposition without executing
 */
export async function PUT(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Title and description are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const task: Task = {
      id: `preview-${Date.now()}`,
      title,
      description,
      status: "pending",
      subTasks: [],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const subTasks = await decomposeTask(task);

    return new Response(
      JSON.stringify({
        task: { id: task.id, title, description },
        subTasks: subTasks.map((st) => ({
          title: st.title,
          description: st.description,
          agent: st.assignedAgent,
          priority: st.priority,
          dependencies: st.dependencies,
        })),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Decompose API error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
