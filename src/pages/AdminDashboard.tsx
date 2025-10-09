import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Auction {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  image_url: string;
  starting_bid: number;
  current_bid: number;
  end_time: string;
  status: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    image_url: '',
    starting_bid: '',
    end_time: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAuctions();
    }
  }, [isAdmin]);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load auctions',
      });
    } else {
      setAuctions(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('auctions').insert([
      {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        image_url: formData.image_url,
        starting_bid: parseFloat(formData.starting_bid),
        current_bid: parseFloat(formData.starting_bid),
        end_time: formData.end_time,
        status: 'live',
      },
    ]);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Auction created successfully',
      });
      setShowForm(false);
      setFormData({
        title: '',
        artist: '',
        description: '',
        image_url: '',
        starting_bid: '',
        end_time: '',
      });
      fetchAuctions();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('auctions')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success',
        description: `Auction ${status}`,
      });
      fetchAuctions();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/')}>View Site</Button>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>
        </div>

        <div className="mb-8">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create New Auction'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg mb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starting_bid">Starting Bid ($)</Label>
              <Input
                id="starting_bid"
                type="number"
                step="0.01"
                value={formData.starting_bid}
                onChange={(e) => setFormData({ ...formData, starting_bid: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>

            <Button type="submit">Create Auction</Button>
          </form>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Auctions</h2>
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-card p-6 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{auction.title}</h3>
                <p className="text-muted-foreground">by {auction.artist}</p>
                <p className="mt-2">Current Bid: ${auction.current_bid}</p>
                <p className="text-sm text-muted-foreground">Status: {auction.status}</p>
              </div>
              <div className="flex gap-2">
                {auction.status === 'draft' && (
                  <Button onClick={() => updateStatus(auction.id, 'live')}>Go Live</Button>
                )}
                {auction.status === 'live' && (
                  <Button variant="outline" onClick={() => updateStatus(auction.id, 'ended')}>
                    End Auction
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
