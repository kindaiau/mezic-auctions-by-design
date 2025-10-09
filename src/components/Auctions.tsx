import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { BidModal } from './BidModal';
import valiMyersArtwork from '@/assets/vali-myers-artwork.jpg';
import abstractEmotionsArtwork from '@/assets/abstract-emotions-artwork.png';
import urbanDecayArtwork from '@/assets/urban-decay-artwork.jpg';

type ReserveStatus = 'met' | 'not_met' | 'no_reserve';

interface BiddingRecord {
  bidder: string;
  amount: number;
  time: string;
}

interface Auction {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  current_bid: number;
  end_time: string;
  status: string;
  medium: string;
  year: number | null;
  reserve_status: ReserveStatus;
  short_description: string;
  condition_report_available: boolean;
  provenance: string[];
  bidding_history: BiddingRecord[];
}

type AuctionRow = Database['public']['Tables']['auctions']['Row'];

const normalizeProvenance = (value: AuctionRow['provenance']): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  }
  return [];
};

const normalizeBiddingHistory = (value: AuctionRow['bidding_history']): BiddingRecord[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (entry && typeof entry === 'object') {
        const bidder = typeof (entry as Record<string, unknown>).bidder === 'string'
          ? (entry as Record<string, unknown>).bidder
          : 'Collector';
        const amountValue = (entry as Record<string, unknown>).amount;
        const parsedAmount = typeof amountValue === 'number' ? amountValue : Number(amountValue);
        const timeValue = (entry as Record<string, unknown>).time;
        const time = typeof timeValue === 'string' ? timeValue : new Date().toISOString();

        if (!Number.isFinite(parsedAmount)) {
          return null;
        }

        return {
          bidder,
          amount: parsedAmount,
          time,
        } satisfies BiddingRecord;
      }
      return null;
    })
    .filter((entry): entry is BiddingRecord => entry !== null);
};

const transformAuctionRow = (auction: AuctionRow): Auction => {
  const reserve = typeof auction.reserve_status === 'string' ? auction.reserve_status : 'not_met';
  const reserve_status: ReserveStatus = ['met', 'no_reserve', 'not_met'].includes(reserve)
    ? (reserve as ReserveStatus)
    : 'not_met';

  return {
    id: auction.id,
    title: auction.title,
    artist: auction.artist,
    image_url: auction.image_url,
    current_bid: Number(auction.current_bid ?? 0),
    end_time: auction.end_time,
    status: auction.status,
    medium: auction.medium ?? 'Mixed media',
    year: auction.year ?? null,
    reserve_status,
    short_description: auction.short_description ?? '',
    condition_report_available: auction.condition_report_available ?? false,
    provenance: normalizeProvenance(auction.provenance),
    bidding_history: normalizeBiddingHistory(auction.bidding_history),
  } satisfies Auction;
};

