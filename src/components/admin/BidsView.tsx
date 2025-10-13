import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function BidsView() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          auctions (
            title,
            artist
          )
        `)
        .order('bid_time', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bids...</div>;
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bids yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">All Bids</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auction</TableHead>
              <TableHead>Bidder Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Bid Amount</TableHead>
              <TableHead>Max Bid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{bid.auctions?.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {bid.auctions?.artist}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{bid.bidder_name}</TableCell>
                <TableCell>{bid.bidder_email}</TableCell>
                <TableCell>{bid.bidder_phone || '-'}</TableCell>
                <TableCell>${bid.bid_amount}</TableCell>
                <TableCell>${bid.maximum_bid_amount}</TableCell>
                <TableCell className="capitalize">{bid.status}</TableCell>
                <TableCell>
                  {new Date(bid.bid_time).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
