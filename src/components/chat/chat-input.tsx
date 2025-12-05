"use client";

import { useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onStop: () => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onKeyDown,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // SHOULD: Autofocus on desktop when there's a single primary input
  useEffect(() => {
    // Only autofocus on desktop to avoid mobile keyboard issues
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="relative flex items-end gap-2">
        {/* 
          MUST: Hydration-safe inputs (no lost focus/value)
          NEVER: Block paste in input/textarea
          MUST: autocomplete + meaningful name; correct type and inputmode
        */}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything…"
          className="min-h-[52px] max-h-[200px] resize-none pr-12"
          rows={1}
          name="message"
          autoComplete="off"
          // SHOULD: Disable spellcheck for code-heavy input
          // But keep enabled for natural language
          aria-label="Message input"
          aria-describedby="input-hint"
        />

        {/* Submit/Stop button */}
        <div className="absolute bottom-2 right-2">
          <TooltipProvider delayDuration={300}>
            {isLoading ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={onStop}
                    aria-label="Stop generating"
                    className="h-8 w-8"
                  >
                    <Square className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stop generating</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="h-8 w-8"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Send message{" "}
                    <kbd className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">
                      ⌘↵
                    </kbd>
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>

      {/* Keyboard hint - accessible but visually subtle */}
      <p id="input-hint" className="sr-only">
        Press Command or Control plus Enter to send your message
      </p>
    </form>
  );
}
