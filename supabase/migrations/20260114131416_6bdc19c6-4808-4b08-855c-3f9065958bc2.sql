-- Create table for talent service listings
CREATE TABLE public.talent_service_listings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    talent_id UUID NOT NULL REFERENCES public.talents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.talent_service_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view service listings
CREATE POLICY "Anyone can view service listings"
ON public.talent_service_listings
FOR SELECT
USING (true);

-- Talent owners can insert their own listings
CREATE POLICY "Talent owners can insert service listings"
ON public.talent_service_listings
FOR INSERT
WITH CHECK (talent_id IN (
    SELECT id FROM public.talents WHERE user_id = auth.uid()
));

-- Talent owners can update their own listings
CREATE POLICY "Talent owners can update service listings"
ON public.talent_service_listings
FOR UPDATE
USING (talent_id IN (
    SELECT id FROM public.talents WHERE user_id = auth.uid()
));

-- Talent owners can delete their own listings
CREATE POLICY "Talent owners can delete service listings"
ON public.talent_service_listings
FOR DELETE
USING (talent_id IN (
    SELECT id FROM public.talents WHERE user_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_talent_service_listings_updated_at
BEFORE UPDATE ON public.talent_service_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();