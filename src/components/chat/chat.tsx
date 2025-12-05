"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ModelSelector } from "./model-selector";
import { WelcomeScreen } from "./welcome-screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/toaster";
import type { ModelId } from "@/lib/ai/registry";

export function Chat() {
  const [selectedModel, setSelectedModel] = useState<ModelId>(
    "groq:llama-3.3-70b-versatile"
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      // MUST: Use polite aria-live for toasts
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom on new messages
  // MUST: Back/Forward restores scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle form submission
  // MUST: Keep submit enabled until request starts; then disable
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      handleSubmit(e);
    },
    [input, isLoading, handleSubmit]
  );

  // Handle keyboard shortcuts
  // MUST: ⌘/Ctrl+Enter submits in textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (form) {
          form.requestSubmit();
        }
      }
    },
    []
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      {/* Model selector - always visible */}
      <div className="border-b bg-background/95 px-4 py-2">
        <div className="mx-auto max-w-3xl">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {hasMessages ? (
          <ScrollArea
            ref={scrollRef}
            className="flex-1 px-4"
            // MUST: Intentional overscroll-behavior: contain
          >
            <div className="mx-auto max-w-3xl py-4">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onRetry={reload}
                onStop={stop}
              />
            </div>
          </ScrollArea>
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Input area - sticky at bottom */}
      <div className="border-t bg-background/95 px-4 py-4 safe-area-inset">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={onSubmit}
            onKeyDown={handleKeyDown}
            onStop={stop}
          />
          {/* Error display */}
          {error && (
            <p
              className="mt-2 text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {error.message || "An error occurred. Please try again."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
