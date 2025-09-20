import { SignatureStatus } from "./Deal.enums";

export type DealDocument = {
  id: string;
  dealId: string; // deal_id
  uploadedBy: string; // uploaded_by
  filePath: string; // file_path - Supabase storage path
  mimeType: string; // mime_type
  fileName: string; // file_name
  signatureStatus: SignatureStatus; // signature_status
  uploadedAt: string; // uploaded_at
  sectionName?: string; // section_name
  formCategory?: string; // form_category
  itemId?: string; // item_id
};

// For upload form
export type UploadDocumentForm = Partial<DealDocument> & {
  file?: File;
};
