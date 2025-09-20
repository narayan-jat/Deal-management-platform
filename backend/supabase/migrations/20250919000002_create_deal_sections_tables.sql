-- =====================================================
-- CREATE DEAL SECTIONS TABLES
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

DROP TABLE IF EXISTS deal_sections CASCADE;
DROP TABLE IF EXISTS deal_overview CASCADE;
DROP TABLE IF EXISTS deal_purpose CASCADE;
DROP TABLE IF EXISTS deal_collateral CASCADE;
DROP TABLE IF EXISTS deal_financials CASCADE;
DROP TABLE IF EXISTS deal_next_steps CASCADE;

-- =====================================================
-- CREATE DEAL SECTIONS TABLE
-- =====================================================

CREATE TABLE deal_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  section_name VARCHAR(50) NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, section_name)
);

-- =====================================================
-- CREATE DEAL OVERVIEW TABLE
-- =====================================================

CREATE TABLE deal_overview (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  borrowers JSONB DEFAULT '[]'::jsonb,
  lenders JSONB DEFAULT '[]'::jsonb,
  other_parties JSONB DEFAULT '[]'::jsonb,
  loan_request NUMERIC DEFAULT 0,
  total_project_cost NUMERIC DEFAULT 0,
  rate JSONB DEFAULT '{"type": "single", "value": 0}'::jsonb,
  ltv NUMERIC DEFAULT 0,
  dscr NUMERIC DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id)
);

-- =====================================================
-- CREATE DEAL PURPOSE TABLE
-- =====================================================

CREATE TABLE deal_purpose (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  purpose TEXT,
  timeline VARCHAR(100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id)
);

-- =====================================================
-- CREATE DEAL COLLATERAL TABLE
-- =====================================================

CREATE TABLE deal_collateral (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  collateral_data JSONB NOT NULL, -- Stores the complete collateral item data
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id)
);

-- =====================================================
-- CREATE DEAL FINANCIALS TABLE
-- =====================================================

CREATE TABLE deal_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  sources_of_funds TEXT,
  uses_of_funds TEXT,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id)
);

-- =====================================================
-- CREATE DEAL NEXT STEPS TABLE
-- =====================================================

CREATE TABLE deal_next_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  expected_close_date DATE,
  notes TEXT,
  start_date DATE,
  next_meeting_date DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE deal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_purpose ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_collateral ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_next_steps ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES
-- =====================================================

-- Deal Sections Policies
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

CREATE POLICY "Allow deal members to insert their own deal sections"
ON deal_sections
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_sections.deal_id
    )
);

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

-- Deal Overview Policies
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

CREATE POLICY "Allow deal members to insert their own deal overview"
ON deal_overview
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
);

CREATE POLICY "Allow deal members to update the deal overview for elevated roles"
ON deal_overview
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

CREATE POLICY "Allow deal members to delete the deal overview for elevated roles"
ON deal_overview
FOR DELETE
USING (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_overview.deal_id
    )
    OR
    deal_id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- Deal Purpose Policies
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

CREATE POLICY "Allow deal members to insert their own deal purpose"
ON deal_purpose
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_purpose.deal_id
    )
);

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

-- Deal Collateral Policies
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

CREATE POLICY "Allow deal members to insert their own deal collateral"
ON deal_collateral
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_collateral.deal_id
    )
);

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

-- Deal Financials Policies
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

CREATE POLICY "Allow deal members to insert their own deal financials"
ON deal_financials
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_financials.deal_id
    )
);

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

-- Deal Next Steps Policies
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

CREATE POLICY "Allow deal members to insert their own deal next steps"
ON deal_next_steps
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT created_by FROM deals WHERE id = deal_next_steps.deal_id
    )
);

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
