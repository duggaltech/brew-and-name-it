-- Fix the update_updated_at_column function and recreate dependent triggers
-- Drop triggers first
DROP TRIGGER IF EXISTS update_user_drinks_updated_at ON user_drinks;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop and recreate the function with secure search path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER update_user_drinks_updated_at
  BEFORE UPDATE ON user_drinks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();