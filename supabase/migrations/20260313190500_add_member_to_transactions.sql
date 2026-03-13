ALTER TABLE public.transactions 
ADD COLUMN member_id UUID REFERENCES public.members(id) ON DELETE SET NULL;
