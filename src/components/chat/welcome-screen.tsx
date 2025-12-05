"use client";

import { Bot, Zap, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by Groq's ultra-fast inference engine",
  },
  {
    icon: Shield,
    title: "100% Free",
    description: "Uses free tiers from Groq and Google Gemini",
  },
  {
    icon: Sparkles,
    title: "Multiple Models",
    description: "Choose from Llama, Gemma, Mixtral, and Gemini",
  },
];

export function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Bot className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Computer-Using Agent
        </h1>
        <p className="mb-8 text-muted-foreground">
          An AI assistant powered by free, state-of-the-art language models.
          Ask questions, get help with coding, writing, and more.
        </p>

        {/* Features grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
            >
              <feature.icon
                className="mb-2 h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <h2 className="mb-1 font-medium">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Getting started hint */}
        <p className="mt-8 text-sm text-muted-foreground">
          Type a message below to get started, or select a different model above.
        </p>
      </div>
    </div>
  );
}
