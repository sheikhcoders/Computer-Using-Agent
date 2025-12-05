# Computer-Using Agent

An AI-powered assistant that uses **free** language models to help you with coding, writing, analysis, and more. Built with modern web technologies and full accessibility support.

![Computer-Using Agent](https://img.shields.io/badge/AI-Powered-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Free Models](https://img.shields.io/badge/models-100%25%20Free-brightgreen)

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
