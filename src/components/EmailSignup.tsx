import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!email && !phone) {
      toast({
        title: "Please provide contact information",
        description: "Enter either an email or phone number to receive auction alerts.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { name, email, phone }
      });

      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive alerts about upcoming auctions.",
      });
      
      // Reset form after success
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setIsSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="subscribe" className="py-20 px-4 bg-transparent">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gallery-white">
            Get Auction Alerts First
          </h2>
          <p className="text-xl text-gallery-white/80 max-w-2xl mx-auto">
            Reserve a front-row seat for Mariana&apos;s drops. We send one sharp alert when bidding opens, plus the occasional studio story you won&apos;t find on social.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,1fr] gap-10 items-start">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gallery-white uppercase tracking-[0.2em]">
                What you&apos;ll receive
              </h3>
              <p className="text-gallery-white/75 text-base leading-relaxed">
                Carefully timed reminders, provenance notes, and market insights that help you plan your bids instead of reacting last-minute.
              </p>
            </div>
            <div className="space-y-4 text-left text-gallery-white/80">
              <p className="leading-relaxed">
                <span className="text-gallery-white font-medium">Launch-day countdowns:</span> precise timing updates so you never miss opening bids.
              </p>
              <p className="leading-relaxed">
                <span className="text-gallery-white font-medium">Condition &amp; provenance notes:</span> the story behind each piece before it hits the lot page.
              </p>
              <p className="leading-relaxed">
                <span className="text-gallery-white font-medium">Private studio previews:</span> occasional behind-the-scenes looks reserved for collectors and bidders.
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="w-full">
            <Card className="bg-charcoal-light border-artist-gold/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gallery-white text-center">
                  Join the Auction Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-artist-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gallery-white mb-2">
                      Welcome to the community!
                    </h3>
                    <p className="text-gallery-white/80">
                      You'll receive your first auction alert soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gallery-white mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gallery-white mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gallery-white mb-2">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+61 4XX XXX XXX"
                        className="bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
                      />
                      <p className="text-xs text-gallery-white/60 mt-1">
                        For urgent auction notifications via SMS
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="mez"
                      className="w-full py-4 text-sm uppercase tracking-tight"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBSCRIBING...' : 'GET AUCTION ALERTS'}
                    </Button>

                    <p className="text-xs text-gallery-white/60 text-center">
                      By subscribing, you agree to receive marketing communications.
                      You can unsubscribe at any time.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailSignup;