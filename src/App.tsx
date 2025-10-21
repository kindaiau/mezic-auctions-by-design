import { useState, lazy, Suspense } from "react";
import PixelIntro from "./components/PixelIntro";
import Hero from "./components/Hero";
import Auctions from "./components/Auctions";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

// Lazy load chat components - only needed after intro loads
const ChatAssistant = lazy(() => import("./components/ChatAssistant").then(module => ({ default: module.ChatAssistant })));
const ChatButton = lazy(() => import("./components/ChatAssistant").then(module => ({ default: module.ChatButton })));

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <>
      {!loaded && <PixelIntro onDone={() => setLoaded(true)} />}
      <main className="bg-white text-black">
        <Hero />
        <Auctions />
        <EmailSignup />
        <Footer />
      </main>

      {/* AI Chat Assistant */}
      {loaded && (
        <Suspense fallback={null}>
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatAssistant
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </Suspense>
      )}
      <Toaster />
    </>
  );
}
