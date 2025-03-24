"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, ArrowLeft, Key, Shield, Info, Eye, EyeOff, CheckCircle, X, Sparkles, Brain } from "lucide-react"
import { useLLMSettings } from "@/hooks/use-llm-settings"
import { useToast } from "@/components/ui/toast-context"
import { ModelSelector } from "@/components/model-selector"

export default function SettingsPage() {
  const { settings, updateSettings, setClaudeApiKey, setOpenAIApiKey, isLoaded } = useLLMSettings()
  const [claudeInputKey, setClaudeInputKey] = useState("")
  const [openaiInputKey, setOpenaiInputKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)
  const { addToast } = useToast()

  const handleSaveClaudeKey = () => {
    // Basic validation
    if (!claudeInputKey.trim()) {
      addToast({
        message: "API Key Required",
        description: "Please enter an API key",
        variant: "error",
        position: "top-center",
      })
      return
    }

    // Check if it looks like a Claude API key (starts with sk-ant-)
    if (!claudeInputKey.startsWith("sk-ant-")) {
      addToast({
        message: "Invalid API Key Format",
        description: "This doesn't look like a valid Claude API key. It should start with 'sk-ant-'",
        variant: "error",
        position: "top-center",
      })
      return
    }

    // Save the key
    setClaudeApiKey(claudeInputKey)
    setClaudeInputKey("")

    addToast({
      message: "Claude API Key Saved",
      description: "Your Claude API key has been securely stored in your browser.",
      variant: "success",
      position: "bottom-right",
    })
  }

  const handleSaveOpenAIKey = () => {
    // Basic validation
    if (!openaiInputKey.trim()) {
      addToast({
        message: "API Key Required",
        description: "Please enter an API key",
        variant: "error",
        position: "top-center",
      })
      return
    }

    // Check if it looks like an OpenAI API key (starts with sk-)
    if (!openaiInputKey.startsWith("sk-")) {
      addToast({
        message: "Invalid API Key Format",
        description: "This doesn't look like a valid OpenAI API key. It should start with 'sk-'",
        variant: "error",
        position: "top-center",
      })
      return
    }

    // Save the key
    setOpenAIApiKey(openaiInputKey)
    setOpenaiInputKey("")

    addToast({
      message: "OpenAI API Key Saved",
      description: "Your OpenAI API key has been securely stored in your browser.",
      variant: "success",
      position: "bottom-right",
    })
  }

  const handleClearClaudeKey = () => {
    setClaudeApiKey(null)
    setClaudeInputKey("")

    addToast({
      message: "Claude API Key Removed",
      description: "Your Claude API key has been removed from storage.",
      variant: "info",
      position: "bottom-right",
    })
  }

  const handleClearOpenAIKey = () => {
    setOpenAIApiKey(null)
    setOpenaiInputKey("")

    addToast({
      message: "OpenAI API Key Removed",
      description: "Your OpenAI API key has been removed from storage.",
      variant: "info",
      position: "bottom-right",
    })
  }

  // Mask the API key for display
  const maskApiKey = (key: string) => {
    if (!key) return ""
    const prefix = key.substring(0, 7) // First 7 characters
    const suffix = key.substring(key.length - 4) // Last 4 characters
    return `${prefix}...${suffix}`
  }

  const handleProviderChange = (provider: "claude" | "openai") => {
    updateSettings({ provider })

    // Set default model based on provider
    if (provider === "claude") {
      updateSettings({ model: "claude-3-5-sonnet" })
    } else {
      updateSettings({ model: "gpt-4o-mini" })
    }

    addToast({
      message: `Switched to ${provider === "claude" ? "Claude" : "OpenAI"}`,
      description: `Now using ${provider === "claude" ? "Claude 3.5 Sonnet" : "GPT-4o-mini"} as your default model.`,
      variant: "info",
      position: "bottom-right",
    })
  }

  const handleModelChange = (model: "claude-3-5-sonnet" | "gpt-4o-mini") => {
    updateSettings({ model })

    addToast({
      message: "Model Updated",
      description: `Now using ${model === "claude-3-5-sonnet" ? "Claude 3.5 Sonnet" : "GPT-4o-mini"}.`,
      variant: "info",
      position: "bottom-right",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium tracking-wide">PDF Quiz</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-light tracking-tight mb-8 animate-fade-in">Settings</h1>

          <Card className="animate-fade-up mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Model Selection
              </CardTitle>
              <CardDescription>Choose which AI model to use for generating quiz questions</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelSelector
                provider={settings.provider}
                model={settings.model}
                onProviderChange={handleProviderChange}
                onModelChange={handleModelChange}
              />

              <div className="mt-6 p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
                <p className="font-medium mb-2">About the models:</p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <Brain className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                    <span>
                      <strong>Claude 3.5 Sonnet</strong>: Anthropic's powerful model with excellent comprehension and
                      reasoning abilities.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                    <span>
                      <strong>GPT-4o-mini</strong>: OpenAI's efficient model that balances performance and speed.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="claude" className="animate-fade-up">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="claude" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Claude API Key
              </TabsTrigger>
              <TabsTrigger value="openai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                OpenAI API Key
              </TabsTrigger>
            </TabsList>

            <TabsContent value="claude">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    Claude API Key
                  </CardTitle>
                  <CardDescription>Add your Claude API key to use Anthropic's models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoaded && settings.claudeApiKey && (
                    <div className="p-4 bg-muted/50 rounded-md border animate-fade-in">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">API Key Set</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearClaudeKey}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="bg-background px-2 py-1 rounded text-sm">
                          {showKey ? settings.claudeApiKey : maskApiKey(settings.claudeApiKey || "")}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)} className="h-6 w-6">
                          {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="claude-api-key">Enter Claude API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="claude-api-key"
                        type={showKey ? "text" : "password"}
                        placeholder="sk-ant-..."
                        value={claudeInputKey}
                        onChange={(e) => setClaudeInputKey(e.target.value)}
                        autoComplete="off"
                      />
                      <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
                    <p className="font-medium mb-2">How to get a Claude API key:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        Go to{" "}
                        <a
                          href="https://console.anthropic.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          console.anthropic.com
                        </a>
                      </li>
                      <li>Create an account or sign in</li>
                      <li>Navigate to the API Keys section</li>
                      <li>Create a new API key</li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveClaudeKey} className="transition-transform hover:translate-y-[-2px]">
                    Save Claude API Key
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="openai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    OpenAI API Key
                  </CardTitle>
                  <CardDescription>Add your OpenAI API key to use GPT models</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoaded && settings.openaiApiKey && (
                    <div className="p-4 bg-muted/50 rounded-md border animate-fade-in">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium">API Key Set</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearOpenAIKey}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <code className="bg-background px-2 py-1 rounded text-sm">
                          {showKey ? settings.openaiApiKey : maskApiKey(settings.openaiApiKey || "")}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)} className="h-6 w-6">
                          {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="openai-api-key">Enter OpenAI API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="openai-api-key"
                        type={showKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={openaiInputKey}
                        onChange={(e) => setOpenaiInputKey(e.target.value)}
                        autoComplete="off"
                      />
                      <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-md text-sm text-muted-foreground">
                    <p className="font-medium mb-2">How to get an OpenAI API key:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>
                        Go to{" "}
                        <a
                          href="https://platform.openai.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          platform.openai.com
                        </a>
                      </li>
                      <li>Create an account or sign in</li>
                      <li>Navigate to the API Keys section</li>
                      <li>Create a new API key</li>
                    </ol>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveOpenAIKey} className="transition-transform hover:translate-y-[-2px]">
                    Save OpenAI API Key
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-muted/50 rounded-md border animate-fade-up">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" />
                Security Information
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                className="h-6 text-xs flex items-center gap-1 -mt-1"
              >
                {showSecurityInfo ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Your API keys are stored locally with basic encryption and never sent to our servers.
            </p>

            {showSecurityInfo && (
              <div className="mt-4 border-t pt-4 border-muted-foreground/20">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>API keys are only used for direct API calls to the respective services.</span>
                  </li>
                  <li className="flex gap-2">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>For maximum security, consider removing your API keys after using the application.</span>
                  </li>
                  <li className="flex gap-2">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Never share your API keys or use this application on shared or public computers.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDF Quiz Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

