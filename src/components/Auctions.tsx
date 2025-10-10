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
  // Mock test data with the 3 artwork images
  const mockAuctions: Auction[] = [{
    id: '1',
    title: 'Vali Myers Original',
    artist: 'Vali Myers',
    image_url: 'vali-myers',
    current_bid: 2500,
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'live'
  }, {
    id: '2',
    title: 'Abstract Emotions',
    artist: 'Contemporary Artist',
    image_url: 'abstract-emotions',
    current_bid: 1800,
    end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'live'
  }, {
    id: '3',
    title: 'Urban Decay Series',
    artist: 'Street Artist',
    image_url: 'urban-decay',
    current_bid: 3200,
    end_time: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: 'live'
  }];
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Static image mapping
  const imageMap: Record<string, string> = {
    'vali-myers': valiMyersArtwork,
    'abstract-emotions': abstractEmotionsArtwork,
    'urban-decay': urbanDecayArtwork
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
      // Use database data if available, otherwise keep mock data
      if (data && data.length > 0) {
        setAuctions(data);
      }
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
    return <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-white text-xl">Loading auctions...</p>
        </div>
      </section>;
  }
  if (auctions.length === 0) {
    return <section id="auctions" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <h2 className="text-white text-3xl md:text-5xl font-semibold">Auctions</h2>
            <a href="#subscribe" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white/10 transition-colors">
              Register your email and number and get alerts
            </a>
          </header>
          <p className="text-white/60 text-center py-12">No live auctions at the moment. Subscribe to get alerts when new auctions go live!</p>
        </div>
      </section>;
  }
  return <section id="auctions" className="py-16 md:py-24 my-0 mx-[4px] px-[31px]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12 flex flex-col items-center gap-4">
          <h2 className="text-white text-3xl md:text-5xl font-semibold text-center">Auctions</h2>
          <button 
            onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-md border border-white/20 px-6 py-2 text-white text-sm md:text-base hover:border-white/50 hover:bg-white/10 transition-all"
          >
            Register Here
          </button>
        </header>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {auctions.map(auction => <article key={auction.id} className="group rounded-lg border border-white/10 p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300">
              <div className="aspect-[4/5] overflow-hidden rounded">
                <img src={imageMap[auction.image_url] || auction.image_url} alt={auction.title} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="text-white text-lg md:text-xl font-medium">{auction.title}</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Current bid: ${auction.current_bid} • {formatEndTime(auction.end_time)}
                  </p>
                </div>
                <button onClick={() => handleBidClick(auction)} className="w-full text-sm rounded-md px-4 py-2 border border-white/20 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200">
                  Place Bid
                </button>
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