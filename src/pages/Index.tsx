import KierkegaardHeader from '@/components/KierkegaardHeader';
import ScrollingHero from '@/components/ScrollingHero';
import KierkegaardGrid from '@/components/KierkegaardGrid';
import EmailSignup from '@/components/EmailSignup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gallery-black">
      <KierkegaardHeader />
      <main>
        <ScrollingHero />
        <KierkegaardGrid />
        <EmailSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
