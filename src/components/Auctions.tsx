import valiMyersArtwork from '@/assets/vali-myers-artwork.jpg';
import abstractEmotionsArtwork from '@/assets/abstract-emotions-artwork.png';

const auctionItems = [
  {
    id: 1,
    title: "Vali Myers — No Regrets",
    artist: "Vali Myers",
    image: valiMyersArtwork,
    currentBid: "$45",
    endTime: "Ends Sun 8pm",
    status: "Live"
  },
  {
    id: 2,
    title: "Abstract Emotions #3",
    artist: "Maria Santos", 
    image: abstractEmotionsArtwork,
    currentBid: "$22",
    endTime: "Ends Mon 6pm",
    status: "Live"
  },
  {
    id: 3,
    title: "Urban Decay Series",
    artist: "David Kim",
    image: "/artworks/sample.jpg", 
    currentBid: "$38",
    endTime: "Ends Tue 9pm",
    status: "Live"
  }
];

export default function Auctions() {
  return (
    <section id="auctions" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12 flex items-end justify-between">
          <h2 className="text-white text-3xl md:text-5xl font-semibold">Auctions</h2>
          <a href="#signup" className="text-sm md:text-base underline text-white/70 hover:text-white">Get alerts</a>
        </header>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {auctionItems.map((item) => (
            <article key={item.id} className="group rounded-lg border border-white/10 p-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300">
              <div className="aspect-[4/5] overflow-hidden rounded">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="text-white text-lg md:text-xl font-medium">{item.title}</h3>
                  <p className="text-white/60 text-sm mt-1">Current bid: {item.currentBid} • {item.endTime}</p>
                </div>
                <button className="w-full text-sm rounded-md px-4 py-2 border border-white/20 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200">
                  Place Bid
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
