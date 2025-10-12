import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: {
    id: string;
    title: string;
    artist: string;
    currentBid: number;
  };
  onBidPlaced: () => void;
}

export function BidModal({ isOpen, onClose, auction, onBidPlaced }: BidModalProps) {
  const [bidderName, setBidderName] = useState('');
  const [bidderEmail, setBidderEmail] = useState('');
  const [bidderPhone, setBidderPhone] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [maximumBid, setMaximumBid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(bidAmount);
      const ceiling = maximumBid ? parseFloat(maximumBid) : amount;

      if (isNaN(amount) || amount <= auction.currentBid) {
        toast({
          title: 'Invalid bid',
          description: `Bid must be higher than $${auction.currentBid}`,
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      if (isNaN(ceiling) || ceiling < amount) {
        toast({
          title: 'Invalid maximum',
          description: 'Your maximum bid must be equal to or higher than your submitted bid.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('place-bid', {
        body: {
          auctionId: auction.id,
          bidderName,
          bidderEmail,
          bidderPhone,
          bidAmount: amount,
          maximumBid: ceiling
        }
      });

      if (error) throw error;

      const response = data as {
        status?: 'leading' | 'outbid';
        currentBid?: number;
        bid?: { maximumAmount?: number; submittedAmount?: number };
      } | null;

      const max = response?.bid?.maximumAmount ?? ceiling;
      const current = response?.currentBid ?? amount;

      if (response?.status === 'outbid') {
        toast({
          title: 'Bid received — currently outbid',
          description: `We saved your proxy ceiling of $${max.toFixed(2)}. Another collector is leading at $${current.toFixed(2)}, but we'll automatically raise your offer in $1 increments (just like The Auction Collective) if things change.`
        });
      } else {
        toast({
          title: 'Proxy bid active!',
          description: `You're leading at $${current.toFixed(2)}. We'll automatically increase your bid in $1 steps up to your $${max.toFixed(2)} ceiling, following The Auction Collective's proxy guidelines.`
        });
      }

      onBidPlaced();
      onClose();

      // Reset form
      setBidderName('');
      setBidderEmail('');
      setBidderPhone('');
      setBidAmount('');
      setMaximumBid('');
    } catch (error: unknown) {
      console.error('Error placing bid:', error);
      const message = error instanceof Error ? error.message : 'Failed to place bid';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Place Your Bid</DialogTitle>
          <DialogDescription>
            {auction.title} by {auction.artist}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={bidderName}
              onChange={(e) => setBidderName(e.target.value)}
              required
              placeholder="John Doe"
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={bidderEmail}
              onChange={(e) => setBidderEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={bidderPhone}
              onChange={(e) => setBidderPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bid">Your Bid ($)</Label>
            <Input
              id="bid"
              type="number"
              step="0.01"
              min={auction.currentBid + 0.01}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
              placeholder={`Minimum: $${auction.currentBid + 1}`}
              className="text-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Current bid: ${auction.currentBid}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxBid">Maximum Bid ($, optional)</Label>
            <Input
              id="maxBid"
              type="number"
              step="0.01"
              min={bidAmount ? parseFloat(bidAmount) : auction.currentBid + 0.01}
              value={maximumBid}
              onChange={(e) => setMaximumBid(e.target.value)}
              placeholder="Let us proxy bid for you"
              className="text-foreground"
            />
            <p className="text-sm text-muted-foreground">
              We'll mirror The Auction Collective's approach: your submitted bid is placed now, and we'll automatically bid in $1 increments up to this ceiling if competitors join.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-3">
              CANCEL
            </Button>
            <Button type="submit" variant="mez" disabled={isSubmitting} className="flex-1 py-3">
              {isSubmitting ? 'PLACING...' : 'PLACE BID'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
