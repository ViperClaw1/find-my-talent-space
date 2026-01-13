-- Create talents table for talent profiles
CREATE TABLE public.talents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  avatar_initials TEXT,
  bio TEXT,
  hourly_rate NUMERIC,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;

-- Everyone can view talents (for search/selection)
CREATE POLICY "Anyone can view talents"
ON public.talents
FOR SELECT
USING (true);

-- Users can manage their own talent profile
CREATE POLICY "Users can insert their own talent profile"
ON public.talents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own talent profile"
ON public.talents
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own talent profile"
ON public.talents
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_talents_updated_at
BEFORE UPDATE ON public.talents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key from requests to talents
ALTER TABLE public.requests
ADD CONSTRAINT fk_requests_talent
FOREIGN KEY (talent_id) REFERENCES public.talents(id) ON DELETE SET NULL;