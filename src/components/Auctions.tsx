import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const auctionData = [
  {
    id: 1,
    title: "Abstract Composition #47",
    image: "https://marianamezic.com/cdn/shop/files/24E6E4FC-13CA-4D4C-AA56-0D8C3739BB33.jpg?v=1747023089",
    endsAt: "2 days left"
  },
  {
    id: 2,
    title: "Digital Dreams Series",
    image: "https://marianamezic.com/cdn/shop/files/IMG_2623.jpg?v=1747019764",
    endsAt: "5 hours left"
  },
  {
    id: 3,
    title: "Urban Fragments",
    image: "https://marianamezic.com/cdn/shop/files/IMG_2580.jpg?v=1747019777",
    endsAt: "1 day left"
  },
  {
    id: 4,
    title: "Color Theory Study",
    image: "https://marianamezic.com/cdn/shop/files/IMG_2583.jpg?v=1747019767",
    endsAt: "3 days left"
  },
  {
    id: 5,
    title: "Minimalist Expression",
    image: "https://marianamezic.com/cdn/shop/files/IMG_2579.jpg?v=1747019778",
    endsAt: "6 hours left"
  },
  {
    id: 6,
    title: "Contemporary Vision",
    image: "https://marianamezic.com/cdn/shop/files/IMG_2585.jpg?v=1747019765",
    endsAt: "4 days left"
  }
];

const Auctions = () => {
  return (
    <section id="auctions" className="py-16 md:py-24 bg-gallery-black">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gallery-white mb-4 tracking-tight">
            Current Auctions
          </h2>
          <p className="text-gallery-white/60 text-lg">
            Live bidding on Instagram
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctionData.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-charcoal rounded-lg overflow-hidden hover:bg-charcoal/80 transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-medium text-gallery-white mb-2">
                    {auction.title}
                  </h3>
                  
                  <p className="text-gallery-white/60 text-sm mb-4">
                    Ends in {auction.endsAt}
                  </p>
                  
                  <Button
                    variant="outline"
                    className="w-full border-gallery-white/30 text-gallery-white hover:bg-gallery-white hover:text-gallery-black"
                  >
                    Bid on Instagram
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Auctions;