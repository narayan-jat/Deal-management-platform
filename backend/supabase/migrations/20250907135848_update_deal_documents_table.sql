-- =====================================================
-- UPDATE DEAL DOCUMENTS TABLE
-- =====================================================

ALTER TABLE deal_documents
ADD COLUMN section_name deal_section_name NOT NULL DEFAULT 'PURPOSE';