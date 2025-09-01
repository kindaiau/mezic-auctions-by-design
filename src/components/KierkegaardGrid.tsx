import auctionArt1 from '@/assets/auction-artwork-1.jpg';
import auctionArt2 from '@/assets/auction-artwork-2.jpg';
import auctionArt3 from '@/assets/auction-artwork-3.jpg';

const KierkegaardGrid = () => {
  const artworks = [
    {
      id: 1,
      title: "Abstract Convergence #12",
      image: auctionArt1,
      description: "Bold geometric forms dance across the canvas in this stunning piece exploring contemporary abstractions.",
      currentBid: 450,
      status: "Active",
      endTime: "2024-02-15"
    },
    {
      id: 2,
      title: "Ceramic Meditation",
      image: auctionArt2,
      description: "An organic sculpture capturing the essence of flowing movement in glazed ceramic form.",
      currentBid: 680,
      status: "Active", 
      endTime: "2024-02-18"
    },
    {
      id: 3,
      title: "Mixed Narratives",
      image: auctionArt3,
      description: "Textural exploration combining traditional materials with contemporary artistic vision.",
      currentBid: 320,
      status: "Active",
      endTime: "2024-02-20"
    }
  ];

  return (
    <section id="work" className="py-0">
      {/* Grid Layout - Kierkegaard Style */}
      <div className="grid-kierkegaard">
        {artworks.map((artwork, index) => (
          <div 
            key={artwork.id}
            className={`group relative bg-gallery-black hover:bg-charcoal transition-colors duration-500 fade-in-up delay-${(index + 1) * 100}`}
          >
            {/* Artwork Image */}
            <div className="aspect-square overflow-hidden">
              <img 
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gallery-black/0 group-hover:bg-gallery-black/80 transition-all duration-500 flex items-end">
                <div className="p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl text-gallery-white font-medium">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-gallery-white/70 leading-relaxed max-w-md">
                        {artwork.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gallery-white/20">
                      <div>
                        <div className="text-xs text-gallery-white/50 uppercase tracking-wider">
                          Current Bid
                        </div>
                        <div className="text-gallery-gold font-medium">
                          ${artwork.currentBid}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-gallery-white/50 uppercase tracking-wider">
                          Status
                        </div>
                        <div className="text-gallery-white text-sm">
                          {artwork.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href="#bid" 
                        className="inline-flex items-center text-gallery-white text-sm hover:text-gallery-gold transition-colors"
                      >
                        Place Bid
                        <span className="ml-2">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Call to Action Block */}
        <div className="bg-charcoal p-8 md:p-16 flex flex-col justify-center fade-in-up delay-400">
          <div className="max-w-md">
            <h2 className="text-large text-gallery-white mb-6">
              Join the Auction
            </h2>
            <p className="text-gallery-white/70 leading-relaxed mb-8">
              Participate in live auctions through Instagram and Facebook. 
              Be part of a community that values contemporary art and innovative collecting.
            </p>
            
            <div className="space-y-4">
              <a 
                href="#subscribe" 
                className="inline-block text-gallery-gold hover:text-gallery-white transition-colors border-b border-gallery-gold/30 hover:border-gallery-white/30 pb-1"
              >
                Get Auction Alerts
              </a>
              
              <div className="pt-4 space-y-2 text-sm text-gallery-white/60">
                <div>Follow @mez.auctions</div>
                <div>Instagram • Facebook</div>
              </div>
            </div>
          </div>
        </div>

        {/* About Block */}
        <div className="bg-gallery-black p-8 md:p-16 flex flex-col justify-center fade-in-up delay-500">
          <div className="max-w-md">
            <div className="space-y-6">
              <div>
                <div className="text-xs text-gallery-white/50 uppercase tracking-wider mb-2">
                  About the Artist
                </div>
                <h3 className="text-xl text-gallery-white mb-4">
                  Contemporary Vision
                </h3>
              </div>
              
              <p className="text-gallery-white/70 leading-relaxed">
                Based in Adelaide, Mez is reimagining how contemporary art reaches collectors. 
                Through social media auctions, each piece becomes part of a larger conversation 
                about art, community, and digital commerce.
              </p>
              
              <div className="pt-4">
                <a 
                  href="#about" 
                  className="inline-flex items-center text-gallery-gold text-sm hover:text-gallery-white transition-colors"
                >
                  Learn More
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Block */}
        <div className="bg-charcoal p-8 md:p-16 flex flex-col justify-center fade-in-up delay-600">
          <div className="max-w-md">
            <h3 className="text-xl text-gallery-white mb-6">
              Stay Connected
            </h3>
            
            <div className="space-y-4">
              <div>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-gallery-black/50 border border-gallery-white/20 text-gallery-white placeholder:text-gallery-white/50 px-4 py-3 text-sm focus:border-gallery-gold focus:outline-none transition-colors"
                />
              </div>
              
              <button className="w-full bg-gallery-white text-gallery-black py-3 text-sm font-medium hover:bg-gallery-gold transition-colors">
                Subscribe to Auction Alerts
              </button>
              
              <p className="text-xs text-gallery-white/50 leading-relaxed">
                Receive notifications about new auctions, exclusive previews, 
                and behind-the-scenes content from the studio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KierkegaardGrid;