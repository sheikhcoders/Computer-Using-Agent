import { streamText, convertToCoreMessages } from "ai";
import { registry } from "@/lib/ai/registry";
import { systemPrompt } from "@/lib/ai/prompts";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model = "groq:llama-3.3-70b-versatile" } = await req.json();

    // Get the language model from registry
    const languageModel = registry.languageModel(model);

    // Stream the response
    const result = streamText({
      model: languageModel,
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      // Enable tool usage for capable models
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Return appropriate error response
    const message = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
