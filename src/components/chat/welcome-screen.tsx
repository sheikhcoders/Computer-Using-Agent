"use client";

import { Bot, Zap, Shield, Sparkles, MousePointer2, Eye, Brain } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Perception",
    description: "Understands screen content and UI elements",
  },
  {
    icon: Brain,
    title: "Reasoning",
    description: "Plans multi-step tasks with chain-of-thought",
  },
  {
    icon: MousePointer2,
    title: "Action",
    description: "Guides clicking, typing, and scrolling",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Powered by Groq's ultra-fast inference",
  },
  {
    icon: Shield,
    title: "100% Free",
    description: "Uses free tiers from Groq and Gemini",
  },
  {
    icon: Sparkles,
    title: "Multiple Models",
    description: "Choose from Llama, Gemma, and Gemini",
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
          An AI agent that interacts with GUIs by perceiving screen content,
          reasoning about tasks, and performing actions through natural language.
        </p>

        {/* How CUA Works */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            How CUA Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <feature.icon
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-1 font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
            >
              <benefit.icon
                className="mb-2 h-5 w-5 text-primary"
                aria-hidden="true"
              />
              <h3 className="mb-1 font-medium">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Getting started hint */}
        <p className="mt-8 text-sm text-muted-foreground">
          Describe a task you want help with, or ask about automating workflows.
        </p>
      </div>
    </div>
  );
}
