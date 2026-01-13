-- Create applications table to track talent applications to open requests
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES public.talents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(request_id, talent_id)
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Talents can view their own applications
CREATE POLICY "Talents can view their own applications"
ON public.applications
FOR SELECT
USING (
  talent_id IN (SELECT id FROM public.talents WHERE user_id = auth.uid())
);

-- Request owners can view applications to their requests
CREATE POLICY "Request owners can view applications to their requests"
ON public.applications
FOR SELECT
USING (
  request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid())
);

-- Talents can create applications (only if they own the talent profile)
CREATE POLICY "Talents can create applications"
ON public.applications
FOR INSERT
WITH CHECK (
  talent_id IN (SELECT id FROM public.talents WHERE user_id = auth.uid())
);

-- Request owners can update application status (accept/reject)
CREATE POLICY "Request owners can update applications"
ON public.applications
FOR UPDATE
USING (
  request_id IN (SELECT id FROM public.requests WHERE user_id = auth.uid())
);

-- Talents can delete their pending applications
CREATE POLICY "Talents can delete their pending applications"
ON public.applications
FOR DELETE
USING (
  talent_id IN (SELECT id FROM public.talents WHERE user_id = auth.uid())
  AND status = 'pending'
);

-- Create trigger for updating updated_at
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policy for talents to view open requests (not just their own)
CREATE POLICY "Talents can view open requests"
ON public.requests
FOR SELECT
USING (request_type = 'open' AND status = 'pending');

-- Add RLS policy for talents to view time-slot requests
CREATE POLICY "Talents can view time-slot requests"
ON public.requests
FOR SELECT
USING (request_type = 'time-slot' AND status = 'pending');