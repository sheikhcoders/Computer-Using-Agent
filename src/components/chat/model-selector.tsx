"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableModels, type ModelId } from "@/lib/ai/registry";
import { Sparkles } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: ModelId;
  onModelChange: (model: ModelId) => void;
  disabled?: boolean;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled,
}: ModelSelectorProps) {
  // Group models by provider
  const groqModels = availableModels.filter((m) => m.provider === "Groq");
  const googleModels = availableModels.filter((m) => m.provider === "Google");

  const selectedModelInfo = availableModels.find((m) => m.id === selectedModel);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="model-select" className="sr-only">
        Select AI model
      </label>
      
      <Select
        value={selectedModel}
        onValueChange={(value) => onModelChange(value as ModelId)}
        disabled={disabled}
      >
        <SelectTrigger
          id="model-select"
          className="w-[280px]"
          aria-label="Select AI model"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="Select a model…" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {/* Groq Models */}
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <span className="font-semibold">Groq</span>
              <span className="text-xs text-muted-foreground">(Fast inference)</span>
            </SelectLabel>
            {groqModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>

          {/* Google Models */}
          <SelectGroup>
            <SelectLabel className="flex items-center gap-2">
              <span className="font-semibold">Google</span>
              <span className="text-xs text-muted-foreground">(Gemini)</span>
            </SelectLabel>
            {googleModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Model info badge */}
      {selectedModelInfo && (
        <span className="hidden text-xs text-muted-foreground sm:inline-block">
          {selectedModelInfo.free && "Free tier"}
        </span>
      )}
    </div>
  );
}
