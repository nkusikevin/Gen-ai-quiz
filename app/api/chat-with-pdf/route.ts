import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File
    const provider = formData.get("provider") as string
    const model = formData.get("model") as string
    const apiKey = formData.get("apiKey") as string | null
    const message = formData.get("message") as string
    const contextString = formData.get("context") as string
    const context = contextString ? JSON.parse(contextString) : []

    if (!file || file.type !== "application/pdf") {
      return Response.json({ error: "Please provide a valid PDF file" }, { status: 400 })
    }

    if (!message) {
      return Response.json({ error: "Please provide a message" }, { status: 400 })
    }

    // Require user-provided API key
    if (!apiKey) {
      return Response.json({ error: "API key is required. Please add your API key in settings." }, { status: 400 })
    }

    // Validate provider and model
    if (!provider || !model) {
      return Response.json({ error: "Provider and model are required." }, { status: 400 })
    }

    let result

    if (provider === "claude") {
      // Create a custom Anthropic client with user's API key
      const anthropicClient = createAnthropic({
        apiKey: apiKey,
      })

      // Convert context to Anthropic message format
      const messages = context.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))

      result = await generateText({
        model: anthropicClient("claude-3-5-sonnet-20241022"),
        messages: [
          ...messages,
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `I have uploaded a PDF document. Please answer the following question about it: ${message}`,
              },
              {
                type: "file",
                data: await file.arrayBuffer(),
                mimeType: "application/pdf",
              },
            ],
          },
        ],
        maxTokens: 4000,
      })
    } else if (provider === "openai") {
      // Use OpenAI with user's API key
      const openaiClient = createOpenAI({
        apiKey: apiKey,
      })

      // Convert context to OpenAI message format
      const messages = context.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))

      result = await generateText({
        model: openaiClient("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that answers questions about PDF documents.",
          },
          ...messages,
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `I have uploaded a PDF document. Please answer the following question about it: ${message}`,
              },
              {
                type: "file",
                data: await file.arrayBuffer(),
                mimeType: "application/pdf",
              },
            ],
          },
        ],
        maxTokens: 4000,
      })
    } else {
      return Response.json({ error: "Unsupported provider. Please use 'claude' or 'openai'." }, { status: 400 })
    }

    return Response.json({ response: result.text })
  } catch (error) {
    console.error("Error chatting with PDF:", error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }

    return Response.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

