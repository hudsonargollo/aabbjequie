-- Remove has_criminal_record column from applications table
ALTER TABLE public.applications DROP COLUMN IF EXISTS has_criminal_record;