# Computer-Using Agent (CUA)

A **general-purpose AI agent** capable of completing complex, long-horizon tasks. Powered by a multi-agent system with specialized agents for code, research, presentations, and multimedia processing.

![Computer-Using Agent](https://img.shields.io/badge/AI-Multi--Agent-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Free Models](https://img.shields.io/badge/models-100%25%20Free-brightgreen)
![AI SDK](https://img.shields.io/badge/AI%20SDK-v4-purple)

## 🎯 Overview

CUA is a sophisticated multi-agent system that:
- **Decomposes** complex tasks into manageable sub-tasks
- **Routes** work to specialized expert agents
- **Coordinates** execution with dependency management
- **Aggregates** results into cohesive outputs

## 🚀 Agent Capabilities

| Agent | Capabilities |
|-------|-------------|
| **Code Agent** | Full-stack web apps, Auth, Database, Stripe, E2E Testing |
| **Research Agent** | Web search, Deep analysis, Browser automation, Charts |
| **PPT Agent** | Beautiful presentations, Flexible layouts, PPTX export |
| **Multimodal Agent** | Image/Audio/Video input, Generation, OCR |

### 💻 Code Agent

```
✅ Full-Stack Development
   - Next.js, React, Vue, APIs
   - Server Actions, tRPC, REST

✅ Authentication
   - NextAuth.js, Clerk, Auth0
   - OAuth, JWT, RBAC

✅ Database
   - Prisma, PostgreSQL, MongoDB
   - Migrations, Relations

✅ Payments
   - Stripe Checkout
   - Subscriptions, Webhooks

✅ Testing
   - Playwright E2E
   - Jest, React Testing Library
```

### 🔬 Research Agent

```
✅ Comprehensive Research
   - Multi-source search
   - API integration
   - Browser automation

✅ In-Depth Analysis
   - Data analysis with code
   - Chart generation
   - Report compilation
```

### 📊 PPT Agent

```
✅ Aesthetics
   - Flexible layouts (not just templates)
   - Professional design
   - Data visualizations

✅ Export Quality
   - High-fidelity PPTX
   - HTML to PowerPoint
   - Animations support
```

### 🎨 Multimodal Agent

```
✅ Input
   - Long-text files
   - Video, Audio, Images
   - OCR and document processing

✅ Output
   - Image generation
   - Audio synthesis (TTS)
   - Video analysis
```

## 🔌 MCP Ecosystem

### Pre-built MCPs
- **GitHub/GitLab** - Repository management, issues, PRs
- **Slack** - Messaging and notifications
- **Google Maps** - Places search, directions
- **Figma** - Design file access, components

### Custom MCPs
Create any custom MCP from scratch or by wrapping existing tools:

```typescript
import { createCustomMCP } from "@/lib/mcp";

createCustomMCP(
  "my-api",
  "My Custom API",
  "Access my custom service",
  [
    {
      name: "my_tool",
      description: "Does something useful",
      inputSchema: { /* JSON Schema */ }
    }
  ]
);
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Request                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Orchestrator                           │
│  • Task Analysis    • Decomposition    • Coordination   │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   Code    │ │ Research  │ │    PPT    │ │Multimodal │
│   Agent   │ │   Agent   │ │   Agent   │ │   Agent   │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                    Tools & MCPs                          │
│  • Code Execution   • Web Search    • Image Gen         │
│  • File Operations  • Browser Use   • Audio/Video       │
│  • Testing          • Charts        • PPTX Export       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- API Keys (all FREE tiers):
  - [Groq](https://console.groq.com) - Fast inference
  - [Google AI Studio](https://aistudio.google.com/apikey) - Gemini
  - [E2B](https://e2b.dev) - Code sandbox (optional)

### Installation

```bash
# Clone
git clone https://github.com/sheikhcoders/Computer-Using-Agent.git
cd Computer-Using-Agent

# Install
npm install

# Configure
cp .env.example .env.local
# Add your API keys to .env.local

# Run
npm run dev
```

### Pages

- **/** - Chat interface (Lightning/Pro modes)
- **/agent** - Multi-agent task execution

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Chat API (Lightning/Pro)
│   │   └── agent/route.ts     # Multi-agent API (SSE)
│   ├── agent/page.tsx         # Multi-agent UI
│   └── page.tsx               # Chat UI
├── components/
│   ├── agent/                 # Agent UI components
│   ├── chat/                  # Chat components
│   └── ui/                    # shadcn/ui
├── hooks/
│   └── use-agent.ts           # Agent state management
└── lib/
    ├── agents/
    │   ├── types.ts           # Type definitions
    │   ├── config.ts          # Agent configurations
    │   ├── orchestrator.ts    # Task orchestration
    │   ├── code-agent.ts      # Code specialist
    │   ├── research-agent.ts  # Research specialist
    │   ├── ppt-agent.ts       # Presentation specialist
    │   └── multimodal-agent.ts# Multimodal specialist
    ├── mcp/
    │   └── index.ts           # MCP integration
    ├── e2b/
    │   └── sandbox.ts         # Code execution
    └── ai/
        ├── registry.ts        # AI provider registry
        ├── modes.ts           # Lightning/Pro modes
        └── prompts.ts         # System prompts
```

## 🔧 Environment Variables

```env
# AI Models (Required - Both have FREE tiers)
GROQ_API_KEY=gsk_...              # Groq Console
GOOGLE_GENERATIVE_AI_API_KEY=...  # Google AI Studio

# Code Execution (Optional - FREE tier)
E2B_API_KEY=e2b_...               # E2B Dashboard

# MCPs (Optional)
GITHUB_TOKEN=ghp_...              # GitHub API
SLACK_BOT_TOKEN=xoxb-...          # Slack API
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| AI SDK | Vercel AI SDK v4 |
| Models | Groq (Llama, Gemma), Google (Gemini) |
| Code Execution | E2B Sandboxed Runtime |
| UI | shadcn/ui, Radix UI, Tailwind CSS |
| Streaming | Server-Sent Events (SSE) |
| Icons | Lucide React (SVG only) |

## ♿ Accessibility

Following strict WCAG 2.1 guidelines:

- ✅ Full keyboard navigation (WAI-ARIA APG)
- ✅ Visible focus indicators
- ✅ Minimum hit targets (24px desktop, 44px mobile)
- ✅ `prefers-reduced-motion` support
- ✅ Proper ARIA labels and roles
- ✅ Skip to content link
- ✅ Color contrast (APCA compliant)

## 🗺️ Roadmap

- [ ] Vision capabilities (screenshot analysis)
- [ ] E2B Desktop sandbox (full browser control)
- [ ] Voice input (Whisper integration)
- [ ] Multi-agent collaboration (parallel execution)
- [ ] Task memory and replay
- [ ] Custom agent creation

## 🤝 Contributing

1. Follow accessibility guidelines (MUST/SHOULD/NEVER)
2. Use SVG icons only (never emoji in UI)
3. Test keyboard navigation
4. Ensure `prefers-reduced-motion` support
5. Write tests for new features

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 👤 Author

Built by [@sheikhcoders](https://github.com/sheikhcoders)

---

**Note**: This project uses free API tiers. Please respect rate limits and usage policies.
