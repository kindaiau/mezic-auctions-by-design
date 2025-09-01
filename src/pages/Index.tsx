import KierkegaardHeader from '@/components/KierkegaardHeader';
import ScrollingHero from '@/components/ScrollingHero';
import KierkegaardGrid from '@/components/KierkegaardGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gallery-black">
      <KierkegaardHeader />
      <main>
        <ScrollingHero />
        <KierkegaardGrid />
      </main>
    </div>
  );
};

export default Index;
