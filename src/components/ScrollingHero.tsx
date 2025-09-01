const ScrollingHero = () => {
  const scrollingItems = [
    "artist",
    "auctioneer", 
    "creator",
    "artist",
    "auctioneer",
    "creator"
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gallery-black">
      {/* Scrolling Text Background */}
      <div className="absolute inset-0 flex items-center">
        <div className="whitespace-nowrap">
          <div className="inline-flex items-center scroll-text">
            {/* First set */}
            {scrollingItems.map((item, index) => (
              <div key={`first-${index}`} className="inline-flex items-center">
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">
                  {item}
                </span>
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">
                  •
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {scrollingItems.map((item, index) => (
              <div key={`second-${index}`} className="inline-flex items-center">
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">
                  {item}
                </span>
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">
                  •
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 min-h-screen grid-kierkegaard">
        {/* Left Block - Introduction */}
        <div className="bg-gallery-black p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md fade-in-up">
            <p className="text-lg md:text-xl text-gallery-white/80 leading-relaxed mb-8">
              Adelaide contemporary artist pioneering social media art auctions, 
              bringing unique pieces directly to collectors through innovative 
              digital platforms.
            </p>
            <div className="space-y-4">
              <div className="text-sm text-gallery-white/60 uppercase tracking-wider">
                Current Focus
              </div>
              <div className="text-gallery-gold font-medium">
                Instagram • Facebook • Live Auctions
              </div>
            </div>
          </div>
        </div>

        {/* Right Block - Featured Work */}
        <div className="bg-charcoal p-8 md:p-16 flex flex-col justify-center fade-in-up delay-200">
          <div className="aspect-square bg-gallery-white/5 rounded-lg overflow-hidden mb-8 hover-glow">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gallery-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-gallery-gold text-2xl">♦</span>
                </div>
                <p className="text-gallery-white/60 text-sm">
                  Featured Artwork
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl text-gallery-white font-medium">
              Current Auction Series
            </h3>
            <p className="text-gallery-white/70 text-sm leading-relaxed">
              Explore contemporary pieces available through live social media auctions. 
              Each work represents a unique moment in digital art commerce.
            </p>
            <div className="pt-4">
              <a 
                href="#auctions" 
                className="inline-flex items-center text-gallery-gold text-sm hover:text-gallery-white transition-colors"
              >
                View Active Auctions
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center text-gallery-white/40">
          <div className="w-px h-12 bg-gallery-white/20 mb-4"></div>
          <span className="text-xs uppercase tracking-wider transform rotate-90 origin-center whitespace-nowrap">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

export default ScrollingHero;