ALTER TABLE public.recipes 
ADD COLUMN social_media_url TEXT 
CHECK (social_media_url ~* '^https?://[^\s/$.?#].[^\s]*$');