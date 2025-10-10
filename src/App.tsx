import { useState } from "react";
import PixelIntro from "./components/PixelIntro";
import Hero from "./components/Hero";
import Auctions from "./components/Auctions";
import Footer from "./components/Footer";
import { ChatAssistant, ChatButton } from "./components/ChatAssistant";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <>
      {!loaded && <PixelIntro onDone={() => setLoaded(true)} />}
      <main className="bg-black text-white">
        <Hero />
        <Auctions />
        {/* signup & about go here */}
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
    </>
  );
}
