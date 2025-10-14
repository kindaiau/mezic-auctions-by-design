import { Button } from '@/components/ui/button';

const ShopLink = () => {
  return (
    <section className="py-16 px-4 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg md:text-xl text-foreground mb-6">
          Browse more original artwork in the shop
        </p>
        <Button
          variant="gold-solid"
          className="text-xs uppercase tracking-tight px-8 py-3"
          asChild
        >
          <a 
            href="https://marianamezic.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            VISIT SHOP
          </a>
        </Button>
      </div>
    </section>
  );
};

export default ShopLink;
