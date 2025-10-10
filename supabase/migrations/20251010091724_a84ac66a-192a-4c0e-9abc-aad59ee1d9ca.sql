-- Add name column to email_subscribers table
ALTER TABLE public.email_subscribers 
ADD COLUMN name text;