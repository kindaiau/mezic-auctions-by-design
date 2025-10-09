import { motion } from "framer-motion";
import mezLogo from "@/assets/mez-logo.png";
import "./hero.css";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="scan-overlay" aria-hidden />
      <div className="text-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ y: 24, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[clamp(48px,12vw,220px)] font-black tracking-tight text-gallery-white leading-[0.8]">
            CLUB
          </h1>
          <img 
            src={mezLogo} 
            alt="MEZ" 
            className="w-[clamp(200px,50vw,600px)] h-auto"
          />
          <h1 className="text-[clamp(48px,12vw,220px)] font-black tracking-tight text-gallery-white leading-[0.8]">
            AUCTIONS
          </h1>
        </motion.div>
        <motion.p
          className="mt-6 max-w-2xl text-center text-white/70 text-xl mx-auto"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Original works auctioned weekly. Bidding starts at $1.
        </motion.p>
      </div>
    </section>
  );
}
