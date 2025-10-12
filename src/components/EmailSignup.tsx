import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const EmailSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ name?: string; contact?: string; submit?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    if (!name.trim()) {
      setErrors({ name: 'Please enter your name.' });
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrors({ contact: 'Enter either an email or phone number to receive auction alerts.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { name, email, phone }
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'error' in data && data.error) {
        throw new Error(String(data.error));
      }

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
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Please try again later or contact us directly.';
      setErrors({ submit: message });
      toast({
        title: "Subscription failed",
        description: message,
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
            Stay <span className="text-artist-gold">Informed</span>
          </h2>
          <p className="text-xl text-gallery-white/80 max-w-2xl mx-auto">
            Get notified about new auctions, exclusive previews, and behind-the-scenes content from Mariana's studio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Signup Form */}
          <div className="max-w-2xl mx-auto w-full">
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
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors(prev => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Your name"
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={cn(
                          "bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold",
                          errors.name && "border-destructive focus:border-destructive"
                        )}
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-2 text-sm text-destructive" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gallery-white mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.contact) {
                            setErrors(prev => ({ ...prev, contact: undefined }));
                          }
                        }}
                        placeholder="your.email@example.com"
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={errors.contact ? 'contact-error' : undefined}
                        className={cn(
                          "bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold",
                          errors.contact && "border-destructive focus:border-destructive"
                        )}
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
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.contact) {
                            setErrors(prev => ({ ...prev, contact: undefined }));
                          }
                        }}
                        placeholder="+61 4XX XXX XXX"
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={errors.contact ? 'contact-error' : undefined}
                        className={cn(
                          "bg-black/80 border-artist-gold/30 text-gallery-white placeholder:text-gallery-white/50 focus:border-artist-gold",
                          errors.contact && "border-destructive focus:border-destructive"
                        )}
                      />
                      <p className="text-xs text-gallery-white/60 mt-1">
                        For urgent auction notifications via SMS
                      </p>
                      {errors.contact && (
                        <p id="contact-error" className="mt-2 text-sm text-destructive" role="alert">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="mez"
                      className="w-full py-4 text-sm uppercase tracking-tight"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBSCRIBING...' : 'GET AUCTION ALERTS'}
                    </Button>

                    {errors.submit && (
                      <p className="text-sm text-destructive text-center" role="alert">
                        {errors.submit}
                      </p>
                    )}

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