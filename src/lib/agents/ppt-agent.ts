/**
 * PPT Agent
 * 
 * Specialized agent for presentation creation:
 * - Beautiful, professional presentations
 * - Flexible layouts beyond templates
 * - Data visualization in slides
 * - High-quality PPTX export
 */

import { generateText, generateObject, tool } from "ai";
import { z } from "zod";
import { registry } from "@/lib/ai/registry";
import { agentConfigs } from "./config";
import type { SubTask, AgentContext, AgentResponse, Artifact } from "./types";

/**
 * Slide schema for structured generation
 */
const slideSchema = z.object({
  slides: z.array(
    z.object({
      id: z.string(),
      layout: z.enum(["title", "content", "two-column", "image", "chart", "quote", "timeline", "comparison"]),
      title: z.string(),
      subtitle: z.string().optional(),
      content: z.array(z.string()).optional(),
      leftColumn: z.array(z.string()).optional(),
      rightColumn: z.array(z.string()).optional(),
      imagePrompt: z.string().optional(),
      chartData: z.object({
        type: z.string(),
        data: z.string(),
      }).optional(),
      notes: z.string().optional(),
      style: z.object({
        backgroundColor: z.string().optional(),
        textColor: z.string().optional(),
        accentColor: z.string().optional(),
      }).optional(),
    })
  ),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    fontFamily: z.string(),
    style: z.enum(["professional", "creative", "minimal", "bold"]),
  }),
});

/**
 * PPT Agent system prompt
 */
const pptAgentPrompt = `You are the PPT Agent, a specialized AI for creating stunning presentations.

## Design Philosophy:
- **Visual Hierarchy**: Clear focus and flow on each slide
- **Minimal Text**: Key points only, no paragraphs
- **Strong Imagery**: Visuals that reinforce the message
- **Consistent Theme**: Cohesive color and typography
- **White Space**: Room to breathe, not cluttered

## Slide Layouts Available:
1. **Title**: Opening slide with title and subtitle
2. **Content**: Title with bullet points
3. **Two-Column**: Side-by-side comparison or content
4. **Image**: Full or partial image with overlay text
5. **Chart**: Data visualization slide
6. **Quote**: Highlighted quote or key message
7. **Timeline**: Sequential events or process
8. **Comparison**: Before/after or pros/cons

## Best Practices:
- 10-20 slides for most presentations
- 1 main idea per slide
- 6 words per bullet point max
- Use visuals to explain complex ideas
- Include speaker notes for context
- End with clear call-to-action

## Output:
Generate a complete presentation structure with:
- Slide-by-slide breakdown
- Layout choices with rationale
- Content for each slide
- Suggested visuals/charts
- Color theme and styling
`;

/**
 * Define PPT Agent tools
 */
const pptAgentTools = {
  create_slide: tool({
    description: "Create a new slide with specific layout and content",
    parameters: z.object({
      layout: z.enum(["title", "content", "two-column", "image", "chart", "quote", "timeline", "comparison"]),
      title: z.string(),
      content: z.string(),
      notes: z.string().optional(),
    }),
    execute: async ({ layout, title, content, notes }) => {
      return {
        success: true,
        slideId: `slide-${Date.now()}`,
        layout,
        title,
      };
    },
  }),

  add_chart: tool({
    description: "Add a chart to a slide",
    parameters: z.object({
      slideId: z.string(),
      chartType: z.enum(["bar", "line", "pie", "donut", "area"]),
      data: z.string().describe("Chart data in JSON format"),
      title: z.string(),
    }),
    execute: async ({ slideId, chartType, title }) => {
      return {
        success: true,
        chartId: `chart-${Date.now()}`,
        slideId,
        chartType,
        title,
      };
    },
  }),

  add_image: tool({
    description: "Add an image to a slide (generates from description)",
    parameters: z.object({
      slideId: z.string(),
      imageDescription: z.string().describe("Description of the image to generate"),
      position: z.enum(["full", "left", "right", "center"]),
    }),
    execute: async ({ slideId, imageDescription, position }) => {
      return {
        success: true,
        imageId: `img-${Date.now()}`,
        slideId,
        position,
        description: imageDescription,
      };
    },
  }),

  export_pptx: tool({
    description: "Export the presentation to PPTX format",
    parameters: z.object({
      filename: z.string(),
      includeNotes: z.boolean().optional(),
    }),
    execute: async ({ filename, includeNotes }) => {
      return {
        success: true,
        filename: `${filename}.pptx`,
        downloadUrl: `/exports/${filename}.pptx`,
        includeNotes,
      };
    },
  }),
};

/**
 * Execute the PPT Agent
 */
export async function executePPTAgent(
  subTask: SubTask,
  context: AgentContext
): Promise<AgentResponse> {
  const config = agentConfigs.ppt;
  const model = registry.languageModel(config.model);
  const artifacts: Artifact[] = [];

  const previousContext = Array.from(context.previousResults.entries())
    .map(([id, result]) => `Previous: ${id}\n${result}`)
    .join("\n\n");

  // First, generate the presentation structure
  const structure = await generateObject({
    model,
    schema: slideSchema,
    system: pptAgentPrompt,
    prompt: `Create a presentation for: ${subTask.title}\n\nDetails: ${subTask.description}\n\n${previousContext ? `Context:\n${previousContext}` : ""}`,
    temperature: config.temperature,
  });

  // Add presentation as artifact
  artifacts.push({
    id: `ppt-${Date.now()}`,
    type: "presentation",
    title: subTask.title,
    content: JSON.stringify(structure.object, null, 2),
    metadata: {
      slideCount: structure.object.slides.length,
      theme: structure.object.theme,
    },
    createdAt: new Date(),
  });

  // Generate summary text
  const result = await generateText({
    model,
    system: "Summarize the presentation you created.",
    prompt: `Presentation: ${JSON.stringify(structure.object)}\n\nProvide a brief summary of the presentation structure and key points.`,
    temperature: 0.3,
  });

  return {
    message: result.text,
    artifacts,
    plan: structure.object.slides.map((s) => s.title),
    nextAction: "complete",
  };
}
