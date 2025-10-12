import mezCircleLogo from "@/assets/mez-circle-logo.png";
import { Button } from "@/components/ui/button";
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
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            variant="hero"
            size="lg"
            className="px-8 py-4 text-base uppercase tracking-tight"
            onClick={() => {
              const auctionsSection = document.getElementById("auctions");
              if (auctionsSection) {
                auctionsSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            View live auctions
          </Button>
          <Button
            variant="gallery"
            size="lg"
            className="px-8 py-4 text-base uppercase tracking-tight"
            onClick={() => {
              const signupSection = document.getElementById("subscribe");
              if (signupSection) {
                signupSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            Register to bid
          </Button>
        </div>
      </div>
    </section>
  );
}
