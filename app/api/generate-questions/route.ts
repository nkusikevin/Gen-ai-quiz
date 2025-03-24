import { generateObject } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File
    const provider = formData.get("provider") as string
    const model = formData.get("model") as string
    const apiKey = formData.get("apiKey") as string | null

    if (!file || file.type !== "application/pdf") {
      return Response.json({ error: "Please provide a valid PDF file" }, { status: 400 })
    }

    // Require user-provided API key
    if (!apiKey) {
      return Response.json({ error: "API key is required. Please add your API key in settings." }, { status: 400 })
    }

    // Validate provider and model
    if (!provider || !model) {
      return Response.json({ error: "Provider and model are required." }, { status: 400 })
    }

    // Schema for quiz questions
    const questionsSchema = z.object({
      questions: z
        .array(
          z.object({
            question: z.string().describe("The question text"),
            options: z.array(z.string()).describe("Array of 4 possible answers"),
            correctAnswer: z.string().describe("The correct answer (must be one of the options)"),
          }),
        )
        .length(5)
        .describe("Array of 5 quiz questions"),
    })

    let result

    if (provider === "claude") {
      // Create a custom Anthropic client with user's API key
      const anthropicClient = createAnthropic({
        apiKey: apiKey,
      })

      result = await generateObject({
        model: anthropicClient("claude-3-5-sonnet"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Generate 5 multiple-choice quiz questions based on the content of this PDF. Each question should have 4 options with exactly one correct answer. Make the questions challenging but fair, covering key concepts from the document.",
              },
              {
                type: "file",
                data: await file.arrayBuffer(),
                mimeType: "application/pdf",
              },
            ],
          },
        ],
        schema: questionsSchema,
        maxTokens: 4000,
      })
    } else if (provider === "openai") {
      // Use OpenAI with user's API key
      const openaiClient = openai({
        apiKey: apiKey,
      })

      // Get the PDF content as a base64 string
      const pdfBuffer = await file.arrayBuffer()
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

      result = await generateObject({
        model: openaiClient("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: "You are an expert at creating educational quizzes from documents.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Generate 5 multiple-choice quiz questions based on the content of this PDF. Each question should have 4 options with exactly one correct answer. Make the questions challenging but fair, covering key concepts from the document.",
              },
              {
                type: "file",
                data: await file.arrayBuffer(),
                mimeType: "application/pdf",
              },
            ],
          },
        ],
        schema: questionsSchema,
        maxTokens: 4000,
        providerOptions: {
          openai: {
            // Add any specific OpenAI options here if needed
          },
        },
      })
    } else {
      return Response.json({ error: "Unsupported provider. Please use 'claude' or 'openai'." }, { status: 400 })
    }

    return Response.json(result.object)
  } catch (error) {
    console.error("Error generating questions:", error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      console.error("Error stack:", error.stack)
    }

    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}

