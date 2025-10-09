const ScrollingHero = () => {
  const scrollingItems = Array(6).fill("club mez");

  const renderAnimatedText = (text: string) => (
    <span className="mx-8 md:mx-16">
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          className="text-hero text-gallery-white/10 inline-block opacity-0 animate-digital"
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-gallery-black">
      {/* Scrolling Text Background */}
      <div className="absolute inset-0 flex items-center">
        <div className="whitespace-nowrap">
          <div className="inline-flex items-center scroll-text">
            {/* First set */}
            {scrollingItems.map((item, index) => (
              <div key={`first-${index}`} className="inline-flex items-center">
                {renderAnimatedText(item)}
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">•</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {scrollingItems.map((item, index) => (
              <div key={`second-${index}`} className="inline-flex items-center">
                {renderAnimatedText(item)}
                <span className="text-hero text-gallery-white/10 mx-8 md:mx-16">•</span>
              </div>
            ))}
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

