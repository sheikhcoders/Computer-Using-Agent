"use client";

import { useState, useCallback, useRef } from "react";
import type { Task, SubTask, AgentType } from "@/lib/agents/types";

/**
 * Agent execution state
 */
export interface AgentState {
  task: Task | null;
  isRunning: boolean;
  currentSubTask: SubTask | null;
  progress: number;
  error: string | null;
}

/**
 * SSE message types from the agent API
 */
interface AgentEvent {
  type: "task_created" | "subtask_update" | "task_complete" | "error";
  task?: {
    id: string;
    title?: string;
    status: string;
    result?: string;
    subTasks?: Array<{
      id: string;
      title: string;
      agent: AgentType;
      status: string;
      result?: string;
    }>;
  };
  subTask?: {
    id: string;
    title: string;
    agent: AgentType;
    status: string;
  };
  error?: string;
}

/**
 * Hook for managing agent execution state
 */
export function useAgent() {
  const [state, setState] = useState<AgentState>({
    task: null,
    isRunning: false,
    currentSubTask: null,
    progress: 0,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Execute a task through the multi-agent system
   */
  const executeTask = useCallback(
    async (title: string, description: string) => {
      // Abort any existing execution
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState({
        task: null,
        isRunning: true,
        currentSubTask: null,
        progress: 0,
        error: null,
      });

      try {
        const response = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, stream: true }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let completedSubTasks = 0;
        let totalSubTasks = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event: AgentEvent = JSON.parse(line.slice(6));
                handleEvent(event);
              } catch {
                // Ignore parse errors
              }
            }
          }
        }

        function handleEvent(event: AgentEvent) {
          switch (event.type) {
            case "task_created":
              setState((prev) => ({
                ...prev,
                task: {
                  id: event.task!.id,
                  title: event.task!.title || title,
                  description,
                  status: "planning",
                  subTasks: [],
                  messages: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              }));
              break;

            case "subtask_update":
              if (event.subTask) {
                const subTask: SubTask = {
                  id: event.subTask.id,
                  parentId: state.task?.id || "",
                  title: event.subTask.title,
                  description: "",
                  assignedAgent: event.subTask.agent,
                  status: event.subTask.status === "completed" ? "completed" 
                    : event.subTask.status === "failed" ? "failed"
                    : "in_progress",
                  priority: 1,
                  dependencies: [],
                  createdAt: new Date(),
                };

                if (event.subTask.status === "started") {
                  setState((prev) => ({
                    ...prev,
                    currentSubTask: subTask,
                    task: prev.task ? {
                      ...prev.task,
                      subTasks: [...prev.task.subTasks.filter(st => st.id !== subTask.id), subTask],
                    } : null,
                  }));
                  totalSubTasks++;
                } else if (event.subTask.status === "completed") {
                  completedSubTasks++;
                  setState((prev) => ({
                    ...prev,
                    progress: totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0,
                    currentSubTask: null,
                    task: prev.task ? {
                      ...prev.task,
                      subTasks: prev.task.subTasks.map(st => 
                        st.id === subTask.id ? { ...st, status: "completed" as const } : st
                      ),
                    } : null,
                  }));
                }
              }
              break;

            case "task_complete":
              setState((prev) => ({
                ...prev,
                isRunning: false,
                progress: 100,
                task: prev.task ? {
                  ...prev.task,
                  status: "completed",
                  result: event.task?.result,
                  subTasks: event.task?.subTasks?.map(st => ({
                    id: st.id,
                    parentId: prev.task!.id,
                    title: st.title,
                    description: "",
                    assignedAgent: st.agent,
                    status: st.status as SubTask["status"],
                    priority: 1,
                    dependencies: [],
                    result: st.result,
                    createdAt: new Date(),
                  })) || prev.task.subTasks,
                } : null,
              }));
              break;

            case "error":
              setState((prev) => ({
                ...prev,
                isRunning: false,
                error: event.error || "An error occurred",
              }));
              break;
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setState((prev) => ({
            ...prev,
            isRunning: false,
            error: error instanceof Error ? error.message : "An error occurred",
          }));
        }
      }
    },
    [state.task?.id]
  );

  /**
   * Preview task decomposition
   */
  const previewDecomposition = useCallback(
    async (title: string, description: string) => {
      try {
        const response = await fetch("/api/agent", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        throw error;
      }
    },
    []
  );

  /**
   * Cancel the current execution
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isRunning: false,
      currentSubTask: null,
    }));
  }, []);

  /**
   * Reset the agent state
   */
  const reset = useCallback(() => {
    cancel();
    setState({
      task: null,
      isRunning: false,
      currentSubTask: null,
      progress: 0,
      error: null,
    });
  }, [cancel]);

  return {
    ...state,
    executeTask,
    previewDecomposition,
    cancel,
    reset,
  };
}
