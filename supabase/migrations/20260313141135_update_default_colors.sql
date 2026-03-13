-- Update the default value for the color column in accounts to use the new theme accent
ALTER TABLE public.accounts ALTER COLUMN color SET DEFAULT '#016ad9';

-- Update the default value for the color column in goals to use the new theme accent
ALTER TABLE public.goals ALTER COLUMN color SET DEFAULT '#016ad9';

-- Update existing accounts that are using the old default color (#126eda) to the new theme color
UPDATE public.accounts SET color = '#016ad9' WHERE color = '#126eda';

-- Update existing goals that are using the old default color (#126eda) to the new theme color
UPDATE public.goals SET color = '#016ad9' WHERE color = '#126eda';
