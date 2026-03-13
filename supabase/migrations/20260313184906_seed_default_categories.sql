-- Migration to seed basic categories for existing profiles
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT id FROM public.profiles LOOP
        IF NOT EXISTS (SELECT 1 FROM public.categories WHERE user_id = r.id) THEN
            INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
            (r.id, 'Moradia', 'Expense', 'Home', '#ef4444'),
            (r.id, 'Alimentação', 'Expense', 'Utensils', '#f97316'),
            (r.id, 'Transporte', 'Expense', 'Car', '#f59e0b'),
            (r.id, 'Saúde', 'Expense', 'HeartPulse', '#10b981'),
            (r.id, 'Lazer', 'Expense', 'Palmtree', '#8b5cf6'),
            (r.id, 'Educação', 'Expense', 'GraduationCap', '#3b82f6'),
            (r.id, 'Outros', 'Expense', 'CircleDashed', '#64748b'),
            (r.id, 'Salário', 'Revenue', 'Wallet', '#22c55e'),
            (r.id, 'Investimentos', 'Revenue', 'TrendingUp', '#06b6d4'),
            (r.id, 'Extra', 'Revenue', 'PlusCircle', '#ec4899');
        END IF;
    END LOOP;
END;
$$;

-- Add a trigger to automatically seed categories for new profiles
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Moradia', 'Expense', 'Home', '#ef4444'),
    (NEW.id, 'Alimentação', 'Expense', 'Utensils', '#f97316'),
    (NEW.id, 'Transporte', 'Expense', 'Car', '#f59e0b'),
    (NEW.id, 'Saúde', 'Expense', 'HeartPulse', '#10b981'),
    (NEW.id, 'Lazer', 'Expense', 'Palmtree', '#8b5cf6'),
    (NEW.id, 'Educação', 'Expense', 'GraduationCap', '#3b82f6'),
    (NEW.id, 'Outros', 'Expense', 'CircleDashed', '#64748b'),
    (NEW.id, 'Salário', 'Revenue', 'Wallet', '#22c55e'),
    (NEW.id, 'Investimentos', 'Revenue', 'TrendingUp', '#06b6d4'),
    (NEW.id, 'Extra', 'Revenue', 'PlusCircle', '#ec4899');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created_seed_categories ON public.profiles;
CREATE TRIGGER on_profile_created_seed_categories
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.seed_default_categories();
