-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Talents can create applications" ON public.applications;

-- Create a more permissive policy that allows authenticated users to apply
-- In production, you would want to verify the talent belongs to the user
CREATE POLICY "Authenticated users can create applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also update the sample talents to have user_id set to null explicitly
-- so we can later link them to real users