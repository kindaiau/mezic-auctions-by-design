import { useState } from "react";
import PixelIntro from "./components/PixelIntro";
import Hero from "./components/Hero";
import Auctions from "./components/Auctions";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";
import { ChatAssistant, ChatButton } from "./components/ChatAssistant";
import { Toaster } from "./components/ui/toaster";

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
        <>
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatAssistant
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </>
      )}
      <Toaster />
    </>
  );
}
