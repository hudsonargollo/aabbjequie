-- Add user_id column and remove plain-text financial data storage
ALTER TABLE public.applications
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id NOT NULL with a default for migration
-- Note: This will fail if there are existing rows, which is fine for new deployments
ALTER TABLE public.applications 
ALTER COLUMN user_id SET NOT NULL;

-- Remove plain-text financial data columns (PCI DSS compliance)
-- These will be replaced with payment processor integration
ALTER TABLE public.applications
DROP COLUMN IF EXISTS card_number,
DROP COLUMN IF EXISTS card_validity,
DROP COLUMN IF EXISTS card_flag,
DROP COLUMN IF EXISTS bank_account,
DROP COLUMN IF EXISTS bank_agency,
DROP COLUMN IF EXISTS bank_dv;

-- Add columns for tokenized payment references instead
ALTER TABLE public.applications
ADD COLUMN payment_token text,
ADD COLUMN payment_processor text,
ADD COLUMN last_four_digits text;

-- Create user_roles table for admin access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Qualquer um pode inserir inscrições" ON public.applications;
DROP POLICY IF EXISTS "Admins podem ver todas as inscrições" ON public.applications;

-- Create secure RLS policies for applications table
CREATE POLICY "Users can insert their own applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));