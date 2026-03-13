-- Update Master Admin plan to 'team' and ensure profile_type is consistent
UPDATE public.profiles p
SET 
  plan = 'team',
  profile_type = 'admin',
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id 
  AND u.email = 'fhbcyberguard@gmail.com';

-- Fallback using profiles.email directly in case the join missed anything
UPDATE public.profiles
SET 
  plan = 'team',
  profile_type = 'admin',
  updated_at = NOW()
WHERE email = 'fhbcyberguard@gmail.com';
