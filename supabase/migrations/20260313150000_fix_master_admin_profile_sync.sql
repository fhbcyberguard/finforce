DO $$
DECLARE
  master_user_id UUID;
  master_family_id UUID;
BEGIN
  -- Get the UUID of the user fhbcyberguard@gmail.com from auth.users
  SELECT id INTO master_user_id FROM auth.users WHERE email = 'fhbcyberguard@gmail.com' LIMIT 1;

  IF master_user_id IS NOT NULL THEN
    -- Ensure profile exists and plan is team
    INSERT INTO public.profiles (id, email, full_name, plan, profile_type, created_at, updated_at)
    VALUES (
      master_user_id,
      'fhbcyberguard@gmail.com',
      'Master Admin',
      'team',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(public.profiles.full_name, 'Master Admin'),
      plan = 'team',
      profile_type = 'admin',
      updated_at = NOW();

    -- Check for family
    SELECT id INTO master_family_id FROM public.families WHERE owner_id = master_user_id LIMIT 1;
    
    IF master_family_id IS NULL THEN
      INSERT INTO public.families (name, owner_id)
      VALUES ('Família Master', master_user_id)
      RETURNING id INTO master_family_id;
    END IF;

    -- Ensure member entry exists
    IF NOT EXISTS (SELECT 1 FROM public.members WHERE profile_id = master_user_id) THEN
      INSERT INTO public.members (family_id, profile_id, name, email, role)
      VALUES (master_family_id, master_user_id, 'Master Admin', 'fhbcyberguard@gmail.com', 'admin');
    END IF;
  END IF;
END $$;
