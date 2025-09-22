import { useState } from "react";
import Header from "./components/Header";
import PixelIntro from "./components/PixelIntro";
import Hero from "./components/Hero";
import Auctions from "./components/Auctions";
import EmailSignup from "./components/EmailSignup";
import Footer from "./components/Footer";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="min-h-screen bg-gallery-black">
      {!loaded && <PixelIntro onDone={() => setLoaded(true)} />}
      
      {loaded && (
        <>
          <Header />
          <main>
            <Hero />
            <Auctions />
            <EmailSignup />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
