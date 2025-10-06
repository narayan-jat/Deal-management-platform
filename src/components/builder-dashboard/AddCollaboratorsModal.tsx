import { X, Mail, Search, Copy, Users, UserPlus, Share2, Clock } from "lucide-react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAddCollaboratorsModal } from "@/hooks/useAddCollaboratorsModal";

interface AddCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
}

function AddCollaboratorsModal({ isOpen, onClose, dealId }: AddCollaboratorsModalProps) {
  const {
    // State
    activeTab,
    searchQuery,
    searchResults,
    selectedUsers,
    emails,
    emailRole,
    isEmailSubmitting,
    linkRole,
    isGeneratingLink,
    generatedLink,
    isSubmitting,
    
    // Actions
    setActiveTab,
    setSearchQuery,
    setEmails,
    setEmailRole,
    setLinkRole,
    handleUserSelect,
    handleUserDeselect,
    handleInviteSelectedUsers,
    handleEmailSubmit,
    handleGenerateLink,
    handleCopyLink,
    handleModalClose,
    getInitials
  } = useAddCollaboratorsModal(dealId);

  const handleClose = () => {
    handleModalClose();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-[40vw]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900">Invite Collaborators</h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("search")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === "search"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Platform Users</span>
              <span className="sm:hidden">Users</span>
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === "email"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Invite by Email</span>
              <span className="sm:hidden">Email</span>
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === "link"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share Link</span>
              <span className="sm:hidden">Link</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4 px-2 sm:px-4">
            {/* Search Section */}
            {activeTab === "search" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for collaborators to invite
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or organization"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Search Results</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              {/* <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              {user.organizationName && (
                                <p className="text-xs text-gray-400 truncate">{user.organizationName}</p>
                              )} */}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Select
                              value={selectedUsers.get(user.id)?.role || ""}
                              onValueChange={(value) => handleUserSelect(user, value as DealMemberRole)}
                            >
                              <SelectTrigger className="w-20 sm:w-24 h-8">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={DealMemberRole.VIEWER}>Viewer</SelectItem>
                                <SelectItem value={DealMemberRole.EDITOR}>Editor</SelectItem>
                                <SelectItem value={DealMemberRole.ADMIN}>Admin</SelectItem>
                                <SelectItem value={DealMemberRole.COMMENTER}>Commenter</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => handleUserSelect(user, DealMemberRole.VIEWER)}
                              disabled={selectedUsers.has(user.id)}
                              className="h-8 w-8 p-0"
                            >
                              <UserPlus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Users */}
                {selectedUsers.size > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Selected Users ({selectedUsers.size})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Array.from(selectedUsers.values()).map(({ user, role }) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate">{user.email}</span>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {role}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUserDeselect(user.id)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={handleInviteSelectedUsers}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? "Sending..." : `Add ${selectedUsers.size} Collaborators`}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Email Section */}
            {activeTab === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite collaborators via email
                  </label>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Enter email addresses, separated by commas"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Separate multiple emails with commas (e.g. alice@email.com, bob@email.com)
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Role
                      </label>
                      <Select
                        value={emailRole}
                        onValueChange={(value) => setEmailRole(value as DealMemberRole)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DealMemberRole.VIEWER}>Viewer</SelectItem>
                          <SelectItem value={DealMemberRole.EDITOR}>Editor</SelectItem>
                          <SelectItem value={DealMemberRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={DealMemberRole.COMMENTER}>Commenter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={!emails.trim() || isEmailSubmitting}
                      className="w-full"
                    >
                      {isEmailSubmitting ? "Sending..." : "Send Invites"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Link Section */}
            {activeTab === "link" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share access with a link
                  </label>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Role
                      </label>
                      <Select
                        value={linkRole}
                        onValueChange={(value) => setLinkRole(value as DealMemberRole)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DealMemberRole.VIEWER}>Viewer</SelectItem>
                          <SelectItem value={DealMemberRole.EDITOR}>Editor</SelectItem>
                          <SelectItem value={DealMemberRole.COMMENTER}>Commenter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleGenerateLink}
                      disabled={isGeneratingLink}
                      className="w-full"
                    >
                      {isGeneratingLink ? "Generating..." : "Generate Link"}
                    </Button>
                  </div>
                </div>

                {/* Generated Link */}
                {generatedLink && (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h4 className="text-sm font-medium text-teal-800 mb-2">Generated Link</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generatedLink.shareableUrl}
                        readOnly
                        className="flex-1 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCopyLink(generatedLink.shareableUrl)}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-teal-600">
                      <Clock className="h-3 w-3" />
                      <span>No expiration</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddCollaboratorsModal;