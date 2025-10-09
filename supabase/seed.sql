-- Seed demo auctions that align with edge function validation
INSERT INTO public.auctions (id, title, artist, description, image_url, starting_bid, current_bid, end_time, status)
VALUES
  ('4aaf6322-ab6c-4579-b4bf-79eab904e789', 'Vali Myers Original', 'Vali Myers', 'Original work by Vali Myers', 'vali-myers', 2500, 2500, now() + interval '24 hours', 'live'),
  ('7ef2c8e9-34a6-499c-aa30-e27daba96436', 'Abstract Emotions', 'Contemporary Artist', 'Vivid exploration of emotion through abstraction.', 'abstract-emotions', 1800, 1800, now() + interval '48 hours', 'live'),
  ('cab03dab-999c-4d3b-98a8-9592eb7757d2', 'Urban Decay Series', 'Street Artist', 'Limited edition from the Urban Decay collection.', 'urban-decay', 3200, 3200, now() + interval '72 hours', 'live')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  artist = EXCLUDED.artist,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  starting_bid = EXCLUDED.starting_bid,
  current_bid = EXCLUDED.current_bid,
  end_time = EXCLUDED.end_time,
  status = EXCLUDED.status,
  updated_at = now();
