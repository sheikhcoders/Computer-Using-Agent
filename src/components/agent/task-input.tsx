"use client";

import { useState } from "react";
import { Send, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskInputProps {
  onSubmit: (title: string, description: string) => void;
  onPreview?: (title: string, description: string) => void;
  isLoading?: boolean;
}

export function TaskInput({ onSubmit, onPreview, isLoading }: TaskInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isLoading) return;
    onSubmit(title.trim(), description.trim());
  };

  const handlePreview = () => {
    if (!title.trim() || !description.trim() || isLoading) return;
    onPreview?.(title.trim(), description.trim());
  };

  const examples = [
    {
      title: "Build a SaaS Landing Page",
      description: "Create a modern landing page for a SaaS product with hero section, features, pricing, testimonials, and a contact form. Use Next.js, Tailwind CSS, and shadcn/ui.",
    },
    {
      title: "Research AI Agent Frameworks",
      description: "Research and compare the top 5 AI agent frameworks in 2024. Include features, pros/cons, pricing, and provide a recommendation with charts.",
    },
    {
      title: "Create Investor Pitch Deck",
      description: "Create a 10-slide pitch deck for a fintech startup. Include problem, solution, market size, business model, traction, team, and funding ask.",
    },
  ];

  const selectExample = (example: { title: string; description: string }) => {
    setTitle(example.title);
    setDescription(example.description);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          New Agent Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build a SaaS Dashboard"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to accomplish in detail. The more context you provide, the better the agent can help you..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || isLoading}
              loading={isLoading}
            >
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Start Task
            </Button>
            {onPreview && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                disabled={!title.trim() || !description.trim() || isLoading}
              >
                <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                Preview Plan
              </Button>
            )}
          </div>
        </form>

        {/* Example tasks */}
        <div className="mt-6 border-t pt-4">
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Try an example:
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {examples.map((example) => (
              <button
                key={example.title}
                type="button"
                onClick={() => selectExample(example)}
                className="rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent"
                disabled={isLoading}
              >
                <p className="font-medium">{example.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {example.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
