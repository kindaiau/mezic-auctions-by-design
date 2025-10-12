import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    bidAmount?: string;
    maximumBid?: string;
  }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};

    if (!bidderName.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!bidderEmail.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!validateEmail(bidderEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!bidAmount.trim()) {
      newErrors.bidAmount = 'Please enter a bid amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const amount = parseFloat(bidAmount);
      const ceiling = maximumBid ? parseFloat(maximumBid) : amount;

      if (isNaN(amount) || amount <= auction.currentBid) {
        setErrors({ bidAmount: `Bid must be higher than $${auction.currentBid}` });
        toast({
          title: 'Invalid bid',
          description: `Bid must be higher than $${auction.currentBid}`,
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      if (isNaN(ceiling) || ceiling < amount) {
        setErrors({ maximumBid: 'Maximum bid must be equal to or higher than your bid' });
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
      setErrors({});
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

  const handleClose = () => {
    setErrors({});
    setBidderName('');
    setBidderEmail('');
    setBidderPhone('');
    setBidAmount('');
    setMaximumBid('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Place Your Bid</DialogTitle>
          <DialogDescription>
            {auction.title} by {auction.artist}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={bidderName}
              onChange={(e) => {
                setBidderName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }));
                }
              }}
              required
              placeholder="John Doe"
              className="text-foreground"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={bidderEmail}
              onChange={(e) => {
                setBidderEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              required
              placeholder="john@example.com"
              className="text-foreground"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email}
              </p>
            )}
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
              autoComplete="tel"
              aria-describedby="phone-hint"
            />
            <p id="phone-hint" className="text-xs text-muted-foreground">
              For SMS notifications about your bid
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bid">Your Bid ($) *</Label>
            <Input
              id="bid"
              type="number"
              step="0.01"
              min={auction.currentBid + 0.01}
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(e.target.value);
                if (errors.bidAmount) {
                  setErrors(prev => ({ ...prev, bidAmount: undefined }));
                }
              }}
              required
              placeholder={`Minimum: $${auction.currentBid + 1}`}
              className="text-foreground"
              aria-invalid={Boolean(errors.bidAmount)}
              aria-describedby={errors.bidAmount ? 'bid-error' : 'bid-hint'}
            />
            {errors.bidAmount ? (
              <p id="bid-error" className="text-sm text-destructive" role="alert">
                {errors.bidAmount}
              </p>
            ) : (
              <p id="bid-hint" className="text-sm text-muted-foreground">
                Current bid: ${auction.currentBid}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxBid">Maximum Bid ($, optional)</Label>
            <Input
              id="maxBid"
              type="number"
              step="0.01"
              min={bidAmount ? parseFloat(bidAmount) : auction.currentBid + 0.01}
              value={maximumBid}
              onChange={(e) => {
                setMaximumBid(e.target.value);
                if (errors.maximumBid) {
                  setErrors(prev => ({ ...prev, maximumBid: undefined }));
                }
              }}
              placeholder="Let us proxy bid for you"
              className="text-foreground"
              aria-invalid={Boolean(errors.maximumBid)}
              aria-describedby={errors.maximumBid ? 'maxbid-error' : 'maxbid-hint'}
            />
            {errors.maximumBid ? (
              <p id="maxbid-error" className="text-sm text-destructive" role="alert">
                {errors.maximumBid}
              </p>
            ) : (
              <p id="maxbid-hint" className="text-sm text-muted-foreground">
                We'll mirror The Auction Collective's approach: your submitted bid is placed now, and we'll automatically bid in $1 increments up to this ceiling if competitors join.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1 py-3 min-h-[44px]"
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              variant="mez" 
              disabled={isSubmitting} 
              className="flex-1 py-3 min-h-[44px]"
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-pulse">PLACING...</span>
                  <span className="sr-only">Submitting your bid, please wait</span>
                </>
              ) : (
                'PLACE BID'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
