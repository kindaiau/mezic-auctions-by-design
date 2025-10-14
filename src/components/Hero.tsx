import { motion } from "framer-motion";
import mezCircleLogo from "@/assets/mez-circle-logo.webp";
import { Button } from "./ui/button";
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
              src={mezCircleLogo} 
              alt="MEZ" 
              className="h-[clamp(48px,12vw,220px)] w-auto"
              style={{ 
                mixBlendMode: 'multiply'
              }}
            />
          </div>
          <h1 className="text-[clamp(48px,12vw,220px)] font-black tracking-tight text-black leading-[0.8]">
            AUCTIONS
          </h1>
        </div>
        <p className="mt-6 max-w-2xl text-center text-black/70 text-xl mx-auto">
          Original works auctioned weekly. Bidding starts at $1.
        </p>
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button
            variant="gold-solid"
            size="lg"
            className="gold-glow-subtle px-8 py-3 text-sm uppercase tracking-tight min-h-[48px]"
            onClick={() => {
              const auctionsSection = document.getElementById('auctions');
              if (auctionsSection) {
                auctionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            aria-label="View live auctions"
          >
            VIEW LIVE AUCTIONS
          </Button>
          <Button
            variant="gold-outline"
            size="lg"
            className="gold-glow-subtle px-8 py-3 text-sm uppercase tracking-tight min-h-[48px]"
            onClick={() => {
              const subscribeSection = document.getElementById('subscribe');
              if (subscribeSection) {
                subscribeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            aria-label="Register to bid"
          >
            REGISTER TO BID
          </Button>
        </div>
      </div>
    </section>
  );
}
