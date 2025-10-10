import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PixelIntro from '@/components/PixelIntro';
import Hero from '@/components/Hero';
import Auctions from '@/components/Auctions';
import Footer from '@/components/Footer';
import EmailSignup from '@/components/EmailSignup';
import { ChatAssistant, ChatButton } from '@/components/ChatAssistant';

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Show content after pixel intro
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(349,100%,50%)]">
      <PixelIntro />
      
      {showContent && (
        <>
          <Header />
          <main>
            <Hero />
            <Auctions />
            <EmailSignup />
          </main>
          <Footer />
          
          {/* AI Chat Assistant */}
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatAssistant 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default Index;
