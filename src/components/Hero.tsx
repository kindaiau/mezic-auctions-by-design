import { motion } from "framer-motion";
import "./hero.css";

export default function Hero() {
  const boxes = [
    { title: "CLUB", subtitle: "Exclusive Art" },
    { title: "MEZ", subtitle: "Original Works" },
    { title: "AUCTIONS", subtitle: "Weekly Bidding" }
  ];

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="scan-overlay" aria-hidden />
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {boxes.map((box, index) => (
            <motion.div
              key={box.title}
              className="text-center"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            >
              <motion.h2
                className="glitch text-[clamp(48px,8vw,120px)] font-black tracking-tight text-white mb-4"
                data-text={box.title}
                whileHover={{ 
                  skewX: [-2, 2, -2], 
                  rotate: [0, 0.3, 0], 
                  transition: { repeat: Infinity, repeatType: "mirror", duration: 0.8 } 
                }}
              >
                {box.title}
              </motion.h2>
              <motion.p
                className="text-white/70 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (index * 0.2) + 0.4, duration: 0.6 }}
              >
                {box.subtitle}
              </motion.p>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-12 text-center text-white/70 text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Original works auctioned weekly. Bidding starts at $1.
        </motion.p>
      </div>
    </section>
  );
}
