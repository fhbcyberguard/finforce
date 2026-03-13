CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE OR REPLACE FUNCTION public.admin_create_user(
  new_email TEXT,
  new_password TEXT,
  full_name TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_email TEXT;
  new_user_id UUID;
BEGIN
  -- Verify the caller is the Master Admin
  caller_email := current_setting('request.jwt.claims', true)::json->>'email';
  IF caller_email != 'fhbcyberguard@gmail.com' THEN
    RAISE EXCEPTION 'Unauthorized';
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
    json_build_object('full_name', full_name),
    false, 'authenticated', 'authenticated',
    '', '', '', '', '',
    NULL, '', '', ''
  );

  -- The handle_new_user() trigger will fire automatically to create profile, family, and member

  RETURN new_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_email TEXT;
BEGIN
  -- Verify the caller is the Master Admin
  caller_email := current_setting('request.jwt.claims', true)::json->>'email';
  IF caller_email != 'fhbcyberguard@gmail.com' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Delete from auth.users (cascades to public tables)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
