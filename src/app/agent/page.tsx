"use client";

import { useAgent } from "@/hooks/use-agent";
import { TaskInput } from "@/components/agent/task-input";
import { TaskProgress } from "@/components/agent/task-progress";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function AgentPage() {
  const {
    task,
    isRunning,
    currentSubTask,
    progress,
    error,
    executeTask,
    reset,
  } = useAgent();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="flex-1 px-4 py-8 safe-area-inset"
        role="main"
        aria-label="Multi-Agent Task Execution"
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Page title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Multi-Agent System</h1>
            <p className="mt-2 text-muted-foreground">
              Describe a complex task and let specialized AI agents work together to complete it.
            </p>
          </div>

          {/* Show input or progress based on state */}
          {!task ? (
            <TaskInput
              onSubmit={executeTask}
              isLoading={isRunning}
            />
          ) : (
            <div className="space-y-4">
              <TaskProgress
                task={task}
                currentSubTask={currentSubTask}
                progress={progress}
              />

              {/* Actions */}
              {!isRunning && (
                <div className="flex justify-center">
                  <Button onClick={reset} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                    New Task
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div
              className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive"
              role="alert"
            >
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Agent capabilities info */}
          {!task && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Code Agent",
                  description: "Full-stack development with auth, database, and testing",
                  color: "text-blue-500",
                },
                {
                  title: "Research Agent",
                  description: "Deep research with search, analysis, and charts",
                  color: "text-green-500",
                },
                {
                  title: "PPT Agent",
                  description: "Beautiful presentations with flexible layouts",
                  color: "text-orange-500",
                },
                {
                  title: "Multimodal Agent",
                  description: "Process and generate images, audio, and video",
                  color: "text-purple-500",
                },
              ].map((agent) => (
                <div
                  key={agent.title}
                  className="rounded-lg border bg-card p-4 text-card-foreground"
                >
                  <h3 className={`font-medium ${agent.color}`}>{agent.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
