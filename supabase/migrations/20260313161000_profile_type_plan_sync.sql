-- Update the trigger function for handling new users with profile_type and plan inheritance
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_family_id UUID;
  user_name TEXT;
  assigned_plan TEXT;
  assigned_type TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  assigned_plan := COALESCE(NEW.raw_user_meta_data->>'plan', 'basic');
  assigned_type := COALESCE(NEW.raw_user_meta_data->>'profile_type', 'personal');

  -- Hardcoded TEAM plan restriction
  IF assigned_plan = 'team' AND NEW.email != 'fhbcyberguard@gmail.com' THEN
    assigned_plan := 'basic';
  END IF;

  -- Ensure profile is created first and synchronized
  INSERT INTO public.profiles (id, full_name, email, plan, profile_type, updated_at)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    assigned_plan,
    assigned_type,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    plan = EXCLUDED.plan,
    profile_type = EXCLUDED.profile_type;

  -- Check if family already exists for this owner, if not create and attach member
  IF NOT EXISTS (SELECT 1 FROM public.families WHERE owner_id = NEW.id) THEN
      INSERT INTO public.families (name, owner_id)
      VALUES ('Família ' || user_name, NEW.id)
      RETURNING id INTO new_family_id;

      -- Create default admin member linked to this new family
      INSERT INTO public.members (family_id, profile_id, name, email, role)
      VALUES (new_family_id, NEW.id, user_name, NEW.email, 'admin');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace admin_create_user to handle plan and profile_type
DROP FUNCTION IF EXISTS public.admin_create_user(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.admin_create_user(
  new_email TEXT,
  new_password TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'basic',
  profile_type TEXT DEFAULT 'personal'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_email TEXT;
  new_user_id UUID;
  assigned_plan TEXT;
BEGIN
  -- Verify the caller is the Master Admin
  caller_email := current_setting('request.jwt.claims', true)::json->>'email';
  IF caller_email != 'fhbcyberguard@gmail.com' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  assigned_plan := plan;
  IF assigned_plan = 'team' AND new_email != 'fhbcyberguard@gmail.com' THEN
    assigned_plan := 'basic';
  END IF;

  new_user_id := gen_random_uuid();

  -- Insert into auth.users, handling empty strings vs NULL correctly
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    new_email,
    crypt(new_password, gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('full_name', full_name, 'plan', assigned_plan, 'profile_type', profile_type),
    false, 'authenticated', 'authenticated',
    '', '', '', '', '',
    NULL, '', '', ''
  );

  RETURN new_user_id;
END;
$$;

-- Create trigger to enforce TEAM plan restriction on any updates
CREATE OR REPLACE FUNCTION public.enforce_team_plan_restriction()
RETURNS trigger AS $$
BEGIN
  IF NEW.plan = 'team' AND NEW.email != 'fhbcyberguard@gmail.com' THEN
    NEW.plan := 'basic';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_plan_update ON public.profiles;
CREATE TRIGGER on_profile_plan_update
  BEFORE UPDATE OF plan ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_team_plan_restriction();
