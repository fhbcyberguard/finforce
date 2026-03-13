ALTER TABLE public.profiles ALTER COLUMN plan SET DEFAULT 'canceled';

UPDATE public.profiles SET plan = 'basica_mensal' WHERE plan = 'basic';
UPDATE public.profiles SET plan = 'pro_mensal' WHERE plan = 'premium';
UPDATE public.profiles SET plan = 'top_anual' WHERE email = 'fhbcyberguard@gmail.com';
