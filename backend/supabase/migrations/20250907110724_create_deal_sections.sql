-- =====================================================
-- DEAL SECTIONS TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

DROP TABLE IF EXISTS deal_sections CASCADE;
DROP TABLE IF EXISTS deal_overview CASCADE;
DROP TABLE IF EXISTS deal_purpose CASCADE;
DROP TABLE IF EXISTS deal_collateral CASCADE;
DROP TABLE IF EXISTS deal_financials CASCADE;
DROP TABLE IF EXISTS deal_senior_debt CASCADE;
DROP TABLE IF EXISTS deal_next_steps CASCADE;

-- =====================================================
-- DROP EXISTING ENUMS (in reverse dependency order)
-- =====================================================

DROP TYPE IF EXISTS deal_section_name CASCADE;

-- =====================================================
-- CREATE ENUMS
-- =====================================================

CREATE TYPE deal_section_name AS ENUM ('OVERVIEW', 'PURPOSE', 'COLLATERAL', 'FINANCIALS', 'SENIOR_DEBT', 'NEXT_STEPS');

-- =====================================================
-- CREATE TABLES deal_sections, deal_purpose, deal_collateral, deal_financials, deal_senior_debt, deal_next_steps
-- =====================================================

-- Deal sections table
CREATE TABLE deal_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  section_name deal_section_name NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Deal overview table
CREATE TABLE deal_overview (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  sponsors TEXT,
  borrowers TEXT,
  lenders TEXT,
  loan_request NUMERIC,
  rate TEXT,
  status TEXT,
  created_at timestamptz DEFAULT now()
);

-- Deal purpose table
CREATE TABLE deal_purpose (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  purpose TEXT,
  timeline TEXT,
  created_at timestamptz DEFAULT now()
);

-- Deal collateral table
CREATE TABLE deal_collateral (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  property_description TEXT,
  property_type TEXT,
  building_size NUMERIC,
  year_built INT,
  occupancy NUMERIC,
  condition TEXT,
  location TEXT,
  appraised_value NUMERIC,
  risk_notes TEXT,
  created_at timestamptz DEFAULT now()
);

-- Deal financials table
CREATE TABLE deal_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  sources_of_funds TEXT,
  uses_of_funds TEXT,
  historical_financials TEXT,
  projected_financials TEXT,
  exit_strategy TEXT,
  ltv NUMERIC,
  dscr NUMERIC,
  created_at timestamptz DEFAULT now()
);

-- Deal senior debt table
CREATE TABLE deal_senior_debt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  amount NUMERIC,
  interest_rate NUMERIC,
  term TEXT,
  amortization TEXT,
  recourse TEXT,
  prepayment_penalty TEXT,
  fees TEXT,
  created_at timestamptz DEFAULT now()
);

-- Deal next steps table
CREATE TABLE deal_next_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  expected_close_date DATE,
  notes TEXT,
  start_date DATE,
  next_meeting_date DATE,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE deal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_purpose ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_collateral ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_senior_debt ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_next_steps ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES
-- =====================================================

--Note: These all the above tables will have same policies as the deal tables have.

