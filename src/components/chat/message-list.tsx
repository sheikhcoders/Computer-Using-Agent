"use client";

import type { Message } from "ai";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { RefreshCw, Square } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRetry: () => void;
  onStop: () => void;
}

export function MessageList({
  messages,
  isLoading,
  onRetry,
  onStop,
}: MessageListProps) {
  return (
    <div
      className="space-y-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div
          className="flex items-center gap-2 text-muted-foreground"
          role="status"
          aria-label="Generating response…"
        >
          <Spinner size="sm" />
          <span className="text-sm">Generating…</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onStop}
            className="ml-2"
            aria-label="Stop generating"
          >
            <Square className="mr-1 h-3 w-3" aria-hidden="true" />
            Stop
          </Button>
        </div>
      )}

      {/* Retry button on error (shown after last assistant message) */}
      {!isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "assistant" && (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Regenerate response"
            >
              <RefreshCw className="mr-1 h-3 w-3" aria-hidden="true" />
              Regenerate
            </Button>
          </div>
        )}
    </div>
  );
}
