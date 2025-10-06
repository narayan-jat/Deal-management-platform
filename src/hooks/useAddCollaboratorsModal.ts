import { useState, useEffect, useCallback } from 'react';
import { DealMemberRole } from '@/types/deal/Deal.enums';
import { InviteService } from '@/services/deals/InviteService';
import { useAuth } from '@/context/AuthProvider';
import { useUserProfile } from '@/context/UserProfileProvider';
import { UserSearchResult, SharedLink } from '@/types/deal/Deal.invites';
import { toast } from 'sonner';
import camelcaseKeys from 'camelcase-keys';
import { DealMemberModel } from '@/types/deal/Deal.model';
import { DealMemberService } from '@/services/deals/DealMemberService';
import {debounce} from 'lodash';
import axios from 'axios';
type TabType = "search" | "email" | "link";

export const useAddCollaboratorsModal = (dealId: string) => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("search");
  
  // Search section
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Map<string, { user: UserSearchResult; role: DealMemberRole }>>(new Map());
  
  // Email section
  const [emails, setEmails] = useState("");
  const [emailRole, setEmailRole] = useState<DealMemberRole>(DealMemberRole.VIEWER);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  
  // Link section
  const [linkRole, setLinkRole] = useState<DealMemberRole>(DealMemberRole.VIEWER);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<SharedLink | null>(null);
  
  // General state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;
      
      setIsSearching(true);
      try {
        const results = await InviteService.searchUsers(query);
        // convert to the camelcase
        const camelCaseResults = results.map(result => camelcaseKeys(result, { deep: true }));
        setSearchResults(camelCaseResults);
      } catch (error) {
        toast.error("Failed to search users");
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  // Search section handlers
  const handleUserSelect = (user: UserSearchResult, role: DealMemberRole) => {
    const newSelectedUsers = new Map(selectedUsers);
    newSelectedUsers.set(user.id, { user, role });
    setSelectedUsers(newSelectedUsers);
  };

  const handleUserDeselect = (userId: string) => {
    const newSelectedUsers = new Map(selectedUsers);
    newSelectedUsers.delete(userId);
    setSelectedUsers(newSelectedUsers);
  };

  // The users which are there on platform and can be directly invited
  // are directly added to the deal members table. They become deal members
  // with the specified role.
  const handleInviteSelectedUsers = async () => {
    if (selectedUsers.size === 0) return;
    
    setIsSubmitting(true);
    try {
      // Add members to the deal members table.
      const dealMembers: Partial<DealMemberModel>[] = Array.from(selectedUsers.values()).map(({ user, role }) => ({
        dealId,
        memberId: user.id, // user id is the id of the user being added.
        role,
        addedBy: userProfile?.id || "" // current user
      }));

      await DealMemberService.createDealMembers(dealMembers);
      toast.success(`Invited ${selectedUsers.size} user(s)`);
      setSelectedUsers(new Map());
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error(error.message || "Failed to send invites");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email section handlers
  const handleParseEmails = () => {
    const emailList = emails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    return emailList;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) {
      toast.error("Please enter email addresses");
      return;
    }

    setIsEmailSubmitting(true);
    
    const emailList = handleParseEmails();
    if (emailList.length === 0) {
      toast.error("Please enter valid email addresses");
      setIsEmailSubmitting(false);
      return;
    }

    try {
      const invites = emailList.map(email => ({
        dealId,
        email,
        role: emailRole,
        invitedBy: userProfile?.id || ""
      }));

      // Make a call to the edge function to send the invites.
      const response = await axios.post(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-invite`, {
        invites
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.status !== 200) {
        toast.error(response.data.error || "Failed to send some of the invites");
        return;
      }
      
      toast.success(`Invited ${emailList.length} user(s)`);
      setEmails("");
      setEmailRole(DealMemberRole.VIEWER);
    } catch (error) {
      toast.error(error.message || "Failed to send invites");
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Link section handlers
  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    try {
      const shareLink: SharedLink = await InviteService.createSharedLink({
        dealId,
        role: linkRole,
        createdBy: user?.id || ""
      });
      
      setGeneratedLink(shareLink);
      toast.success("Shareable link generated");
    } catch (error) {
      toast.error("Failed to generate link");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error(error.message || "Failed to copy link");
    }
  };

  const handleModalClose = () => {
    setActiveTab("search");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUsers(new Map());
    setEmails("");
    setEmailRole(DealMemberRole.VIEWER);
    setLinkRole(DealMemberRole.VIEWER);
    setGeneratedLink(null);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return {
    // State
    activeTab,
    searchQuery,
    searchResults,
    isSearching,
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
  };
};

export default useAddCollaboratorsModal; 