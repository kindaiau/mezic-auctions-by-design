import { motion } from "framer-motion";
import mezLogo from "@/assets/mez-logo-optimized.webp";
import "./hero.css";

export default function Hero() {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-transparent" />
      <div className="scan-overlay" aria-hidden />
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-[clamp(48px,12vw,220px)] font-black tracking-tight text-black leading-[0.8]">
              CLUB
            </h1>
            <img 
              src={mezLogo} 
              alt="MEZ" 
              className="h-[clamp(48px,12vw,220px)] w-auto"
            />
          </div>
          <h1 className="text-[clamp(48px,12vw,220px)] font-black tracking-tight text-black leading-[0.8]">
            AUCTIONS
          </h1>
        </div>
        <p className="mt-6 max-w-2xl text-center text-black/70 text-xl mx-auto">
          Original works auctioned weekly. Bidding starts at $1.
        </p>
      </div>
    </section>
  );
}
