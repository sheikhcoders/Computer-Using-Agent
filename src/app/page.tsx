import { Chat } from "@/components/chat/chat";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="flex flex-1 flex-col safe-area-inset"
        role="main"
        aria-label="Chat with Computer-Using Agent"
      >
        <Chat />
      </main>
    </div>
  );
}
