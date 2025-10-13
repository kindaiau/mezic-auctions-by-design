import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, LogOut } from 'lucide-react';
import AuctionForm from '@/components/admin/AuctionForm';
import AuctionList from '@/components/admin/AuctionList';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAuction, setEditingAuction] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase.rpc('is_current_user_admin');
    
    if (error || !data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    setIsAdmin(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEdit = (auction: any) => {
    setEditingAuction(auction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAuction(null);
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage auction pieces</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          {!showForm ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Auctions</CardTitle>
                    <CardDescription>View and manage all auction pieces</CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Auction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AuctionList onEdit={handleEdit} />
              </CardContent>
            </Card>
          ) : (
            <AuctionForm 
              auction={editingAuction} 
              onClose={handleFormClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
