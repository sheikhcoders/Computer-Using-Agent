# Computer-Using Agent (CUA)

A **Computer-Using Agent** is an AI model designed to interact with graphical user interfaces (GUIs) by perceiving screen content, reasoning about tasks, and performing actions such as clicking, typing, and scrolling—all through natural language instructions.

![Computer-Using Agent](https://img.shields.io/badge/AI-Powered-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Free Models](https://img.shields.io/badge/models-100%25%20Free-brightgreen)

## What is a Computer-Using Agent?

CUA combines vision capabilities with advanced reasoning, enabling it to navigate and operate digital environments like humans do, without relying on specific APIs or scripts. This allows the agent to perform multi-step tasks across various applications, including:

- 🌐 **Web browsers** - Navigate websites, fill forms, extract data
- 🖥️ **Desktop software** - Interact with any application
- 📟 **Legacy systems** - Work with interfaces that lack APIs

### How CUA Works

CUA operates through an iterative loop:

1. **Perception** - Captures screenshots and understands the current UI state
2. **Reasoning** - Uses chain-of-thought planning to determine next steps
3. **Action** - Executes actions via simulated mouse and keyboard inputs

This approach enables:
- ✅ **Adaptability** - Self-corrects when things don't go as planned
- ✅ **Resilience** - Handles UI changes that break traditional automation
- ✅ **Robustness** - More reliable than RPA tools that fail when interfaces shift

## Features

- **🆓 100% Free Models** - Uses free tiers from Groq and Google Gemini
- **⚡ Lightning Fast** - Powered by Groq's ultra-fast inference engine
- **🎨 Beautiful UI** - Modern design with dark mode support
- **♿ Fully Accessible** - WAI-ARIA compliant with full keyboard support
- **🔄 Multiple Models** - Switch between Llama, Gemma, Mixtral, and Gemini
- **📱 Mobile Friendly** - Responsive design with proper touch targets

## Available Free Models

### Groq (Fast Inference)
| Model | Context | Best For |
|-------|---------|----------|
| Llama 3.3 70B | 128K | General tasks, coding, reasoning |
| Gemma 2 9B | 8K | Quick responses, structured output |
| Mixtral 8x7B | 32K | Multilingual, long conversations |
| Llama 3.1 8B | 128K | Fastest responses |

### Google Gemini
| Model | Context | Best For |
|-------|---------|----------|
| Gemini 2.5 Flash | 1M | Multimodal, Google Search, reasoning |
| Gemini 1.5 Flash | 1M | Vision, long documents |
| Gemini 1.5 Flash 8B | 1M | Lightweight, fast |

## Quick Start

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- A free API key from [Groq](https://console.groq.com) and/or [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/sheikhcoders/Computer-Using-Agent.git
cd Computer-Using-Agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

## Environment Variables

```env
# Groq API Key (FREE - https://console.groq.com)
GROQ_API_KEY=gsk_your_key_here

# Google Gemini API Key (FREE - https://aistudio.google.com/apikey)
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **AI SDK**: [Vercel AI SDK](https://ai-sdk.dev/) with provider registry
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) (SVG icons, never emoji)

## Accessibility

This project follows strict accessibility guidelines:

- ✅ Full keyboard navigation (WAI-ARIA APG patterns)
- ✅ Visible focus indicators
- ✅ Minimum hit targets (24px desktop, 44px mobile)
- ✅ Respects `prefers-reduced-motion`
- ✅ Proper ARIA labels and roles
- ✅ Skip to content link
- ✅ Color contrast (APCA compliant)
- ✅ Screen reader friendly

## Project Structure

```
src/
├── app/
│   ├── api/chat/       # AI chat API route
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles & design tokens
├── components/
│   ├── chat/           # Chat UI components
│   ├── layout/         # Header, footer
│   ├── providers/      # Theme provider
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/
    ├── ai/             # AI provider registry & prompts
    └── utils.ts        # Utility functions
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

## Future Roadmap

- [ ] **Vision capabilities** - Screenshot analysis with multimodal models
- [ ] **Action execution** - Simulated mouse/keyboard via browser automation
- [ ] **Task memory** - Remember and replay multi-step workflows
- [ ] **Tool calling** - Integration with external APIs and services
- [ ] **Voice input** - Whisper-powered voice commands

## CUA vs Traditional Automation

| Feature | CUA | RPA |
|---------|-----|-----|
| UI Changes | Adapts automatically | Breaks frequently |
| Setup | Natural language | Complex scripting |
| Learning | Self-improving | Static rules |
| Flexibility | Any application | Specific integrations |

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the accessibility requirements (MUST/SHOULD/NEVER rules)
2. Use SVG icons only (never emoji as UI elements)
3. Ensure keyboard navigation works
4. Test with screen readers
5. Honor `prefers-reduced-motion`

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Built by [@sheikhcoders](https://github.com/sheikhcoders)

---

**Note**: This project uses free API tiers. Please respect rate limits and usage policies of the AI providers.
