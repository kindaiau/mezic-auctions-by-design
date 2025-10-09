-- Add phone number to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Update auctions RLS policies to be admin-only
DROP POLICY IF EXISTS "System can manage auctions" ON public.auctions;

-- Admin-only policies for auction management
CREATE POLICY "Admins can insert auctions"
ON public.auctions
FOR INSERT
TO authenticated
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update auctions"
ON public.auctions
FOR UPDATE
TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can delete auctions"
ON public.auctions
FOR DELETE
TO authenticated
USING (public.is_current_user_admin());

-- Update the trigger to also handle phone number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;