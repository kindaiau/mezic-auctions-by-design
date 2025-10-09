import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BidModal } from './BidModal';
import valiMyersArtwork from '@/assets/vali-myers-artwork.jpg';
import abstractEmotionsArtwork from '@/assets/abstract-emotions-artwork.png';
import urbanDecayArtwork from '@/assets/urban-decay-artwork.jpg';

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
  const [loading, setLoading] = useState(true);

  // Static image mapping
  const imageMap: Record<string, string> = {
    'vali-myers': valiMyersArtwork,
    'abstract-emotions': abstractEmotionsArtwork,
    'urban-decay': urbanDecayArtwork,
  };

  useEffect(() => {
    fetchAuctions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('auctions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions'
        },
        () => {
          fetchAuctions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'live')
        .order('end_time', { ascending: true });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsBidModalOpen(true);
  };

  const formatEndTime = (endTime: string) => {
    const date = new Date(endTime);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `Ends in ${hours}h`;
    }
    return `Ends ${date.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-white text-xl">Loading auctions...</p>
        </div>
      </section>
    );
  }

  if (auctions.length === 0) {
    return (
      <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 md:mb-12 flex items-end justify-between">
            <h2 className="text-white text-3xl md:text-5xl font-semibold">Auctions</h2>
            <a href="#subscribe" className="text-sm md:text-base underline text-white/70 hover:text-white">Get alerts</a>
          </header>
          <p className="text-white/60 text-center py-12">No live auctions at the moment. Subscribe to get alerts when new auctions go live!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="auctions" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12 flex items-end justify-between">
          <h2 className="text-white text-3xl md:text-5xl font-semibold">Auctions</h2>
          <a href="#subscribe" className="text-sm md:text-base underline text-white/70 hover:text-white">Get alerts</a>
        </header>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {auctions.map((auction) => (
            <article 
              key={auction.id} 
              className="group rounded-lg border border-white/10 p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden rounded">
                <img 
                  src={imageMap[auction.image_url] || auction.image_url}
                  alt={auction.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="text-white text-lg md:text-xl font-medium">{auction.title}</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Current bid: ${auction.current_bid} • {formatEndTime(auction.end_time)}
                  </p>
                </div>
                <button 
                  onClick={() => handleBidClick(auction)}
                  className="w-full text-sm rounded-md px-4 py-2 border border-white/20 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                >
                  Place Bid
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedAuction && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          auction={{
            id: selectedAuction.id,
            title: selectedAuction.title,
            artist: selectedAuction.artist,
            currentBid: selectedAuction.current_bid
          }}
          onBidPlaced={fetchAuctions}
        />
      )}
    </section>
  );
}
