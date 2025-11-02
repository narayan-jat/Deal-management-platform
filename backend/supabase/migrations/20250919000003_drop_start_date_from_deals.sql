-- =====================================================
-- DROP Unnecessary COLUMN FROM DEALS TABLE
-- =====================================================

-- Drop the unnecessary columns from deals table
ALTER TABLE deals
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date,
DROP COLUMN IF EXISTS next_meeting_date;
DROP COLUMN IF EXISTS requested_amount;

