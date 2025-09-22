import { motion } from "framer-motion";
import "./hero.css";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="scan-overlay" aria-hidden />
      <div className="text-center">
        <motion.div
          className="mb-4 text-white/40 text-sm uppercase tracking-widest font-light"
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Welcome to
        </motion.div>
        <motion.h1
          className="glitch text-[clamp(48px,12vw,220px)] font-black tracking-tight text-white leading-[0.8]"
          data-text="CLUB MEZ AUCTIONS"
          initial={{ y: 24, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ skewX: [-2, 2, -2], rotate: [0, 0.3, 0], transition: { repeat: Infinity, repeatType: "mirror", duration: 0.8 } }}
        >
          CLUB MEZ<br />AUCTIONS
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-center text-white/70 text-xl mx-auto"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Original works auctioned weekly. Bidding starts at $1.
        </motion.p>
      </div>
    </section>
  );
}
