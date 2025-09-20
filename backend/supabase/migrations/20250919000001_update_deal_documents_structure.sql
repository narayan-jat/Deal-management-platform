-- =====================================================
-- UPDATE DEAL DOCUMENTS TABLE STRUCTURE
-- =====================================================

-- Add new columns to deal_documents table
ALTER TABLE deal_documents
ADD COLUMN IF NOT EXISTS section_name VARCHAR(50) NOT NULL DEFAULT 'PURPOSE',
ADD COLUMN IF NOT EXISTS form_category VARCHAR(50),
ADD COLUMN IF NOT EXISTS item_id VARCHAR(255);

-- Add comments for clarity
COMMENT ON COLUMN deal_documents.section_name IS 'Section where document belongs (OVERVIEW, PURPOSE, COLLATERAL, FINANCIALS, NEXT_STEPS)';
COMMENT ON COLUMN deal_documents.form_category IS 'Category within the form (e.g., PROPERTY, FINANCIAL_ASSETS, CORPORATE_ASSETS for collateral; HISTORICAL, PROJECTED for financials)';
COMMENT ON COLUMN deal_documents.item_id IS 'ID of the specific item within the section (e.g., collateral item ID)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deal_documents_section_name ON deal_documents(section_name);
CREATE INDEX IF NOT EXISTS idx_deal_documents_form_category ON deal_documents(form_category);
CREATE INDEX IF NOT EXISTS idx_deal_documents_item_id ON deal_documents(item_id);
