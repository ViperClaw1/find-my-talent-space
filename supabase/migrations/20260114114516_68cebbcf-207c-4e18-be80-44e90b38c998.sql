-- Add columns to track time slot reservations
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS parent_request_id uuid REFERENCES public.requests(id),
ADD COLUMN IF NOT EXISTS selected_tier_id text,
ADD COLUMN IF NOT EXISTS selected_slot_index integer;

-- Create table to track reserved slots for time-slot requests
CREATE TABLE IF NOT EXISTS public.time_slot_reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  tier_id text,
  slot_index integer,
  talent_id uuid NOT NULL REFERENCES public.talents(id),
  status text NOT NULL DEFAULT 'reserved',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(request_id, tier_id, slot_index, talent_id)
);

-- Enable RLS on time_slot_reservations
ALTER TABLE public.time_slot_reservations ENABLE ROW LEVEL SECURITY;

-- RLS policies for time_slot_reservations
CREATE POLICY "Request owners can view reservations" 
ON public.time_slot_reservations 
FOR SELECT 
USING (request_id IN (
  SELECT id FROM public.requests WHERE user_id = auth.uid()
));

CREATE POLICY "Talents can view their own reservations" 
ON public.time_slot_reservations 
FOR SELECT 
USING (talent_id IN (
  SELECT id FROM public.talents WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create reservations with valid talent" 
ON public.time_slot_reservations 
FOR INSERT 
WITH CHECK (can_use_talent(auth.uid(), talent_id));

CREATE POLICY "Users can update their own reservations" 
ON public.time_slot_reservations 
FOR UPDATE 
USING (talent_id IN (
  SELECT id FROM public.talents WHERE user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_time_slot_reservations_updated_at
BEFORE UPDATE ON public.time_slot_reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();