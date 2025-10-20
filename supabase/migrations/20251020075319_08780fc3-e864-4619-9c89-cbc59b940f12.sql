-- Allow anyone to upload images to auction-images bucket
CREATE POLICY "Anyone can upload auction images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'auction-images');