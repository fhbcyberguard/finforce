-- Fix types for any existing basic categories that might be mismatched
UPDATE public.categories
SET type = 'Investment'
WHERE type != 'Investment' AND name IN ('Ações', 'Cripto', 'Renda Fixa', 'Reserva de Emergência');

UPDATE public.categories
SET type = 'Revenue'
WHERE type != 'Revenue' AND name IN ('Salário', 'Freelance', 'Rendimentos', 'Outras Receitas');

UPDATE public.categories
SET type = 'Expense'
WHERE type != 'Expense' AND name IN ('Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Assinaturas & Serviços', 'Impostos', 'Outras Despesas');

-- Replace trigger function to ensure the correct 3 types and basic categories are seeded for new profiles
CREATE OR REPLACE FUNCTION public.seed_default_categories()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Salário', 'Revenue', 'Wallet', '#22c55e'),
    (NEW.id, 'Freelance', 'Revenue', 'Briefcase', '#10b981'),
    (NEW.id, 'Rendimentos', 'Revenue', 'TrendingUp', '#06b6d4'),
    (NEW.id, 'Outras Receitas', 'Revenue', 'PlusCircle', '#ec4899'),
    (NEW.id, 'Moradia', 'Expense', 'Home', '#ef4444'),
    (NEW.id, 'Alimentação', 'Expense', 'Utensils', '#f97316'),
    (NEW.id, 'Transporte', 'Expense', 'Car', '#f59e0b'),
    (NEW.id, 'Saúde', 'Expense', 'HeartPulse', '#10b981'),
    (NEW.id, 'Lazer', 'Expense', 'Palmtree', '#8b5cf6'),
    (NEW.id, 'Educação', 'Expense', 'GraduationCap', '#3b82f6'),
    (NEW.id, 'Assinaturas & Serviços', 'Expense', 'Tv', '#8b5cf6'),
    (NEW.id, 'Impostos', 'Expense', 'Landmark', '#ef4444'),
    (NEW.id, 'Outras Despesas', 'Expense', 'CircleDashed', '#64748b'),
    (NEW.id, 'Ações', 'Investment', 'TrendingUp', '#3b82f6'),
    (NEW.id, 'Cripto', 'Investment', 'Coins', '#f59e0b'),
    (NEW.id, 'Renda Fixa', 'Investment', 'Landmark', '#10b981'),
    (NEW.id, 'Reserva de Emergência', 'Investment', 'PiggyBank', '#22c55e');
    RETURN NEW;
END;
$$;

-- Seed missing standard categories for all existing profiles (ensuring we don't duplicate names per profile)
DO $$
DECLARE
    r RECORD;
    cat_data JSONB := '[
        {"name": "Salário", "type": "Revenue", "icon": "Wallet", "color": "#22c55e"},
        {"name": "Freelance", "type": "Revenue", "icon": "Briefcase", "color": "#10b981"},
        {"name": "Rendimentos", "type": "Revenue", "icon": "TrendingUp", "color": "#06b6d4"},
        {"name": "Outras Receitas", "type": "Revenue", "icon": "PlusCircle", "color": "#ec4899"},
        {"name": "Moradia", "type": "Expense", "icon": "Home", "color": "#ef4444"},
        {"name": "Alimentação", "type": "Expense", "icon": "Utensils", "color": "#f97316"},
        {"name": "Transporte", "type": "Expense", "icon": "Car", "color": "#f59e0b"},
        {"name": "Saúde", "type": "Expense", "icon": "HeartPulse", "color": "#10b981"},
        {"name": "Lazer", "type": "Expense", "icon": "Palmtree", "color": "#8b5cf6"},
        {"name": "Educação", "type": "Expense", "icon": "GraduationCap", "color": "#3b82f6"},
        {"name": "Assinaturas & Serviços", "type": "Expense", "icon": "Tv", "color": "#8b5cf6"},
        {"name": "Impostos", "type": "Expense", "icon": "Landmark", "color": "#ef4444"},
        {"name": "Outras Despesas", "type": "Expense", "icon": "CircleDashed", "color": "#64748b"},
        {"name": "Ações", "type": "Investment", "icon": "TrendingUp", "color": "#3b82f6"},
        {"name": "Cripto", "type": "Investment", "icon": "Coins", "color": "#f59e0b"},
        {"name": "Renda Fixa", "type": "Investment", "icon": "Landmark", "color": "#10b981"},
        {"name": "Reserva de Emergência", "type": "Investment", "icon": "PiggyBank", "color": "#22c55e"}
    ]'::JSONB;
    cat_item JSONB;
BEGIN
    FOR r IN SELECT id FROM public.profiles LOOP
        FOR cat_item IN SELECT * FROM jsonb_array_elements(cat_data) LOOP
            IF NOT EXISTS (
                SELECT 1 FROM public.categories 
                WHERE user_id = r.id AND name = cat_item->>'name'
            ) THEN
                INSERT INTO public.categories (user_id, name, type, icon, color)
                VALUES (
                    r.id, 
                    cat_item->>'name', 
                    cat_item->>'type', 
                    cat_item->>'icon', 
                    cat_item->>'color'
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$;
