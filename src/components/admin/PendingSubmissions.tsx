import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Submission {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  starting_bid: number;
  end_time: string;
  image_url: string | null;
  status: string;
  submitted_by: string | null;
  submitted_at: string;
  admin_notes: string | null;
}

export default function PendingSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('auction_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
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

  const handleApprove = async (submission: Submission) => {
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Create auction from submission as live
      const { data: newAuction, error: auctionError } = await supabase
        .from('auctions')
        .insert({
          title: submission.title,
          artist: submission.artist,
          description: submission.description,
          starting_bid: submission.starting_bid,
          current_bid: submission.starting_bid,
          end_time: submission.end_time,
          image_url: submission.image_url,
          status: 'live',
        })
        .select()
        .single();

      if (auctionError) throw auctionError;

      // Update submission status
      const { error: updateError } = await supabase
        .from('auction_submissions')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      // Notify subscribers about the new live auction
      if (newAuction?.id) {
        try {
          await supabase.functions.invoke('notify-auction-start', {
            body: { auctionId: newAuction.id },
          });
        } catch (notifyError) {
          console.error('Failed to send notifications:', notifyError);
          // Don't fail the whole operation if notifications fail
        }
      }

      toast({
        title: 'Approved & Live!',
        description: `"${submission.title}" is now live and subscribers have been notified.`,
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('auction_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: rejectNotes,
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast({
        title: 'Rejected',
        description: `"${selectedSubmission.title}" has been rejected.`,
      });

      setShowReject(false);
      setRejectNotes('');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (submission: Submission) => {
    if (!confirm(`Are you sure you want to delete "${submission.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('auction_submissions')
        .delete()
        .eq('id', submission.id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Submission has been permanently deleted.',
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No pending submissions</p>
        <p className="text-sm text-muted-foreground mt-2">
          Share the submission form: <strong>mezart.com/submit-auction</strong>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Pending Submissions ({submissions.length})
          </h2>
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              {submission.image_url && (
                <img
                  src={submission.image_url}
                  alt={submission.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{submission.title}</h3>
                  <p className="text-sm text-muted-foreground">{submission.artist}</p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Starting Bid:</strong> ${submission.starting_bid}
                  </p>
                  <p>
                    <strong>Ends:</strong>{' '}
                    {format(new Date(submission.end_time), 'PPP')}
                  </p>
                  {submission.submitted_by && (
                    <p>
                      <strong>Submitted by:</strong> {submission.submitted_by}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(submission.submitted_at), 'PPp')}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowPreview(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleApprove(submission)}
                    disabled={actionLoading}
                    size="sm"
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setShowReject(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleDelete(submission)}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Preview</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              {selectedSubmission.image_url && (
                <img
                  src={selectedSubmission.image_url}
                  alt={selectedSubmission.title}
                  className="w-full rounded-lg"
                />
              )}
              <div className="space-y-2">
                <div>
                  <Label>Title</Label>
                  <p className="text-lg font-semibold">{selectedSubmission.title}</p>
                </div>
                <div>
                  <Label>Artist</Label>
                  <p>{selectedSubmission.artist}</p>
                </div>
                {selectedSubmission.description && (
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm">{selectedSubmission.description}</p>
                  </div>
                )}
                <div>
                  <Label>Starting Bid</Label>
                  <p className="text-xl font-bold">${selectedSubmission.starting_bid}</p>
                </div>
                <div>
                  <Label>End Time</Label>
                  <p>{format(new Date(selectedSubmission.end_time), 'PPP p')}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedSubmission) {
                  handleApprove(selectedSubmission);
                  setShowPreview(false);
                }
              }}
              disabled={actionLoading}
            >
              Approve & Create Auction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject "{selectedSubmission?.title}"?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notes">Rejection Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading}
            >
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
