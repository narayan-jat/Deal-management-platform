import { useState } from "react";
import { Search, User, Mail, Crown, Edit, Eye, MessageSquare, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Contributor } from "@/types/deal/Deal.members";
import { useDealMembers } from "@/hooks/useDealMembers";
import { toast } from "sonner";

interface CollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: Contributor[];
  title?: string;
  dealId: string;
  onMemberDeleted?: () => void;
  hasEditAccess?: boolean;
  user?: any;
}

export default function CollaboratorsModal({
  isOpen,
  onClose,
  collaborators,
  title = "Collaborators",
  dealId,
  onMemberDeleted,
  hasEditAccess = false,
  user,
}: CollaboratorsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  
  // Use the useDealMembers hook for delete functionality
  const { deleteMember, loading: deleteLoading } = useDealMembers(dealId);
  // Handle member deletion
  const handleDeleteMember = async (member: Contributor) => {
    if (!hasEditAccess) {
      toast.error("You don't have permission to delete members");
      return;
    }
    const userId = user?.id || '';
    setDeletingMemberId(member.id);
    
    try {
      const success = await deleteMember(member, userId);
      if (success) {
        toast.success(`${member.name} has been removed from the deal`);
        // Call the callback to refresh the parent component
        if (onMemberDeleted) {
          await onMemberDeleted();
        }
      } else {
        toast.error("Failed to remove member");
      }
    } catch (error) {
      toast.error("An error occurred while removing the member");
    } finally {
      setDeletingMemberId(null);
    }
  };

  // Filter collaborators based on search query
  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "commenter":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-3 w-3" />;
      case "editor":
        return <Edit className="h-3 w-3" />;
      case "commenter":
        return <MessageSquare className="h-3 w-3" />;
      case "viewer":
        return <Eye className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
            />
          </div>

          {/* Collaborators List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredCollaborators.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No collaborators found" : "No collaborators yet"}
              </div>
            ) : (
              filteredCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {collaborator.profilePath ? (
                        <img
                          src={collaborator.profilePath}
                          alt={collaborator.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {collaborator.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {collaborator.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            collaborator.role
                          )}`}
                        >
                          {getRoleIcon(collaborator.role)}
                          <span className="ml-1">{collaborator.role}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{collaborator.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {hasEditAccess && (
                    <div className="flex-shrink-0 ml-3">
                      <button
                        onClick={() => handleDeleteMember(collaborator)}
                        disabled={deletingMemberId === collaborator.id || deleteLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove member"
                      >
                        {deletingMemberId === collaborator.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 