const buildMockAuctions = (): Auction[] => [
  {
    id: '1',
    title: 'Vali Myers Original',
    artist: 'Vali Myers',
    image_url: 'vali-myers',
    current_bid: 2500,
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'live',
    medium: 'Ink and watercolor on paper',
    year: 1972,
    reserve_status: 'met',
    short_description: 'A luminous portrait from Myers’s Italian period, rich with intricate linework.',
    condition_report_available: true,
    provenance: ['Private collection, Melbourne', 'Acquired directly from the artist'],
    bidding_history: [
      { bidder: 'Bidder 102', amount: 2400, time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
      { bidder: 'Bidder 118', amount: 2500, time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '2',
    title: 'Abstract Emotions',
    artist: 'Contemporary Artist',
    image_url: 'abstract-emotions',
    current_bid: 1800,
    end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: 'live',
    medium: 'Acrylic on canvas',
    year: 2019,
    reserve_status: 'not_met',
    short_description: 'Dynamic gestures in saturated color that explore the energy of human connection.',
    condition_report_available: false,
    provenance: ['From the studio of the artist'],
    bidding_history: [
      { bidder: 'Bidder 045', amount: 1600, time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { bidder: 'Bidder 072', amount: 1800, time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: '3',
    title: 'Urban Decay Series',
    artist: 'Street Artist',
    image_url: 'urban-decay',
    current_bid: 3200,
    end_time: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: 'live',
    medium: 'Spray paint and wheatpaste on panel',
    year: 2015,
    reserve_status: 'no_reserve',
    short_description: 'Layered city fragments capturing the tension between renewal and erosion.',
    condition_report_available: true,
    provenance: ['Private collector, New York', 'Galerie L’Essor, Paris (2017)'],
    bidding_history: [
      { bidder: 'Bidder 210', amount: 3000, time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { bidder: 'Bidder 305', amount: 3200, time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

export default function Auctions() {
  const [auctions, setAuctions] = useState<Auction[]>(() => buildMockAuctions());
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);

  // Static image mapping
  const imageMap: Record<string, string> = {
    'vali-myers': valiMyersArtwork,
    'abstract-emotions': abstractEmotionsArtwork,
    'urban-decay': urbanDecayArtwork,
  };

  const fetchAuctions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'live')
        .order('end_time', { ascending: true });

      if (error) throw error;
      // Use database data if available, otherwise keep mock data
      if (data && data.length > 0) {
        const formattedAuctions = data.map(transformAuctionRow);
        setAuctions(formattedAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
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
  }, [fetchAuctions]);

  const handleBidClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsBidModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  const formatEndTime = (endTime: string) => {
    const date = new Date(endTime);
    if (Number.isNaN(date.getTime())) {
      return 'Ends soon';
    }

    const now = new Date();
    if (date.getTime() <= now.getTime()) {
      return 'Ending now';
    }

    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 24) {
      return `Ends in ${hours}h ${minutes}m`;
    }

    return `Ends ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const diff = date.getTime() - Date.now();
    const absDiff = Math.abs(diff);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (absDiff >= week) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (absDiff >= day) return rtf.format(Math.round(diff / day), 'day');
    if (absDiff >= hour) return rtf.format(Math.round(diff / hour), 'hour');
    if (absDiff >= minute) return rtf.format(Math.round(diff / minute), 'minute');
    return 'just now';
  };

  const getReserveBadge = (status: ReserveStatus) => {
    switch (status) {
      case 'met':
        return {
          label: 'Reserve met',
          className: 'border-emerald-400/40 text-emerald-200/90 bg-emerald-400/10'
        };
      case 'no_reserve':
        return {
          label: 'No reserve',
          className: 'border-amber-400/40 text-amber-200/80 bg-amber-400/10'
        };
      default:
        return {
          label: 'Reserve in play',
          className: 'border-white/20 text-white/70'
        };
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedAuctionId((prev) => (prev === id ? null : id));
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
          {auctions.map((auction) => {
            const reserveBadge = getReserveBadge(auction.reserve_status);
            const isExpanded = expandedAuctionId === auction.id;

            return (
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
                <div className="mt-4 space-y-4">
                  <header className="space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-white text-lg md:text-xl font-medium">{auction.title}</h3>
                      {auction.year !== null && (
                        <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                          {auction.year}
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">
                      {auction.artist} • {auction.medium}
                    </p>
                  </header>

                  {auction.short_description && (
                    <p className="text-sm leading-relaxed text-white/70">
                      {auction.short_description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <p className="text-white/60">
                      <span className="font-semibold text-white">{formatCurrency(auction.current_bid)}</span>
                      <span className="mx-2 text-white/30">•</span>
                      {formatEndTime(auction.end_time)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide">
                      <span className={`rounded-full border px-3 py-1 ${reserveBadge.className}`}>
                        {reserveBadge.label}
                      </span>
                      {auction.condition_report_available && (
                        <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sky-200/80">
                          Condition report available
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBidClick(auction)}
                    className="w-full text-sm rounded-md px-4 py-2 border border-white/20 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                  >
                    Place Bid
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpanded(auction.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-xs uppercase tracking-wide rounded-md px-4 py-2 border border-white/10 text-white/70 hover:border-white/30 hover:text-white/90 transition-colors duration-200"
                  >
                    {isExpanded ? 'Hide provenance & bids' : 'View provenance & bids'}
                  </button>

                  <div
                    className={`overflow-hidden rounded-md border border-white/10 bg-black/30 text-sm text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:max-h-80 group-hover:opacity-100 group-hover:mt-2 group-hover:p-4 ${
                      isExpanded ? 'max-h-80 opacity-100 mt-2 p-4' : 'max-h-0 opacity-0 mt-0 p-0'
                    }`}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/50">Provenance</h4>
                        <ul className="mt-2 space-y-1">
                          {auction.provenance.length > 0 ? (
                            auction.provenance.map((entry, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                                <span>{entry}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-white/40">Provenance details forthcoming</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/50">Bidding history</h4>
                        <ul className="mt-2 space-y-1">
                          {auction.bidding_history.length > 0 ? (
                            auction.bidding_history.map((entry, index) => (
                              <li key={index} className="flex items-start justify-between gap-3 text-sm text-white/70">
                                <div className="flex flex-col">
                                  <span className="font-medium text-white/80">{entry.bidder}</span>
                                  <span className="text-white/50">{formatRelativeTime(entry.time)}</span>
                                </div>
                                <span className="font-semibold text-white">{formatCurrency(entry.amount)}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-white/40">Be the first to bid</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