-- =====================================================
-- DROP POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Allow deal members to read their own deal sections" ON deal_sections;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal sections" ON deal_sections;
DROP POLICY IF EXISTS "Allow deal members to update their own deal sections" ON deal_sections;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal sections" ON deal_sections;
DROP POLICY IF EXISTS "Allow deal members to read their own deal overview" ON deal_overview;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal overview" ON deal_overview;
DROP POLICY IF EXISTS "Allow deal members to update their own deal overview" ON deal_overview;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal overview" ON deal_overview;
DROP POLICY IF EXISTS "Allow deal members to read their own deal purpose" ON deal_purpose;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal purpose" ON deal_purpose;
DROP POLICY IF EXISTS "Allow deal members to update their own deal purpose" ON deal_purpose;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal purpose" ON deal_purpose;
DROP POLICY IF EXISTS "Allow deal members to read their own deal collateral" ON deal_collateral;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal collateral" ON deal_collateral;
DROP POLICY IF EXISTS "Allow deal members to update their own deal collateral" ON deal_collateral;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal collateral" ON deal_collateral;
DROP POLICY IF EXISTS "Allow deal members to read their own deal financials" ON deal_financials;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal financials" ON deal_financials;
DROP POLICY IF EXISTS "Allow deal members to update their own deal financials" ON deal_financials;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal financials" ON deal_financials;
DROP POLICY IF EXISTS "Allow deal members to read their own deal senior debt" ON deal_senior_debt;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal senior debt" ON deal_senior_debt;
DROP POLICY IF EXISTS "Allow deal members to update their own deal senior debt" ON deal_senior_debt;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal senior debt" ON deal_senior_debt;
DROP POLICY IF EXISTS "Allow deal members to read their own deal next steps" ON deal_next_steps;
DROP POLICY IF EXISTS "Allow deal members to insert their own deal next steps" ON deal_next_steps;
DROP POLICY IF EXISTS "Allow deal members to update their own deal next steps" ON deal_next_steps;
DROP POLICY IF EXISTS "Allow deal members to delete their own deal next steps" ON deal_next_steps;

-- =====================================================
-- CREATE DEAL SECTIONS POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal sections"
ON deal_sections
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL SECTIONS - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal sections"
ON deal_sections
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
);

-- =====================================================
-- DEALS SECTIONS - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal sections for elevated roles"
ON deal_sections
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEALS SECTIONS - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal sections for elevated roles"
ON deal_sections
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- CREATE DEAL OVERVIEW POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal overview"
ON deal_overview
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL OVERVIEW - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal overview"
ON deal_overview
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
);

-- =====================================================
-- DEAL OVERVIEW - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal overview for elevated roles"
ON deal_overview
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
);
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
);

-- =====================================================
-- DEAL OVERVIEW - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal overview for elevated roles"
ON deal_overview
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
);

-- =====================================================
-- CREATE DEAL PURPOSE POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal purpose"
ON deal_purpose
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL PURPOSE - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal purpose"
ON deal_purpose
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
);

-- =====================================================
-- DEAL PURPOSE - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal purpose for elevated roles"
ON deal_purpose
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL PURPOSE - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal purpose for elevated roles"
ON deal_purpose
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL COLLATERAL POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal collateral"
ON deal_collateral
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL COLLATERAL - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal collateral"
ON deal_collateral
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
);

-- =====================================================
-- DEAL COLLATERAL - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal collateral for elevated roles"
ON deal_collateral
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL COLLATERAL - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal collateral for elevated roles"
ON deal_collateral
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL FINANCIALS POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal financials"
ON deal_financials
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL FINANCIALS - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal financials"
ON deal_financials
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
);

-- =====================================================
-- DEAL FINANCIALS - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal financials for elevated roles"
ON deal_financials
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL FINANCIALS - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal financials for elevated roles"
ON deal_financials
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL SENIOR DEBT POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal senior debt"
ON deal_senior_debt
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_senior_debt.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL SENIOR DEBT - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal senior debt"
ON deal_senior_debt
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_senior_debt.deal_id
    )
);

-- =====================================================
-- DEAL SENIOR DEBT - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal senior debt for elevated roles"
ON deal_senior_debt
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_senior_debt.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_senior_debt.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL SENIOR DEBT - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal senior debt for elevated roles"
ON deal_senior_debt
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_senior_debt.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL NEXT STEPS POLICIES
-- =====================================================
CREATE POLICY "Allow deal members to read their own deal next steps"
ON deal_next_steps
FOR SELECT
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEAL NEXT STEPS - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Allow deal members to insert their own deal next steps"
ON deal_next_steps
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
);

-- =====================================================
-- DEAL NEXT STEPS - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal next steps for elevated roles"
ON deal_next_steps
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL NEXT STEPS - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal next steps for elevated roles"
ON deal_next_steps
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);