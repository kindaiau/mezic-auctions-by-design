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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= auction.currentBid) {
        toast({
          title: 'Invalid bid',
          description: `Bid must be higher than $${auction.currentBid}`,
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
          bidAmount: amount
        }
      });

      if (error) throw error;

      toast({
        title: 'Bid placed!',
        description: `Your bid of $${amount} has been placed successfully.`
      });

      onBidPlaced();
      onClose();
      
      // Reset form
      setBidderName('');
      setBidderEmail('');
      setBidderPhone('');
      setBidAmount('');
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to place bid',
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
            />
            <p className="text-sm text-muted-foreground">
              Current bid: ${auction.currentBid}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
