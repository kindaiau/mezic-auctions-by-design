import { useState, lazy, Suspense } from 'react';
import PixelIntro from '@/components/PixelIntro';
import Hero from '@/components/Hero';
import Auctions from '@/components/Auctions';
import ShopLink from '@/components/ShopLink';
import Footer from '@/components/Footer';
import EmailSignup from '@/components/EmailSignup';
import { useTrafficSource } from '@/hooks/useTrafficSource';
import { useScrollDepth } from '@/hooks/useScrollDepth';

// Lazy load components that aren't needed immediately
const ChatAssistant = lazy(() => import('@/components/ChatAssistant').then(module => ({ default: module.ChatAssistant })));
const ChatButton = lazy(() => import('@/components/ChatAssistant').then(module => ({ default: module.ChatButton })));

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
        <Hero />
        <Auctions />
        <ShopLink />
        <EmailSignup />
        <Footer />
      </main>

      {loaded && (
        <Suspense fallback={null}>
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatAssistant
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default Index;
