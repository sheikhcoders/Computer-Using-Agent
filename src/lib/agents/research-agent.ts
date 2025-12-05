/**
 * Research Agent
 * 
 * Specialized agent for comprehensive research:
 * - Web search and information gathering
 * - Deep analysis with multiple sources
 * - Browser automation for data extraction
 * - Chart and visualization generation
 * - Report compilation
 */

import { generateText, tool } from "ai";
import { z } from "zod";
import { registry } from "@/lib/ai/registry";
import { agentConfigs } from "./config";
import type { SubTask, AgentContext, AgentResponse, Artifact } from "./types";

/**
 * Research Agent system prompt
 */
const researchAgentPrompt = `You are the Research Agent, a specialized AI for comprehensive research and analysis.

## Capabilities:
- **Web Search**: Find current, accurate information from multiple sources
- **Deep Analysis**: Synthesize information into actionable insights
- **Data Extraction**: Extract structured data from websites
- **Visualization**: Create charts and graphs to illustrate findings
- **Report Generation**: Compile comprehensive research reports

## Research Methodology:
1. Understand the research question
2. Identify key information needs
3. Search multiple authoritative sources
4. Cross-reference and verify facts
5. Analyze data and identify patterns
6. Generate visualizations where helpful
7. Compile findings into a clear report

## Output Format:
- Start with an executive summary
- Organize findings by topic/theme
- Include source citations
- Highlight key insights
- Provide data visualizations
- End with recommendations or conclusions

## Quality Standards:
- Use only reliable, recent sources
- Distinguish facts from opinions
- Acknowledge limitations or gaps
- Provide balanced perspectives
- Use clear, professional language
`;

/**
 * Define Research Agent tools
 */
const researchAgentTools = {
  web_search: tool({
    description: "Search the web for information",
    parameters: z.object({
      query: z.string().describe("Search query"),
      numResults: z.number().optional().describe("Number of results (default 10)"),
    }),
    execute: async ({ query, numResults = 10 }) => {
      // In production, this would call a search API
      return {
        success: true,
        query,
        results: [
          {
            title: "Search result placeholder",
            url: "https://example.com",
            snippet: "This would be actual search results...",
          },
        ],
        totalResults: numResults,
      };
    },
  }),

  browse_url: tool({
    description: "Navigate to a URL and extract content",
    parameters: z.object({
      url: z.string().url().describe("URL to browse"),
      extractText: z.boolean().optional().describe("Extract main text content"),
      extractLinks: z.boolean().optional().describe("Extract links from page"),
    }),
    execute: async ({ url, extractText = true }) => {
      // In production, this would use browser automation
      return {
        success: true,
        url,
        title: "Page Title",
        content: extractText ? "Extracted page content..." : undefined,
        links: [],
      };
    },
  }),

  extract_content: tool({
    description: "Extract structured data from a webpage",
    parameters: z.object({
      url: z.string().url().describe("URL to extract from"),
      selector: z.string().optional().describe("CSS selector for specific content"),
      format: z.enum(["text", "json", "table"]).describe("Output format"),
    }),
    execute: async ({ url, format }) => {
      return {
        success: true,
        url,
        format,
        data: "Extracted structured data...",
      };
    },
  }),

  generate_chart: tool({
    description: "Generate a chart or visualization",
    parameters: z.object({
      type: z.enum(["bar", "line", "pie", "scatter", "table"]).describe("Chart type"),
      title: z.string().describe("Chart title"),
      data: z.string().describe("Data in JSON format"),
      options: z.object({
        xLabel: z.string().optional(),
        yLabel: z.string().optional(),
        colors: z.array(z.string()).optional(),
      }).optional(),
    }),
    execute: async ({ type, title, data }) => {
      return {
        success: true,
        chartId: `chart-${Date.now()}`,
        type,
        title,
        imageUrl: "/charts/placeholder.png",
      };
    },
  }),

  analyze_data: tool({
    description: "Analyze data and generate insights",
    parameters: z.object({
      data: z.string().describe("Data to analyze (JSON format)"),
      analysisType: z.enum(["summary", "trends", "comparison", "correlation"]).describe("Type of analysis"),
    }),
    execute: async ({ data, analysisType }) => {
      return {
        success: true,
        analysisType,
        insights: [
          "Key finding 1...",
          "Key finding 2...",
        ],
        statistics: {
          count: 100,
          mean: 50,
          median: 48,
        },
      };
    },
  }),
};

/**
 * Execute the Research Agent
 */
export async function executeResearchAgent(
  subTask: SubTask,
  context: AgentContext
): Promise<AgentResponse> {
  const config = agentConfigs.research;
  const model = registry.languageModel(config.model);
  const artifacts: Artifact[] = [];

  const previousContext = Array.from(context.previousResults.entries())
    .map(([id, result]) => `Previous: ${id}\n${result}`)
    .join("\n\n");

  const result = await generateText({
    model,
    system: researchAgentPrompt,
    prompt: `Research Task: ${subTask.title}\n\nDescription: ${subTask.description}\n\n${previousContext ? `Context:\n${previousContext}` : ""}\n\nConduct comprehensive research and provide detailed findings.`,
    tools: researchAgentTools,
    maxSteps: config.maxSteps,
    temperature: config.temperature,
  });

  // Extract chart artifacts
  for (const step of result.steps || []) {
    for (const toolResult of step.toolResults || []) {
      if (toolResult.toolName === "generate_chart" && toolResult.result) {
        const chartResult = toolResult.result as { chartId: string; title: string; type: string };
        artifacts.push({
          id: chartResult.chartId,
          type: "chart",
          title: chartResult.title,
          content: "",
          metadata: { chartType: chartResult.type },
          createdAt: new Date(),
        });
      }
    }
  }

  return {
    message: result.text,
    artifacts,
    thinking: result.reasoning,
    nextAction: "complete",
  };
}
