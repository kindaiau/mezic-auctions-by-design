import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CurrentAuctions from '@/components/CurrentAuctions';
import EmailSignup from '@/components/EmailSignup';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <CurrentAuctions />
        <EmailSignup />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
