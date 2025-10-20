-- Delete all test/mockup auctions to prepare for real auction uploads
DELETE FROM public.auctions 
WHERE id IN (
  '087eb35c-fcc9-424f-b916-043c37bc1d72',
  'e33cb053-f6d5-4c89-be05-d3ebe4ba2c60',
  '0457412e-269c-4f1e-a893-0cbf6c4f6623',
  '381931ba-adac-4c5b-8c95-204ab353aa13'
);