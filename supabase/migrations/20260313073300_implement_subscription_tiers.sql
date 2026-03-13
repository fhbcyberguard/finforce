-- Set default plan to basic so new users get the trial automatically
ALTER TABLE public.profiles ALTER COLUMN plan SET DEFAULT 'basic';

-- Update anyone currently canceled back to basic if they just created their account
UPDATE public.profiles SET plan = 'basic' WHERE plan = 'canceled';

-- Add created_at to profiles if it doesn't exist to track trial start
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Sync existing created_at from auth.users to ensure accurate trial tracking
UPDATE public.profiles p
SET created_at = u.created_at
FROM auth.users u
WHERE u.id = p.id;

-- Create security definer function to avoid infinite recursion when checking admin/team status in RLS
CREATE OR REPLACE FUNCTION public.is_team_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND plan = 'team'
  );
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Master admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin and Team can view all profiles" ON public.profiles;

-- Create updated policies granting access to 'team' plan
CREATE POLICY "Admin and Team can view all profiles" ON public.profiles
FOR SELECT TO public
USING (
  (auth.jwt() ->> 'email'::text) = 'fhbcyberguard@gmail.com'::text OR
  public.is_team_admin()
);

-- Drop existing family policies
DROP POLICY IF EXISTS "Master admin can view all families" ON public.families;
DROP POLICY IF EXISTS "Admin and Team can view all families" ON public.families;

CREATE POLICY "Admin and Team can view all families" ON public.families
FOR SELECT TO public
USING (
  (auth.jwt() ->> 'email'::text) = 'fhbcyberguard@gmail.com'::text OR
  public.is_team_admin()
);
