-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can create applications" ON public.applications;

-- Create a helper function to check if a talent belongs to a user OR has no owner (sample data)
CREATE OR REPLACE FUNCTION public.can_use_talent(_user_id uuid, _talent_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.talents
    WHERE id = _talent_id
      AND (user_id = _user_id OR user_id IS NULL)
  )
$$;

-- Create a secure policy using the helper function
CREATE POLICY "Users can create applications with valid talent"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (public.can_use_talent(auth.uid(), talent_id));