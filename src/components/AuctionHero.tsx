const AuctionHero = () => {
  const title = "AUCTION";

  return (
    <section className="min-h-screen flex items-center justify-center bg-gallery-black">
      <h1 aria-label={title} className="flex">
        {title.split('').map((char, idx) => (
          <span
            key={idx}
            className="text-hero text-gallery-white inline-block opacity-0 animate-digital"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </h1>
    </section>
  );
};

export default AuctionHero;
