import KierkegaardHeader from '@/components/KierkegaardHeader';
import AuctionHero from '@/components/AuctionHero';
import KierkegaardGrid from '@/components/KierkegaardGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gallery-black">
      <KierkegaardHeader />
      <main className="pt-24 md:pt-0">
        <AuctionHero />
        <KierkegaardGrid />
      </main>
    </div>
  );
};

export default Index;
