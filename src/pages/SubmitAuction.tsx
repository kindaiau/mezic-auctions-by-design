import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { trackEventWithSource } from '@/lib/tracking';

export default function SubmitAuction() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    starting_bid: '',
    submitted_by: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Image too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast({
        title: 'Image required',
        description: 'Please upload an image of the artwork',
        variant: 'destructive',
      });
      return;
    }

    if (!endDate) {
      toast({
        title: 'End date required',
        description: 'Please select when the auction should end',
        variant: 'destructive',
      });
      return;
    }

    if (endDate <= new Date()) {
      toast({
        title: 'Invalid date',
        description: 'End date must be in the future',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Upload image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('auction-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('auction-images')
        .getPublicUrl(fileName);

      // Submit to database
      const { error: insertError } = await supabase
        .from('auction_submissions')
        .insert({
          title: formData.title,
          artist: formData.artist,
          description: formData.description || null,
          starting_bid: parseFloat(formData.starting_bid),
          end_time: endDate.toISOString(),
          image_url: publicUrl,
          submitted_by: formData.submitted_by || null,
        });

      if (insertError) throw insertError;

      trackEventWithSource('auction_submission_complete', {
        title: formData.title,
        artist: formData.artist,
        starting_bid: formData.starting_bid,
      });

      setSuccess(true);
      toast({
        title: 'Submission successful!',
        description: 'Your auction has been submitted for review.',
      });

      // Reset form
      setFormData({
        title: '',
        artist: '',
        description: '',
        starting_bid: '',
        submitted_by: '',
      });
      setImageFile(null);
      setImagePreview('');
      setEndDate(undefined);

    } catch (error: any) {
      console.error('Submission error:', error);
      trackEventWithSource('auction_submission_fail', {
        error: error.message,
      });
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Submission Received!</h1>
          <p className="text-muted-foreground text-lg">
            Your auction has been submitted and will be reviewed shortly.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setSuccess(false)}
              className="w-full"
              size="lg"
            >
              Submit Another Auction
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit New Auction</h1>
          <p className="text-muted-foreground text-lg">
            Fill out the details below to submit a new artwork for auction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-lg">Artwork Image *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <label htmlFor="image" className="cursor-pointer block">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Tap to upload photo</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG or WEBP (max 5MB)
                  </p>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg">Artwork Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Urban Dreams"
              required
              maxLength={100}
              className="text-lg h-12"
            />
          </div>

          {/* Artist */}
          <div className="space-y-2">
            <Label htmlFor="artist" className="text-lg">Artist Name *</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              placeholder="e.g., Vali Myers"
              required
              maxLength={100}
              className="text-lg h-12"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about this artwork..."
              maxLength={500}
              rows={4}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Starting Bid */}
          <div className="space-y-2">
            <Label htmlFor="starting_bid" className="text-lg">Starting Bid *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">$</span>
              <Input
                id="starting_bid"
                type="number"
                value={formData.starting_bid}
                onChange={(e) => setFormData({ ...formData, starting_bid: e.target.value })}
                placeholder="100"
                required
                min="1"
                step="0.01"
                className="text-lg h-12 pl-8"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-lg">Auction End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submitted By (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="submitted_by" className="text-lg">Your Name (Optional)</Label>
            <Input
              id="submitted_by"
              value={formData.submitted_by}
              onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
              placeholder="e.g., Mariana"
              maxLength={100}
              className="text-lg h-12"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg"
            size="lg"
          >
            {loading ? 'Submitting...' : 'Submit Auction'}
          </Button>
        </form>
      </div>
    </div>
  );
}
