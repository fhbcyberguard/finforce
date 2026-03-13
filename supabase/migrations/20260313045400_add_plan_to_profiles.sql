ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'basic';

UPDATE public.profiles p
SET plan = 'premium'
FROM auth.users u
WHERE u.id = p.id AND u.email = 'fhbcyberguard@gmail.com';
