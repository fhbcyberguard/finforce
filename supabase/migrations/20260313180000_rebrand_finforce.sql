-- Rebrand FinFlow to FinForce in the database

-- Update any existing family names that might contain 'FinFlow'
UPDATE public.families 
SET name = REPLACE(name, 'FinFlow', 'FinForce') 
WHERE name LIKE '%FinFlow%';

-- Update any existing goals that might contain 'FinFlow'
UPDATE public.goals 
SET name = REPLACE(name, 'FinFlow', 'FinForce') 
WHERE name LIKE '%FinFlow%';

-- Update any existing categories that might contain 'FinFlow'
UPDATE public.categories 
SET name = REPLACE(name, 'FinFlow', 'FinForce') 
WHERE name LIKE '%FinFlow%';

-- Update any existing transactions descriptions that might contain 'FinFlow'
UPDATE public.transactions 
SET description = REPLACE(description, 'FinFlow', 'FinForce') 
WHERE description LIKE '%FinFlow%';
