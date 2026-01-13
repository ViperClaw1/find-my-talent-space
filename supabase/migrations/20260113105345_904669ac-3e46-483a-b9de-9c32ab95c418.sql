-- Create enum for request types
CREATE TYPE public.request_type AS ENUM ('direct', 'open', 'time-slot');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'declined', 'completed', 'cancelled');

-- Create requests table
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type request_type NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  
  -- Talent info (for direct requests)
  talent_id UUID,
  talent_name TEXT,
  talent_category TEXT,
  
  -- Service details
  service_category TEXT NOT NULL,
  service_type TEXT,
  service_listing TEXT,
  offered_amount DECIMAL(10,2) NOT NULL,
  talents_needed INTEGER DEFAULT 1,
  
  -- Location details
  is_virtual BOOLEAN DEFAULT FALSE,
  venue_tbd BOOLEAN DEFAULT FALSE,
  location_name TEXT,
  address TEXT,
  city TEXT,
  location_category TEXT,
  location_type TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  admission_price TEXT,
  age_restriction TEXT,
  other_talents TEXT,
  special_notes TEXT,
  meeting_url TEXT,
  access_instructions TEXT,
  
  -- Event details (required for time-slot, optional for others)
  event_title TEXT,
  event_category TEXT,
  
  -- Time-slot specific
  booking_mode TEXT,
  visibility TEXT,
  access_code TEXT,
  time_type TEXT,
  fixed_start_time TEXT,
  fixed_end_time TEXT,
  fixed_slots INTEGER,
  tiers JSONB,
  
  -- Calculated fields
  service_fee DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" 
ON public.requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests" 
ON public.requests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster user queries
CREATE INDEX idx_requests_user_id ON public.requests(user_id);
CREATE INDEX idx_requests_type ON public.requests(request_type);
CREATE INDEX idx_requests_status ON public.requests(status);