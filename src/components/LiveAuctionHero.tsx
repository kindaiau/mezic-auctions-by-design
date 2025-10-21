import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';

interface Auction {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  current_bid: number;
  end_time: string;
  status: string;
}

const LiveAuctionHero = () => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    fetchLiveAuction();
  }, []);

  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auction.end_time).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const fetchLiveAuction = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('status', 'live')
      .order('end_time', { ascending: true })
      .limit(1)
      .single();

    if (!error && data) {
      setAuction(data);
    }
  };

  if (!auction) return null;

  const imageMap: { [key: string]: string } = {
    '/lovable-uploads/abstract-emotions.png': '/src/assets/abstract-emotions-artwork-optimized.webp',
    '/lovable-uploads/urban-decay.jpg': '/src/assets/urban-decay-artwork-optimized.webp',
    '/lovable-uploads/vali-myers.jpg': '/src/assets/vali-myers-artwork-optimized.webp',
  };

  return (
    <section className="relative bg-charcoal text-gallery-white py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={imageMap[auction.image_url] || auction.image_url} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-gallery-gold/20 border border-gallery-gold rounded-full">
              <p className="text-gallery-gold text-sm uppercase tracking-wider font-semibold">
                Live Auction Now
              </p>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {auction.title}
            </h1>
            
            <p className="text-xl text-gallery-white/80">
              by {auction.artist}
            </p>

            <div className="grid grid-cols-4 gap-4 py-6">
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-gallery-gold">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-sm text-gallery-white/60 uppercase tracking-wider mt-2">
                  Days
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-gallery-gold">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-sm text-gallery-white/60 uppercase tracking-wider mt-2">
                  Hours
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-gallery-gold">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-sm text-gallery-white/60 uppercase tracking-wider mt-2">
                  Minutes
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-gallery-gold">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gallery-white/60 uppercase tracking-wider mt-2">
                  Seconds
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Button 
                onClick={() => {
                  const element = document.getElementById('auctions');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gallery-gold text-charcoal hover:bg-gallery-gold/90 px-8 py-6 text-lg font-semibold"
              >
                Place Your Bid
              </Button>
              <div className="text-left">
                <p className="text-sm text-gallery-white/60 uppercase tracking-wider">
                  Current Bid
                </p>
                <p className="text-2xl font-bold text-gallery-gold">
                  ${auction.current_bid}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative rounded-lg overflow-hidden border-4 border-gallery-gold/30">
              <img 
                src={imageMap[auction.image_url] || auction.image_url} 
                alt={auction.title}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveAuctionHero;
