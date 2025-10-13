-- Insert 3 mock live auctions for testing
INSERT INTO public.auctions (
  id,
  title,
  artist,
  image_url,
  starting_bid,
  current_bid,
  end_time,
  status,
  description
) VALUES
  (
    gen_random_uuid(),
    'Vali Myers Original',
    'Vali Myers',
    'vali-myers-artwork.jpg',
    2500.00,
    2500.00,
    now() + interval '24 hours',
    'live',
    'Original artwork by the legendary Vali Myers, featuring her iconic bohemian style and intricate linework.'
  ),
  (
    gen_random_uuid(),
    'Abstract Emotions',
    'Contemporary Artist',
    'abstract-emotions-artwork.png',
    1800.00,
    1800.00,
    now() + interval '48 hours',
    'live',
    'A vibrant exploration of human emotion through abstract forms and bold color palettes.'
  ),
  (
    gen_random_uuid(),
    'Urban Decay Series',
    'Street Artist Collective',
    'urban-decay-artwork.jpg',
    3200.00,
    3200.00,
    now() + interval '72 hours',
    'live',
    'Part of an exclusive series capturing the beauty in urban deterioration and street culture.'
  );