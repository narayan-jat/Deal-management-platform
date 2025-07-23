import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { toast } from "sonner";
interface CollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[], role: DealMemberRole) => void;
}

function CollaboratorModal({ isOpen, onClose, onInvite }: CollaboratorModalProps) {
  const [emails, setEmails] = useState<string>("");
  const [role, setRole] = useState<DealMemberRole>(DealMemberRole.VIEWER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParseEmails = () => {
    const emailList = emails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    return emailList;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) {
      toast.error("Please enter email addresses", { style: { zIndex: 9999 } });
      return;
    }

    setIsSubmitting(true);
    
    // Parse emails (comma or newline separated)
    const emailList = handleParseEmails();

    if (emailList.length > 0) {
      onInvite(emailList, role);
      handleModalClose();
    } else {
      toast.error("Please enter valid email addresses", { style: { zIndex: 9999 } });
    }
    
    setIsSubmitting(false);
  };

  const handleModalClose = () => {
    setEmails("");
    setRole(DealMemberRole.VIEWER);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-2 sm:px-0">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleModalClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto sm:mx-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Invite Collaborators</h3>
          <button
            onClick={handleModalClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>
            <Textarea
              id="emails"
              placeholder="Enter email addresses, separated by commas"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple emails with commas (e.g. alice@email.com, bob@email.com)
            </p>
          </div>
          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Assign Role
            </label>
            <div className="relative z-[70]">
              <Select
                value={role}
                onValueChange={(value) => setRole(value as DealMemberRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="z-[80]">
                  <SelectItem value={DealMemberRole.VIEWER}>Viewer</SelectItem>
                  <SelectItem value={DealMemberRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={DealMemberRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={DealMemberRole.COMMENTER}>Commenter</SelectItem>
                </SelectContent>
              </Select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M7 8l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!emails}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Invites"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CollaboratorModal;