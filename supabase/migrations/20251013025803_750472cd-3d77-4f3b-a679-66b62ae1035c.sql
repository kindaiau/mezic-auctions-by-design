-- Create storage bucket for auction images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('auction-images', 'auction-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for auction images
CREATE POLICY "Anyone can view auction images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'auction-images');

CREATE POLICY "Admins can upload auction images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'auction-images' 
  AND public.is_current_user_admin()
);

CREATE POLICY "Admins can update auction images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'auction-images' 
  AND public.is_current_user_admin()
);

CREATE POLICY "Admins can delete auction images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'auction-images' 
  AND public.is_current_user_admin()
);