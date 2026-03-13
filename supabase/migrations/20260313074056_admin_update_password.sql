CREATE OR REPLACE FUNCTION public.admin_update_user_password(target_user_id UUID, new_password TEXT)
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

  -- Update password in auth.users
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = target_user_id;
END;
$$;
