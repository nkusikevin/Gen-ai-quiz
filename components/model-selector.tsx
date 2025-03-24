"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Brain, Sparkles, Zap, Cpu } from "lucide-react"
import type { LLMModel, LLMProvider } from "@/hooks/use-llm-settings"

interface ModelSelectorProps {
  provider: LLMProvider
  model: LLMModel
  onProviderChange: (provider: LLMProvider) => void
  onModelChange: (model: LLMModel) => void
  disabled?: boolean
}

export function ModelSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Select AI Provider</h3>
        <RadioGroup
          value={provider}
          onValueChange={(value) => onProviderChange(value as LLMProvider)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          disabled={disabled}
        >
          <div>
            <RadioGroupItem value="claude" id="claude" className="peer sr-only" disabled={disabled} />
            <Label
              htmlFor="claude"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Brain className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">Claude</p>
                <p className="text-xs text-muted-foreground">Anthropic</p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="openai" id="openai" className="peer sr-only" disabled={disabled} />
            <Label
              htmlFor="openai"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="mb-3 h-6 w-6" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium leading-none">OpenAI</p>
                <p className="text-xs text-muted-foreground">GPT Models</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Select Model</h3>
        {provider === "claude" ? (
          <RadioGroup
            value={model}
            onValueChange={(value) => onModelChange(value as LLMModel)}
            className="grid grid-cols-1 gap-2"
            disabled={disabled}
          >
            <div>
              <RadioGroupItem
                value="claude-3-5-sonnet"
                id="claude-3-5-sonnet"
                className="peer sr-only"
                disabled={disabled}
              />
              <Label
                htmlFor="claude-3-5-sonnet"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium leading-none">Claude 3.5 Sonnet</p>
                    <p className="text-xs text-muted-foreground mt-1">Powerful model for complex tasks</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        ) : (
          <RadioGroup
            value={model}
            onValueChange={(value) => onModelChange(value as LLMModel)}
            className="grid grid-cols-1 gap-2"
            disabled={disabled}
          >
            <div>
              <RadioGroupItem value="gpt-4o-mini" id="gpt-4o-mini" className="peer sr-only" disabled={disabled} />
              <Label
                htmlFor="gpt-4o-mini"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium leading-none">GPT-4o-mini</p>
                    <p className="text-xs text-muted-foreground mt-1">Efficient model with good performance</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  )
}

