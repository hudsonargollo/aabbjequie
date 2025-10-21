-- Remove emissor and uf columns from applications table
ALTER TABLE public.applications DROP COLUMN IF EXISTS emissor;
ALTER TABLE public.applications DROP COLUMN IF EXISTS uf;