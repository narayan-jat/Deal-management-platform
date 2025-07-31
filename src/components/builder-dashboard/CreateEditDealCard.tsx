import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Users, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DealMemberRole, DealStatus } from "@/types/deal/Deal.enums";
import { DealModel } from "@/types/deal/Deal.model";
import { INDUSTRY_OPTIONS } from "@/Constants";
import { UploadDocumentForm } from "@/types/deal/Deal.documents";
import { InviteMemberForm } from "@/types/deal/Deal.members";
import AddCollaboratorsModal from "./AddCollaboratorsModal";
import { toast } from "sonner";
import { DealCardForm } from "@/types/deal/DealCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CreateEditDealCardProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialBaseFormData?: DealCardForm;
  onSubmit: (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]) => Promise<DealModel | null>;
  handleDeleteDocument: (dealId: string, documentId: string, filePath: string) => Promise<void>;
}

interface handleInputChangeProps {
  field: keyof Partial<DealModel>;
  value: string | number | DealStatus | string[];
}

// This component handles both creating and editing deals
export default function CreateEditDealCard({
  isOpen,
  onClose,
  mode,
  initialBaseFormData,
  onSubmit,
  handleDeleteDocument,
}: CreateEditDealCardProps) {
  // Initialize base form with data when editing/creating
  const [formData, setFormData] = useState<Partial<DealModel>>({
    title: initialBaseFormData?.title || "",
    industry: initialBaseFormData?.industry || "",
    organizationId: initialBaseFormData?.organizationId || "",
    requestedAmount: initialBaseFormData?.requestedAmount || 0,
    status: initialBaseFormData?.status || DealStatus.NEW,
    startDate: initialBaseFormData?.startDate || "",
    endDate: initialBaseFormData?.endDate || "",
    nextMeetingDate: initialBaseFormData?.nextMeetingDate || "",
    location: initialBaseFormData?.location || "",
    notes: initialBaseFormData?.notes || "",
    id: initialBaseFormData?.id || "", // Make sure ID is included
  });
  // Initialize documents with data when editing/creating
  const [documents, setDocuments] = useState<UploadDocumentForm[]>(initialBaseFormData?.documents || []);
  // here not allowing to modify and see earlier members will show in other features.
  const [members, setMembers] = useState<InviteMemberForm[]>(initialBaseFormData?.members || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddCollaboratorsModalOpen, setIsAddCollaboratorsModalOpen] = useState(false);
  const stages = Object.values(DealStatus);
  const industries = INDUSTRY_OPTIONS;

  const handleInputChange = ({ field, value }: handleInputChangeProps) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileInputChange = (files: FileList | null) => {
    if (!files) return;

    const newDocuments = Array.from(files).map(file => ({
      file: file,
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const handleCloseAddCollaboratorsModal = () => {
    setIsAddCollaboratorsModalOpen(false);
  };

  const handleInviteCollaborators = (emails: string[], role: DealMemberRole) => {
    // need to handle if the collaborator is already in the list
    setMembers(prev => [...prev, ...emails.map(email => ({ email, role }))]);
  };

  const handleRemoveMember = (index: number) => {
    const memberId = members[index]?.id;
    if (memberId) {
      // remove member from supabase more complex logic come back.
      setMembers(prev => prev.filter((_, i) => i !== index));
    } else {
      setMembers(prev => prev.filter((_, i) => i !== index));
    }
  };


  const handleRemoveDocument = async (index: number) => {
    const documentId = documents[index]?.id;
    if (documentId) {
      // remove document from supabase more complex logic come back.
      await handleDeleteDocument(formData.id, documentId, documents[index]?.filePath);
      setDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate required fields
    if (!formData.title.trim() || !formData.status || !formData.industry || !formData.startDate || !formData.nextMeetingDate) {
      toast.error("Please fill in all required fields", { style: { zIndex: 10001 } });
      return;
    }

    // Ensure deal ID is included when editing
    if (mode === 'edit' && !formData.id) {
      console.error('Deal ID is missing for edit mode');
      toast.error("Deal ID is missing for editing", { style: { zIndex: 10001 } });
      return;
    }

    setIsSubmitting(true);

    try {
      const deal = await onSubmit(formData, documents, members);
      if (deal) {
        toast.success(`Deal ${mode === 'create' ? 'created' : 'updated'} successfully`);
        onClose();
      } else {
        console.error('onSubmit returned null/undefined');
        toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} deal`);
      }
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} deal:`, error);
      toast.error(`Error ${mode === 'create' ? 'creating' : 'updating'} deal: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() && formData.status && formData.industry && formData.startDate && formData.nextMeetingDate;
  const submitButtonText = isSubmitting
    ? (mode === 'create' ? "Creating..." : "Updating...")
    : (mode === 'create' ? "Create Deal" : "Update Deal");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 font-inter">{mode === 'create' ? 'Create New Deal' : 'Edit Deal'}</h2>
            </div>
            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Deal Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter deal title"
                    value={formData.title}
                    onChange={(e) => handleInputChange({ field: "title", value: e.target.value })}
                    required
                    className="w-full"
                    aria-describedby="title-error"
                  />
                  {!formData.title && formData.title !== "" && (
                    <p id="title-error" className="text-sm text-red-500">
                      Deal title is required
                    </p>
                  )}
                </div>

                {/* Deal Value */}
                <div className="space-y-2">
                  <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">
                    Requested Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="requestedAmount"
                      name="requestedAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.requestedAmount}
                      onChange={(e) => handleInputChange({ field: "requestedAmount", value: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange({ field: "status", value: value as DealStatus })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleInputChange({ field: "industry", value: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Enter location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange({ field: "location", value: e.target.value })}
                      className="w-full pl-10"
                    />
                  </div>
                </div>

                {/* Date Range - Responsive Grid */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Deal Timeline</h3>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange({ field: "startDate", value: e.target.value })}
                        className="w-full pl-10"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange({ field: "endDate", value: e.target.value })}
                        className="w-full pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Next Meeting */}
                <div className="space-y-2">
                  <label htmlFor="nextMeetingDate" className="block text-sm font-medium text-gray-700">
                    Next Meeting <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="nextMeetingDate"
                      name="nextMeetingDate"
                      type="date"
                      value={formData.nextMeetingDate}
                      onChange={(e) => handleInputChange({ field: "nextMeetingDate", value: e.target.value })}
                      className="w-full pl-10"
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Documents</h3>

                  {/* File Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileInputChange(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </span>
                    </label>
                  </div>

                  {/* File List */}
                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Uploaded Files ({documents.length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {documents.map((document, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {document.file?.name || document.fileName}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDocument(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                              aria-label={`Remove document ${document.file?.name || document.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collaborators */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Collaborators
                  </label>
                  <Button
                    type="button"
                    onClick={() => setIsAddCollaboratorsModalOpen(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Invite Collaborators
                  </Button>
                </div>

                {/* Collaborators Chips */}
                {members.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collaborators</label>
                    <div className="flex flex-wrap gap-2">
                      {members.map((member, idx) => (
                        <span
                          key={member?.id || member?.email}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {member?.name || member?.email}
                          <button
                            type="button"
                            className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                            aria-label={`Remove ${member?.email || member?.id}`}
                            onClick={() => handleRemoveMember(idx)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes about this deal..."
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange({ field: "notes", value: e.target.value })}
                    rows={4}
                    className="w-full resize-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="min-w-[100px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="min-w-[100px]"
                  >
                    {submitButtonText}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Collaborator Modal */}
      <AddCollaboratorsModal
        isOpen={isAddCollaboratorsModalOpen}
        onClose={handleCloseAddCollaboratorsModal}
        onInvite={handleInviteCollaborators}
      />
    </>
  );
}