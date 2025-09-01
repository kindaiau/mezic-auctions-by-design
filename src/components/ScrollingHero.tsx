const ScrollingHero = () => {
  const renderAnimatedLetters = (text: string) => (
    <span>
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          className="inline-block opacity-0 animate-digital"
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );

  return (
    <section className="bg-gallery-black">
      {/* Hero Heading */}
      <div className="relative flex items-center justify-center min-h-screen">
        <h2 className="text-hero text-gallery-white uppercase">
          {renderAnimatedLetters('auction')}
        </h2>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center text-gallery-white/40">
            <div className="w-px h-12 bg-gallery-white/20 mb-4"></div>
            <span className="text-xs uppercase tracking-wider transform rotate-90 origin-center whitespace-nowrap">
              Scroll
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid-kierkegaard">
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
              <div className="text-gallery-white font-medium">
                Instagram • Facebook • Live Auctions
              </div>
            </div>
          </div>
        </div>

        {/* Right Block - Featured Work */}
        <div className="bg-charcoal p-8 md:p-16 flex flex-col justify-center fade-in-up delay-200">
          <div className="aspect-square bg-gallery-white/5 rounded-lg overflow-hidden mb-8 hover-glow">
            <img
              src="https://marianamezic.com/cdn/shop/files/24E6E4FC-13CA-4D4C-AA56-0D8C3739BB33.jpg?v=1747023089"
              alt="Featured Mez artwork"
              className="w-full h-full object-cover"
            />
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
                className="inline-flex items-center text-gallery-white text-sm hover:text-gallery-white/70 transition-colors"
              >
                View Active Auctions
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollingHero;

