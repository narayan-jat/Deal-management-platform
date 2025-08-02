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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { toast } from "sonner";

interface AddCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[], role: DealMemberRole) => void;
}

function AddCollaboratorsModal({ isOpen, onClose, onInvite }: AddCollaboratorsModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-5">
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900">Invite Collaborators</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <Select
                value={role}
                onValueChange={(value) => setRole(value as DealMemberRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DealMemberRole.VIEWER}>Viewer</SelectItem>
                  <SelectItem value={DealMemberRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={DealMemberRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={DealMemberRole.COMMENTER}>Commenter</SelectItem>
                </SelectContent>
              </Select>
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
      </DialogContent>
    </Dialog>
  );
}

export default AddCollaboratorsModal;