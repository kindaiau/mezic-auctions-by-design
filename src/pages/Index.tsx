import { useState } from 'react';
import PixelIntro from '@/components/PixelIntro';
import LiveAuctionHero from '@/components/LiveAuctionHero';
import Hero from '@/components/Hero';
import Auctions from '@/components/Auctions';
import ShopLink from '@/components/ShopLink';
import Footer from '@/components/Footer';
import EmailSignup from '@/components/EmailSignup';
import BidTrackerWidget from '@/components/BidTrackerWidget';
import { ChatAssistant, ChatButton } from '@/components/ChatAssistant';
import { useTrafficSource } from '@/hooks/useTrafficSource';
import { useScrollDepth } from '@/hooks/useScrollDepth';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize traffic source tracking
  useTrafficSource();
  
  // Track scroll depth
  useScrollDepth();

  return (
    <>
      {!loaded && <PixelIntro onDone={() => setLoaded(true)} />}
      <main className="bg-white text-black">
        <LiveAuctionHero />
        <Hero />
        <Auctions />
        <ShopLink />
        <EmailSignup />
        <Footer />
      </main>

      {loaded && (
        <>
          <BidTrackerWidget />
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatAssistant
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Index;
