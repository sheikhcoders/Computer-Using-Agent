"use client";

import { CheckCircle2, Circle, Loader2, XCircle, Code, Search, Presentation, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task, SubTask, AgentType } from "@/lib/agents/types";

interface TaskProgressProps {
  task: Task;
  currentSubTask: SubTask | null;
  progress: number;
}

const agentIcons: Record<AgentType, typeof Code> = {
  orchestrator: Code,
  code: Code,
  research: Search,
  ppt: Presentation,
  multimodal: Image,
};

const agentColors: Record<AgentType, string> = {
  orchestrator: "text-gray-500",
  code: "text-blue-500",
  research: "text-green-500",
  ppt: "text-orange-500",
  multimodal: "text-purple-500",
};

export function TaskProgress({ task, currentSubTask, progress }: TaskProgressProps) {
  const getStatusIcon = (status: SubTask["status"], isActive: boolean) => {
    if (isActive) {
      return <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />;
    }
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              task.status === "completed" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              task.status === "in_progress" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
              task.status === "planning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
              task.status === "failed" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} aria-label={`Task progress: ${Math.round(progress)}%`} />
        </div>

        {/* Sub-tasks list */}
        {task.subTasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Sub-Tasks</h4>
            <ul className="space-y-2" role="list" aria-label="Sub-tasks">
              {task.subTasks.map((subTask) => {
                const AgentIcon = agentIcons[subTask.assignedAgent];
                const isActive = currentSubTask?.id === subTask.id;

                return (
                  <li
                    key={subTask.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                      isActive && "border-primary bg-primary/5",
                      subTask.status === "completed" && "bg-green-50 dark:bg-green-950/20"
                    )}
                  >
                    {getStatusIcon(subTask.status, isActive)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{subTask.title}</span>
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs",
                            agentColors[subTask.assignedAgent]
                          )}
                        >
                          <AgentIcon className="h-3 w-3" aria-hidden="true" />
                          {subTask.assignedAgent}
                        </span>
                      </div>
                      {subTask.description && (
                        <p className="text-sm text-muted-foreground">
                          {subTask.description}
                        </p>
                      )}
                      {subTask.error && (
                        <p className="text-sm text-destructive">{subTask.error}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Result preview */}
        {task.result && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Result</h4>
            <div className="prose prose-sm dark:prose-invert max-h-[300px] overflow-auto rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{task.result}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
