-- Add has_criminal_record column to applications table
ALTER TABLE applications ADD COLUMN has_criminal_record boolean NOT NULL DEFAULT false;

-- Add constraint to prevent applications from individuals with criminal records
ALTER TABLE applications ADD CONSTRAINT check_no_criminal_record CHECK (has_criminal_record = false);