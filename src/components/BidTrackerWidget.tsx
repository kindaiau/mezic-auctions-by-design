import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from './ui/card';

interface Bid {
  id: string;
  bid_amount: number;
  bid_time: string;
  auction_id: string;
}

interface AuctionStats {
  auction_id: string;
  bid_count: number;
  current_high_bid: number;
}

const BidTrackerWidget = () => {
  const [latestBid, setLatestBid] = useState<Bid | null>(null);
  const [stats, setStats] = useState<AuctionStats | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    fetchLatestBid();
    fetchStats();

    // Subscribe to new bids
    const channel = supabase
      .channel('bid-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids'
        },
        (payload) => {
          setLatestBid(payload.new as Bid);
          setPulse(true);
          setTimeout(() => setPulse(false), 2000);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLatestBid = async () => {
    const { data } = await supabase
      .from('bids')
      .select('*')
      .order('bid_time', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLatestBid(data);
    }
  };

  const fetchStats = async () => {
    const { data } = await supabase
      .from('auction_bid_counts')
      .select('*')
      .order('current_high_bid', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setStats(data);
    }
  };

  const formatTimeAgo = (time: string) => {
    const now = new Date();
    const bidTime = new Date(time);
    const diffMs = now.getTime() - bidTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm">
      <Card className={`bg-charcoal border-gallery-gold/30 p-6 transition-all duration-500 ${
        pulse ? 'scale-105 shadow-lg shadow-gallery-gold/50' : ''
      }`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gallery-gold font-semibold uppercase tracking-wider text-sm">
              Live Activity
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-gallery-gold ${
                pulse ? 'animate-ping' : 'animate-pulse'
              }`} />
              <span className="text-gallery-white/60 text-xs">Live</span>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gallery-white/60 text-xs uppercase tracking-wider">
                  Total Bids
                </p>
                <p className="text-gallery-white text-2xl font-bold">
                  {stats.bid_count}
                </p>
              </div>
              <div>
                <p className="text-gallery-white/60 text-xs uppercase tracking-wider">
                  Highest Bid
                </p>
                <p className="text-gallery-gold text-2xl font-bold">
                  ${stats.current_high_bid}
                </p>
              </div>
            </div>
          )}

          {latestBid && (
            <div className="border-t border-gallery-white/10 pt-4">
              <p className="text-gallery-white/60 text-xs uppercase tracking-wider mb-2">
                Latest Bid
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gallery-white font-medium">
                    Anonymous Collector
                  </p>
                  <p className="text-gallery-white/60 text-xs">
                    {formatTimeAgo(latestBid.bid_time)}
                  </p>
                </div>
                <p className="text-gallery-gold text-xl font-bold">
                  ${latestBid.bid_amount}
                </p>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <p className="text-gallery-white/40 text-xs">
              {stats && stats.bid_count > 1 
                ? `${stats.bid_count} collectors watching` 
                : 'Be the first to bid'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BidTrackerWidget;
