import { Button } from '@/components/ui/button';
import heroArtwork from '@/assets/hero-artwork.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroArtwork} 
          alt="Abstract artwork by Mariana Mezic" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gallery-black/70 via-gallery-black/50 to-gallery-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gallery-white">
          Art <span className="text-artist-gold">Auctions</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-8 text-gallery-white/90 max-w-2xl mx-auto">
          Discover unique pieces by Adelaide artist Mariana Mezic through exclusive social media auctions
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => document.getElementById('auctions')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Current Auctions
          </Button>
          <Button 
            variant="gallery" 
            size="lg"
            onClick={() => document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Auction Alerts
          </Button>
        </div>

        {/* Social Media Links */}
        <div className="mt-12 flex justify-center space-x-6">
          <a 
            href="https://instagram.com/mariana.mezic" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gallery-white hover:text-artist-gold transition-colors"
          >
            <span className="text-sm">Follow on Instagram</span>
          </a>
          <a 
            href="https://facebook.com/mariana.mezic" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gallery-white hover:text-artist-gold transition-colors"
          >
            <span className="text-sm">Like on Facebook</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gallery-white/70 animate-bounce">
        <div className="w-1 h-8 bg-artist-gold/50 rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;