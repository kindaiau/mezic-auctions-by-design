import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, CheckCircle } from 'lucide-react';
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
            Stay <span className="text-artist-gold">Updated</span>
          </h2>
          <p className="text-xl text-gallery-white/80 max-w-2xl mx-auto">
            Get notified about new auctions, exclusive previews, and behind-the-scenes content from Mariana's studio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-artist-gold/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-artist-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gallery-white mb-2">
                  Auction Alerts
                </h3>
                <p className="text-gallery-white/70">
                  Be the first to know when new pieces go up for auction
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-artist-gold/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-artist-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gallery-white mb-2">
                  SMS Notifications
                </h3>
                <p className="text-gallery-white/70">
                  Instant text alerts for time-sensitive auction updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-artist-gold/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-artist-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gallery-white mb-2">
                  Exclusive Access
                </h3>
                <p className="text-gallery-white/70">
                  Early previews and behind-the-scenes studio content
                </p>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div className="lg:col-span-2">
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
                        className="bg-charcoal border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
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
                        className="bg-charcoal border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
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
                        className="bg-charcoal border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold"
                      />
                      <p className="text-xs text-gallery-white/60 mt-1">
                        For urgent auction notifications via SMS
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Get Auction Alerts'}
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