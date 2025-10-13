import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import AuctionList from './AuctionList';
import AuctionForm from './AuctionForm';

export default function AuctionManagement() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuction, setEditingAuction] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
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

  const handleEdit = (auction: any) => {
    setEditingAuction(auction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this auction?')) return;

    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Auction deleted successfully',
      });

      fetchAuctions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('auctions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Send notifications if auction is being published
      if (newStatus === 'live') {
        try {
          await supabase.functions.invoke('notify-auction-start', {
            body: { auctionId: id },
          });
          
          toast({
            title: 'Success',
            description: 'Auction published and subscribers notified via SMS',
          });
        } catch (notifyError: any) {
          console.error('Notification error:', notifyError);
          toast({
            title: 'Auction Published',
            description: 'Auction is live, but some notifications may have failed',
          });
        }
      } else {
        toast({
          title: 'Success',
          description: 'Auction status updated',
        });
      }

      fetchAuctions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAuction(null);
    fetchAuctions();
  };

  if (showForm) {
    return (
      <AuctionForm
        auction={editingAuction}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Auctions</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
      </div>

      <AuctionList
        auctions={auctions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
