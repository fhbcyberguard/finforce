-- Enable the master admin to view all profiles
CREATE POLICY "Master admin can view all profiles"
ON public.profiles
FOR SELECT
USING ( auth.jwt() ->> 'email' = 'fhbcyberguard@gmail.com' );

-- Enable the master admin to view all families (as per requirements)
CREATE POLICY "Master admin can view all families"
ON public.families
FOR SELECT
USING ( auth.jwt() ->> 'email' = 'fhbcyberguard@gmail.com' );
