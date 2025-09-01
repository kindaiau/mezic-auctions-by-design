import { Card, CardContent } from '@/components/ui/card';
import { Palette, Award, Users, MapPin } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gallery-white">
            About <span className="text-artist-gold">Mariana</span>
          </h2>
          <p className="text-xl text-gallery-white/80 max-w-3xl mx-auto">
            Adelaide-based contemporary artist exploring the intersection of digital culture and traditional art forms through innovative social media auctions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Artist Photo/Info */}
          <div className="space-y-6">
            <div className="relative">
              <div className="w-full h-96 bg-charcoal rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-16 h-16 text-artist-gold mx-auto mb-4" />
                  <p className="text-gallery-white/70">Artist Portrait</p>
                  <p className="text-gallery-white/50 text-sm">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gallery-white">
              Contemporary Vision, Digital Innovation
            </h3>
            <p className="text-gallery-white/80 leading-relaxed">
              Mariana Mezic is redefining how art reaches collectors in the digital age. Based in Adelaide, Australia, she has pioneered a new approach to art sales by conducting live auctions through social media platforms, making contemporary art more accessible and engaging for a global audience.
            </p>
            <p className="text-gallery-white/80 leading-relaxed">
              Her work spans multiple mediums, from vibrant abstract paintings to sculptural ceramics and mixed media installations. Each piece reflects her commitment to pushing creative boundaries while maintaining a deep connection to traditional artistic values.
            </p>
            <p className="text-gallery-white/80 leading-relaxed">
              Through her innovative auction format, Mariana has built a community of collectors who appreciate both the artistry and the unique experience of bidding in real-time through social platforms.
            </p>
          </div>
        </div>

        {/* Stats/Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-charcoal border-artist-gold/20 text-center">
            <CardContent className="pt-6">
              <Palette className="w-8 h-8 text-artist-gold mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gallery-white mb-2">200+</h4>
              <p className="text-gallery-white/70">Works Created</p>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-artist-gold/20 text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-artist-gold mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gallery-white mb-2">50+</h4>
              <p className="text-gallery-white/70">Successful Auctions</p>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-artist-gold/20 text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-artist-gold mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gallery-white mb-2">500+</h4>
              <p className="text-gallery-white/70">Active Collectors</p>
            </CardContent>
          </Card>

          <Card className="bg-charcoal border-artist-gold/20 text-center">
            <CardContent className="pt-6">
              <MapPin className="w-8 h-8 text-artist-gold mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gallery-white mb-2">Global</h4>
              <p className="text-gallery-white/70">Reach</p>
            </CardContent>
          </Card>
        </div>

        {/* Artistic Philosophy */}
        <div className="bg-gradient-to-r from-charcoal to-charcoal-light rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gallery-white mb-6 text-center">
            Artistic Philosophy
          </h3>
          <blockquote className="text-xl text-gallery-white/90 italic text-center max-w-4xl mx-auto leading-relaxed">
            "Art should be a conversation, not a monologue. By bringing auctions to social media, 
            I'm creating a space where the community becomes part of the artistic process—where the 
            excitement of discovery and the joy of ownership happen together in real-time."
          </blockquote>
          <p className="text-center text-artist-gold mt-6 font-semibold">— Mariana Mezic</p>
        </div>
      </div>
    </section>
  );
};

export default About;