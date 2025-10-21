import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { trackEmailSignupView, trackEmailSignupSubmit, trackEmailSignupSuccess } from '@/lib/tracking';
import { z } from 'zod';

// Validation schema matching server-side validation
const subscribeSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .trim()
    .regex(/^[\d\s+()-]*$/, { message: "Invalid phone number format" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => data.email || data.phone,
  { message: "Either email or phone number is required", path: ["contact"] }
);
const EmailSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasTrackedView = useRef(false);
  const {
    toast
  } = useToast();
  const [errors, setErrors] = useState<{
    name?: string;
    contact?: string;
    submit?: string;
  }>({});

  // Track email signup form view
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          trackEmailSignupView();
        }
      });
    }, observerOptions);

    const signupSection = document.getElementById('subscribe');
    if (signupSection) {
      observer.observe(signupSection);
    }

    return () => observer.disconnect();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate using zod schema
    const validationResult = subscribeSchema.safeParse({ name, email, phone });
    
    if (!validationResult.success) {
      const fieldErrors: { name?: string; contact?: string } = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0] === 'name') {
          fieldErrors.name = err.message;
        } else if (err.path[0] === 'email' || err.path[0] === 'phone' || err.path[0] === 'contact') {
          fieldErrors.contact = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Track signup submission
    trackEmailSignupSubmit();
    
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('subscribe-newsletter', {
        body: {
          name,
          email,
          phone
        }
      });
      if (error) throw error;
      if (data && typeof data === 'object' && 'error' in data && data.error) {
        throw new Error(String(data.error));
      }
      
      // Track successful signup
      trackEmailSignupSuccess();
      
      setIsSuccess(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive alerts about upcoming auctions."
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
      setErrors({
        submit: message
      });
      toast({
        title: "Subscription failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="subscribe" className="pt-8 pb-20 px-4 bg-transparent">
      <div className="container mx-auto max-w-md">
        <Card className="bg-[#3a3f47] border-none shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-white">
              Join the Auction Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSuccess ? <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-artist-gold mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gallery-white mb-2">
                  Welcome to the community!
                </h3>
                <p className="text-gallery-white/80">
                  You'll receive your first auction alert soon.
                </p>
              </div> : <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input id="name" type="text" value={name} onChange={e => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({
                    ...prev,
                    name: undefined
                  }));
                }
              }} placeholder="Your name" required autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} className={cn("bg-[#2a2e35] border-none text-white placeholder:text-gray-500 h-11", errors.name && "border-destructive focus:border-destructive focus-visible:ring-destructive")} />
                  {errors.name && <p id="name-error" className="mt-2 text-sm text-destructive" role="alert">
                      {errors.name}
                    </p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input id="email" type="email" value={email} onChange={e => {
                setEmail(e.target.value);
                if (errors.contact) {
                  setErrors(prev => ({
                    ...prev,
                    contact: undefined
                  }));
                }
              }} placeholder="your.email@example.com" autoComplete="email" aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : undefined} className={cn("bg-[#2a2e35] border-none text-white placeholder:text-gray-500 h-11", errors.contact && "border-destructive focus:border-destructive focus-visible:ring-destructive")} />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input id="phone" type="tel" value={phone} onChange={e => {
                setPhone(e.target.value);
                if (errors.contact) {
                  setErrors(prev => ({
                    ...prev,
                    contact: undefined
                  }));
                }
              }} placeholder="+61 4XX XXX XXX" autoComplete="tel" aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? 'contact-error' : 'phone-hint'} className={cn("bg-[#2a2e35] border-none text-white placeholder:text-gray-500 h-11", errors.contact && "border-destructive focus:border-destructive focus-visible:ring-destructive")} />
                  <p id="phone-hint" className="text-xs text-gray-400 mt-1">
                    For urgent auction notifications via SMS
                  </p>
                  {errors.contact && <p id="contact-error" className="mt-2 text-sm text-destructive" role="alert">
                      {errors.contact}
                    </p>}
                </div>

                <Button type="submit" variant="mez" className="w-full py-3 text-xs uppercase tracking-wide min-h-[44px]" disabled={isSubmitting} aria-live="polite">
                  {isSubmitting ? <>
                      <span className="inline-block animate-pulse">SUBSCRIBING...</span>
                      <span className="sr-only">Subscribing, please wait</span>
                    </> : 'GET AUCTION ALERTS'}
                </Button>

                {errors.submit && <p className="text-sm text-destructive text-center" role="alert">
                    {errors.submit}
                  </p>}

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  By subscribing, you agree to receive marketing communications. You can unsubscribe at any time.
                </p>
              </form>}
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default EmailSignup;