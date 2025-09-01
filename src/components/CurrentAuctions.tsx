import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Instagram, Facebook } from 'lucide-react';
import auctionArt1 from '@/assets/auction-artwork-1.jpg';
import auctionArt2 from '@/assets/auction-artwork-2.jpg';
import auctionArt3 from '@/assets/auction-artwork-3.jpg';

const CurrentAuctions = () => {
  const auctions = [
    {
      id: 1,
      title: "Vibrant Abstractions Series #3",
      image: auctionArt1,
      currentBid: 450,
      startingBid: 200,
      endTime: "2024-02-15T18:00:00",
      medium: "Acrylic on Canvas",
      dimensions: "60cm x 80cm",
      description: "Bold geometric forms dance across the canvas in this stunning piece from the Vibrant Abstractions series.",
      status: "active"
    },
    {
      id: 2,
      title: "Ceramic Flow Sculpture",
      image: auctionArt2,
      currentBid: 680,
      startingBid: 350,
      endTime: "2024-02-18T20:00:00",
      medium: "Glazed Ceramic",
      dimensions: "30cm x 25cm x 40cm",
      description: "An organic sculpture that captures the essence of flowing water in solid form.",
      status: "active"
    },
    {
      id: 3,
      title: "Mixed Media Collage #12",
      image: auctionArt3,
      currentBid: 320,
      startingBid: 150,
      endTime: "2024-02-20T19:00:00",
      medium: "Mixed Media",
      dimensions: "50cm x 70cm",
      description: "Textural exploration combining traditional and contemporary materials.",
      status: "active"
    }
  ];

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return "Auction Ended";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <section id="auctions" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gallery-white">
            Current <span className="text-artist-gold">Auctions</span>
          </h2>
          <p className="text-xl text-gallery-white/80 max-w-2xl mx-auto mb-8">
            Bid on these exclusive pieces through Instagram and Facebook. Follow the links to participate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gallery" size="lg">
              <Instagram className="w-5 h-5 mr-2" />
              Bid on Instagram
            </Button>
            <Button variant="gallery" size="lg">
              <Facebook className="w-5 h-5 mr-2" />
              Bid on Facebook
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auctions.map((auction) => (
            <Card 
              key={auction.id} 
              className="bg-charcoal border-artist-gold/20 hover:border-artist-gold/60 transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={auction.image} 
                  alt={auction.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-artist-gold text-gallery-black">
                    {auction.status === 'active' ? 'Live Auction' : 'Ended'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-gallery-white text-lg">
                  {auction.title}
                </CardTitle>
                <div className="flex items-center text-artist-gold text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {getTimeRemaining(auction.endTime)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gallery-white/80 text-sm leading-relaxed">
                  {auction.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gallery-white/70">Medium:</span>
                    <span className="text-gallery-white">{auction.medium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gallery-white/70">Dimensions:</span>
                    <span className="text-gallery-white">{auction.dimensions}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-artist-gold/20">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gallery-white/70 text-sm">Current Bid</p>
                      <p className="text-2xl font-bold text-artist-gold">${auction.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gallery-white/70 text-sm">Starting Bid</p>
                      <p className="text-gallery-white">${auction.startingBid}</p>
                    </div>
                  </div>
                  
                  <Button variant="auction" className="w-full">
                    Place Bid on Social Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gallery-white mb-4">
            How to Bid
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-artist-gold text-gallery-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h4 className="text-lg font-semibold text-gallery-white mb-2">Follow</h4>
              <p className="text-gallery-white/80">Follow @mariana.mezic on Instagram or Facebook</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-artist-gold text-gallery-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h4 className="text-lg font-semibold text-gallery-white mb-2">Comment</h4>
              <p className="text-gallery-white/80">Comment your bid amount on the auction post</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-artist-gold text-gallery-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h4 className="text-lg font-semibold text-gallery-white mb-2">Win</h4>
              <p className="text-gallery-white/80">Highest bidder when the auction ends wins!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentAuctions;