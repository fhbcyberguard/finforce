ALTER TABLE public.members ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS bank_broker TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS asset_name TEXT;
