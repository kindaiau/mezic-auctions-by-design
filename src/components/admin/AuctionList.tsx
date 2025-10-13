import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface AuctionListProps {
  auctions: any[];
  loading: boolean;
  onEdit: (auction: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function AuctionList({
  auctions,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}: AuctionListProps) {
  if (loading) {
    return <div className="text-center py-8">Loading auctions...</div>;
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No auctions yet. Create your first auction!
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Current Bid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auctions.map((auction) => (
            <TableRow key={auction.id}>
              <TableCell className="font-medium">{auction.title}</TableCell>
              <TableCell>{auction.artist}</TableCell>
              <TableCell>${auction.current_bid}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    auction.status === 'live'
                      ? 'default'
                      : auction.status === 'draft'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {auction.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(auction.end_time).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onStatusChange(
                        auction.id,
                        auction.status === 'live' ? 'draft' : 'live'
                      )
                    }
                  >
                    {auction.status === 'live' ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(auction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(auction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
