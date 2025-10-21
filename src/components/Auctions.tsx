import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BidModal } from './BidModal';
import { Button } from './ui/button';
import valiMyersArtwork from '@/assets/vali-myers-artwork-optimized.webp';
import abstractEmotionsArtwork from '@/assets/abstract-emotions-artwork-optimized.webp';
import urbanDecayArtwork from '@/assets/urban-decay-artwork-optimized.webp';
import { trackAuctionView, trackAuctionClick, trackBidModalOpen } from '@/lib/tracking';
interface Auction {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  current_bid: number;
  end_time: string;
  status: string;
}
export default function Auctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const auctionsTracked = useRef<Set<string>>(new Set());

  // Static image mapping - handles both short names and full filenames from database
  const imageMap: Record<string, string> = {
    'vali-myers': valiMyersArtwork,
    'vali-myers-artwork.jpg': valiMyersArtwork,
    'abstract-emotions': abstractEmotionsArtwork,
    'abstract-emotions-artwork.png': abstractEmotionsArtwork,
    'urban-decay': urbanDecayArtwork,
    'urban-decay-artwork.jpg': urbanDecayArtwork
  };
  useEffect(() => {
    fetchAuctions();

    // Subscribe to realtime updates
    const channel = supabase.channel('auctions-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'auctions'
    }, () => {
      fetchAuctions();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const fetchAuctions = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('auctions').select('*').eq('status', 'live').order('end_time', {
        ascending: true
      });
      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleBidClick = (auction: Auction) => {
    trackAuctionClick(auction.id, auction.title);
    trackBidModalOpen(auction.id, auction.title, auction.current_bid);
    setSelectedAuction(auction);
    setIsBidModalOpen(true);
  };

  // Track auction views when they appear on screen
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5, // Track when 50% of auction is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const auctionId = entry.target.getAttribute('data-auction-id');
          const auctionTitle = entry.target.getAttribute('data-auction-title');
          
          if (auctionId && auctionTitle && !auctionsTracked.current.has(auctionId)) {
            auctionsTracked.current.add(auctionId);
            trackAuctionView(auctionId, auctionTitle);
          }
        }
      });
    }, observerOptions);

    // Observe all auction cards
    const auctionCards = document.querySelectorAll('[data-auction-id]');
    auctionCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [auctions]);
  const formatEndTime = (endTime: string) => {
    const date = new Date(endTime);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const dateString = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    const timeString = date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    if (hours < 24) {
      return `${hours}h ${minutes}m (${dateString} ${timeString})`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d (${dateString} ${timeString})`;
  };
  if (loading) {
    return <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-black text-xl">Loading auctions...</p>
        </div>
      </section>;
  }
  if (auctions.length === 0) {
    return <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <h2 className="text-black text-3xl md:text-5xl font-semibold">Auctions</h2>
            <a href="#subscribe" className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-black hover:bg-black/10 transition-colors">
              Register your email and number and get alerts
            </a>
          </header>
          <p className="text-black/60 text-center py-12">No live auctions at the moment. Subscribe to get alerts when new auctions go live!</p>
        </div>
      </section>;
  }
  return <section id="auctions" className="py-16 md:py-24 my-0 mx-[4px] px-[31px]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12 flex flex-col items-center gap-4">
          <h2 className="text-black text-3xl md:text-5xl font-semibold text-center">Auctions</h2>
          
        </header>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {auctions.map(auction => <article 
              key={auction.id} 
              data-auction-id={auction.id}
              data-auction-title={auction.title}
              className="group rounded-lg border border-black/10 p-4 bg-black/[0.02] hover:bg-black/[0.05] transition-colors duration-300">
              <div className="aspect-square overflow-hidden rounded">
                <img src={imageMap[auction.image_url] || auction.image_url} alt={auction.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-4 flex flex-col justify-between" style={{ minHeight: '120px' }}>
                <div className="space-y-3">
                  <h3 className="text-black text-lg md:text-xl font-medium line-clamp-2 text-center">{auction.title}</h3>
                  <div className="text-center space-y-1">
                    <p className="text-black/70 text-xs uppercase tracking-wider">Current Bid</p>
                    <p className="text-gallery-gold text-2xl font-bold">
                      ${auction.current_bid}
                    </p>
                    <p className="text-black/60 text-xs">
                      Ends: {formatEndTime(auction.end_time)}
                    </p>
                  </div>
                </div>
                <Button onClick={() => handleBidClick(auction)} variant="mez" className="w-full px-4 py-3 text-sm uppercase tracking-tight min-h-[44px] mt-3" aria-label={`Place bid on ${auction.title}`}>
                  PLACE BID
                </Button>
              </div>
            </article>)}
        </div>
      </div>

      {selectedAuction && <BidModal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} auction={{
      id: selectedAuction.id,
      title: selectedAuction.title,
      artist: selectedAuction.artist,
      currentBid: selectedAuction.current_bid
    }} onBidPlaced={fetchAuctions} />}
    </section>;
}