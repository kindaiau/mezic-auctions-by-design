import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface AuctionFormProps {
  auction?: any;
  onClose: () => void;
}

export default function AuctionForm({ auction, onClose }: AuctionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: auction?.title || '',
    artist: auction?.artist || '',
    description: auction?.description || '',
    starting_bid: auction?.starting_bid || '',
    end_time: auction?.end_time ? new Date(auction.end_time).toISOString().slice(0, 16) : '',
    status: auction?.status || 'draft',
    image_url: auction?.image_url || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('auction-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('auction-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const auctionData = {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        starting_bid: parseFloat(formData.starting_bid),
        current_bid: auction ? undefined : parseFloat(formData.starting_bid),
        end_time: new Date(formData.end_time).toISOString(),
        status: formData.status,
        image_url: imageUrl,
      };

      if (auction) {
        const { error } = await supabase
          .from('auctions')
          .update(auctionData)
          .eq('id', auction.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Auction updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('auctions')
          .insert([auctionData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Auction created successfully',
        });
      }

      onClose();
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

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onClose}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Auctions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{auction ? 'Edit Auction' : 'Create Auction'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="end_time">End Date & Time</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {formData.image_url && !imageFile && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <img
                  src={formData.image_url}
                  alt="Current auction"
                  className="w-48 h-48 object-cover rounded"
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : auction ? 'Update Auction' : 'Create Auction'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
