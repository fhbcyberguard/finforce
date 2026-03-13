CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_family_id UUID;
  user_name TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  -- Ensure profile is created first
  INSERT INTO public.profiles (id, full_name, email, updated_at)
  VALUES (NEW.id, user_name, NEW.email, NOW())
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

  -- Check if family already exists for this owner, if not create and attach member
  IF NOT EXISTS (SELECT 1 FROM public.families WHERE owner_id = NEW.id) THEN
      INSERT INTO public.families (name, owner_id)
      VALUES ('Família ' || user_name, NEW.id)
      RETURNING id INTO new_family_id;

      INSERT INTO public.members (family_id, profile_id, name, email, role)
      VALUES (new_family_id, NEW.id, user_name, NEW.email, 'admin');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
