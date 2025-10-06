import { useState } from "react";
import { Search, User, Mail, Crown, Edit, MessageSquare } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PersonTag, PersonTagType } from "@/types/deal/Deal.sections";

interface PersonTagsModalProps {
  type: PersonTagType;
  isOpen: boolean;
  onClose: () => void;
  personTags: PersonTag[];
  title?: string;
}

export default function PersonTagsModal({
  type,
  isOpen,
  onClose,
  personTags,
  title = `${type}`,
}: PersonTagsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter collaborators based on search query
  const filteredPersonTags = personTags.filter(
    (personTag) =>
      personTag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personTag.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "borrower":
        return "bg-red-100 text-red-800";
      case "lender":
        return "bg-blue-100 text-blue-800";
      case "other_party":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "borrower":
        return <Crown className="h-3 w-3" />;
      case "lender":
        return <Edit className="h-3 w-3" />;
      case "other_party":
        return <MessageSquare className="h-3 w-3" />;
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
            {filteredPersonTags.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? `No ${type} found` : `No ${type} yet`}
              </div>
            ) : (
              filteredPersonTags.map((personTag) => (
                <div
                  key={personTag?.id || personTag?.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {personTag?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {personTag?.name}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          personTag?.role
                        )}`}
                      >
                        {getRoleIcon(personTag?.role)}
                        <span className="ml-1">{personTag?.role}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{personTag?.email}</span>
                    </div>
                  </div>
                </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}