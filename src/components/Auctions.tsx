export default function Auctions() {
  // TODO: wire to data. For now, one sample card:
  return (
    <section id="auctions" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 md:mb-12 flex items-end justify-between">
          <h2 className="text-white text-3xl md:text-5xl font-semibold">Auctions</h2>
          <a href="#signup" className="text-sm md:text-base underline text-white/70 hover:text-white">Get alerts</a>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="group rounded-lg border border-white/10 p-4 bg-white/[0.02]">
            <div className="aspect-[4/5] overflow-hidden rounded">
              <img src="/artworks/sample.jpg" alt="Current auction" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-white text-lg md:text-xl">Vali Myers — No Regrets</h3>
                <p className="text-white/60 text-sm">Starts $1 • Ends Sun 8pm</p>
              </div>
              <a href="https://instagram.com/REPLACE" target="_blank" rel="noreferrer"
                 className="text-xs md:text-sm rounded px-3 py-2 border border-white/20 hover:border-white/50">
                Bid on Instagram
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
