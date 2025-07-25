import React, { useState, useMemo } from "react";
import { X, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contributor } from "@/types/deal/DealCard";

interface CollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: Contributor[];
  title?: string;
}

export default function CollaboratorsModal({
  isOpen,
  onClose,
  collaborators,
  title = "Collaborators",
}: CollaboratorsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter collaborators based on search query
  const filteredCollaborators = useMemo(() => {
    if (!searchQuery.trim()) return collaborators;
    
    const query = searchQuery.toLowerCase();
    return collaborators.filter(
      (collaborator) =>
        collaborator.name.toLowerCase().includes(query) ||
        collaborator.email.toLowerCase().includes(query)
    );
  }, [collaborators, searchQuery]);

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "member":
        return "bg-green-100 text-green-800 border-green-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-4">
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
        </div>

        {/* Collaborators List */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          {filteredCollaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No collaborators found" : "No collaborators"}
              </h3>
              <p className="text-gray-500 text-sm">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Collaborators will appear here when added"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {/* {collaborator.profilePhoto ? (
                      <img
                        src={collaborator.profilePhoto}
                        alt={collaborator.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null} */}
                    {(
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {collaborator.name}
                    </h3>
                    <p className="text-gray-500 text-xs truncate">
                      {collaborator.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        getRoleBadgeColor(collaborator.role)
                      )}
                    >
                      {collaborator.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="text-center text-sm text-gray-500">
            {filteredCollaborators.length} of {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
} 