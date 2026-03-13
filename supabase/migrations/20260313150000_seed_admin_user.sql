CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO admin_uid FROM auth.users WHERE email = 'fhbcyberguard@gmail.com';

  IF admin_uid IS NULL THEN
    admin_uid := gen_random_uuid();

    -- Insert into auth.users, handling empty strings vs NULL correctly
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'fhbcyberguard@gmail.com',
      crypt('@Cab311270', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin FinForce", "plan": "team", "profile_type": "personal"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  ELSE
    -- Update existing user password, metadata, and confirmation status
    UPDATE auth.users
    SET encrypted_password = crypt('@Cab311270', gen_salt('bf')),
        raw_user_meta_data = '{"full_name": "Admin FinForce", "plan": "team", "profile_type": "personal"}',
        email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
        updated_at = NOW()
    WHERE id = admin_uid;
  END IF;

  -- Ensure profile exists and has correct plan and profile_type
  INSERT INTO public.profiles (
    id, email, full_name, plan, profile_type, updated_at, created_at
  ) VALUES (
    admin_uid,
    'fhbcyberguard@gmail.com',
    'Admin FinForce',
    'team',
    'personal',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    plan = EXCLUDED.plan,
    profile_type = EXCLUDED.profile_type,
    updated_at = NOW();

END $$;
