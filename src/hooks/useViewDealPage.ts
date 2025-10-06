import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DealViewType } from '@/types/deal/DealView';
import { DealLogModel } from '@/types/deal/Deal.model';
import { DealSectionName } from '@/types/deal/Deal.sections';
import { DealService } from '@/services/deals/DealService';
import { DealSectionsService } from '@/services/deals/DealSectionsService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { useDealMembers } from './useDealMembers';
import { useComment } from './useComment';
import { useDocumentUpload } from './useDocumentUpload';
import { ErrorService } from '@/services/ErrorService';
import { toast } from 'sonner';
import { DealLogService } from '@/services/deals/DealLogService';
import camelcaseKeys from 'camelcase-keys';
import { DocumentStorageService } from '@/services/DocumentStorageService';

export const useViewDealPage = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dealLogs, setDealLogs] = useState<DealLogModel[]>([]);
  const [isFetchingDealLogs, setIsFetchingDealLogs] = useState(false);
  
  // Deal data states
  const [deal, setDeal] = useState<DealViewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Deal members hook
  const {
    members,
    loading: membersLoading,
    fetchDealMembers,
  } = useDealMembers(dealId || '');

  // Document and comment states
  const [selectedLog, setSelectedLog] = useState<DealLogModel | null>(null);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DealSectionName | 'BASIC_INFO'>('BASIC_INFO');
  const [sectionsData, setSectionsData] = useState<any>(null);
  const [sectionsEnabled, setSectionsEnabled] = useState<{ [key in DealSectionName | 'BASIC_INFO']: boolean }>({
    'BASIC_INFO': true,
    [DealSectionName.OVERVIEW]: false,
    [DealSectionName.PURPOSE]: false,
    [DealSectionName.COLLATERAL]: false,
    [DealSectionName.FINANCIALS]: false,
    [DealSectionName.NEXT_STEPS]: false,
  });
  const [loadingSections, setLoadingSections] = useState(true);
  const [documentsBySection, setDocumentsBySection] = useState<{ [key: string]: any[] }>({});
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  console.log("Documents by section state:", documentsBySection);
  // Use the centralized comment hook
  const { 
    comments: dealComments, 
    isFetchingComments: isFetchingDealComments,
    newComment,
    setNewComment,
    isSubmittingComment,
    editingCommentId,
    editingCommentText,
    setEditingCommentText,
    getFilteredMembers,
    handleMentionMember,
    handleMentionDetection,
    handleMemberSelection,
    handleSubmitCommentWithMembers,
    handleUpdateCommentLocalWithMembers,
    handleCancelEdit,
    handleEditComment,
  } = useComment(deal);

  // Use the document upload hook
  const { updateDealDocuments } = useDocumentUpload();

  // Mention dropdown states
  const [isMentionDropdownOpen, setIsMentionDropdownOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch complete deal data
  const fetchDealData = async () => {
    if (!dealId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch complete deal data with sections
      const completeDealData = await DealService.getCompleteDeal(dealId);
      
      // Transform to DealViewType
      const dealViewData: DealViewType = {
        id: completeDealData.deal.id,
        title: completeDealData.deal.title,
        industry: completeDealData.deal.industry,
        organizationId: completeDealData.deal.organizationId,
        status: completeDealData.deal.status,
        location: completeDealData.deal.location,
        createdAt: completeDealData.deal.createdAt,
        updatedAt: completeDealData.deal.updatedAt,
        createdBy: completeDealData.deal.createdBy,
        sections: completeDealData.sections,
        documents: completeDealData.documents as { [sectionName: string]: any[] },
        members: await fetchDealMembers(),
      };

      setDeal(dealViewData);
      
      // Set sections data from the deal object
      setSectionsData(completeDealData.sections);
      
      // Update sections enabled state
      const enabledSections: { [key in DealSectionName | 'BASIC_INFO']: boolean } = {
        'BASIC_INFO': true,
        [DealSectionName.OVERVIEW]: false,
        [DealSectionName.PURPOSE]: false,
        [DealSectionName.COLLATERAL]: false,
        [DealSectionName.FINANCIALS]: false,
        [DealSectionName.NEXT_STEPS]: false,
      };
      
      completeDealData.sections.sections.forEach(section => {
        if (section.sectionName) {
          enabledSections[section.sectionName.toUpperCase() as DealSectionName] = section.enabled;
        }
      });

      setSectionsEnabled(enabledSections);
      setLoadingSections(false);
      // Fetch deal logs
      await fetchDealLogs();
      
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.fetchDealData");
      setError('Failed to fetch deal data');
    } finally {
      setLoading(false);
    }
  };

  // Load sections data
  const loadSectionsData = async () => {
    if (!dealId) return;

    try {
      setLoadingSections(true);
      const sections = await DealSectionsService.getAllDealSections(dealId);
      setSectionsData(sections);
      
      // Update sections enabled state
      const enabledSections: { [key in DealSectionName | 'BASIC_INFO']: boolean } = {
        'BASIC_INFO': true,
        [DealSectionName.OVERVIEW]: false,
        [DealSectionName.PURPOSE]: false,
        [DealSectionName.COLLATERAL]: false,
        [DealSectionName.FINANCIALS]: false,
        [DealSectionName.NEXT_STEPS]: false,
      };
      
      sections.sections.forEach(section => {
        if (section.sectionName in enabledSections) {
          enabledSections[section.sectionName as DealSectionName] = section.enabled;
        }
      });
      
      setSectionsEnabled(enabledSections);
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.loadSectionsData");
    } finally {
      setLoadingSections(false);
    }
  };

  // Load documents by section
  const loadDocumentsBySection = async () => {
    if (!dealId) return;

    try {
      setLoadingDocuments(true);
      const documents = await DealDocumentService.getAllDealDocumentsBySection(dealId);
      setDocumentsBySection(documents);
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.loadDocumentsBySection");
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Get available tabs based on enabled sections
  const getAvailableTabs = () => {
    const tabs = [
      { key: 'BASIC_INFO', label: 'Basic Info' }
    ];

    Object.entries(sectionsEnabled).forEach(([key, enabled]) => {
      if (enabled && key !== 'BASIC_INFO') {
        const sectionName = key as DealSectionName;
        tabs.push({
          key: sectionName,
          label: sectionName.charAt(0) + sectionName.slice(1).toLowerCase().replace(/_/g, ' ')
        });
      }
    });

    return tabs;
  };

  // Handle document download
  const handleDocumentDownload = async (documentToBeDownloaded: any) => {
    try {
      // Get signed URL for download
      const signedUrl = await DocumentStorageService.getDocumentSignedUrl(documentToBeDownloaded.filePath);
      // Fetch the file as a blob
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error('Failed to fetch document');
      const blob = await response.blob();
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = documentToBeDownloaded.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      toast.success('Download started');
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.handleDocumentDownload");
      toast.error('Failed to download document');
    }
  };

  // Handle document preview
  const handleDocumentPreview = async (document: any) => {
    try {
      // Get signed URL for preview
      const signedUrl = await DocumentStorageService.getDocumentSignedUrl(document.filePath);
      // Open in new tab
      window.open(signedUrl, '_blank');
      toast.success('Preview opened in new tab');
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.handleDocumentPreview");
      toast.error('Failed to preview document');
    }
  };

  // Handle log details
  const handleViewLogDetails = (log: DealLogModel) => {
    setSelectedLog(log);
    setIsLogDialogOpen(true);
  };

  const handleCloseLogDialog = () => {
    setIsLogDialogOpen(false);
    setSelectedLog(null);
  };

  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown User';
  };

  // Handle comment input change with mention detection
  const handleCommentInputChange = (value: string) => {
    setNewComment(value);
    // Implement proper mention detection
    const detectMention = handleMentionDetection(value, value.length);
    setIsMentionDropdownOpen(detectMention.isMentioning)
    setMentionQuery(detectMention.query)
    // filter the members
    getFilteredMembers(mentionQuery, members)
  };

  // Handle member selection from mention dropdown
  const handleMemberSelect = (member: any) => {
    // TODO: Implement proper member selection
    handleMemberSelection(member, newComment, newComment.length);
  };

  // Handle mention key navigation
  const handleMentionKeyDown = (e: React.KeyboardEvent) => {
    if (!isMentionDropdownOpen) return;

    const filteredMembers = getFilteredMembers(mentionQuery, members);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedMentionIndex(prev => 
        prev < filteredMembers.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedMentionIndex(prev => 
        prev > 0 ? prev - 1 : filteredMembers.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredMembers[selectedMentionIndex]) {
        handleMemberSelect(filteredMembers[selectedMentionIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsMentionDropdownOpen(false);
    }
  };

  // Fetch deal logs
  const fetchDealLogs = async () => {
    if (!dealId) return;

    try {
      setIsFetchingDealLogs(true);
      // TODO: Implement deal logs fetching
      const dealLogs = await DealLogService.getDealLogs(dealId);
      // Convert to camel case
      const camelCaseDealLogs = camelcaseKeys(dealLogs, { deep: true });
      setDealLogs(camelCaseDealLogs);
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.fetchDealLogs");
    } finally {
      setIsFetchingDealLogs(false);
    }
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Handle close
  const handleClose = () => {
    navigate('/dashboard');
  };

  // Handle delete document
  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    if (!dealId) return false;

    try {
      const success = await DealDocumentService.deleteDealDocument([documentId]);
      if (success) {
        toast.success('Document deleted successfully');
        // Refresh documents
        await loadDocumentsBySection();
        return true;
      }
      return false;
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.handleDeleteDocument");
      toast.error('Failed to delete document');
      return false;
    }
  };

  // Handle edit submit
  const handleEditSubmit = async (dealData: any, documents: any[], members: any[]) => {
    if (!dealId) return null;

    try {
      // Update the deal
      const updatedDeal = await DealService.updateDeal({
        id: dealId,
        ...dealData,
        updatedAt: new Date().toISOString(),
      });

      // Update documents if any
      if (documents && documents.length > 0) {
        await updateDealDocuments(dealId, documents, deal?.organizationId || '');
      }

      // Update members if any
      if (members && members.length > 0) {
        // This would require implementing member update logic
        // For now, we'll just refresh the deal data
        await fetchDealData();
      }

      toast.success('Deal updated successfully');
      setIsEditModalOpen(false);
      
      // Refresh the deal data
      await fetchDealData();
      
      return updatedDeal;
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage.handleEditSubmit");
      toast.error('Failed to update deal');
      return null;
    }
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Initialize data on mount
  useEffect(() => {
    if (dealId) {
      fetchDealData();
      loadDocumentsBySection();
      fetchDealLogs();
    }
  }, [dealId]);

  // Update deal members when members change
  useEffect(() => {
    if (deal && members.length > 0) {
      setDeal(prev => prev ? { ...prev, members } : null);
    }
  }, [members]);

  return {
    deal,
    loading,
    error,
    isEditModalOpen,
    handleEdit,
    handleClose,
    handleDeleteDocument,
    handleEditSubmit,
    handleCloseEditModal,
    dealLogs,
    isFetchingDealLogs,
    refreshDeal: fetchDealData,
    fetchDealLogs,
    // Members
    members,
    membersLoading,
    
    // Sections
    sectionsData,
    loadingSections,
    sectionsEnabled,
    activeTab,
    setActiveTab,
    getAvailableTabs,
    
    // Documents
    documentsBySection,
    loadingDocuments,
    loadDocumentsBySection,
    handleDocumentDownload,
    handleDocumentPreview,
    updateDealDocuments,
    
    // Comments
    dealComments,
    isFetchingDealComments,
    newComment,
    isSubmittingComment,
    editingCommentId,
    editingCommentText,
    isMentionDropdownOpen,
    mentionQuery,
    selectedMentionIndex,
    commentInputRef,
    handleCommentInputChange,
    handleMemberSelect,
    handleMentionKeyDown,
    handleUpdateCommentLocalWithMembers,
    handleCancelEdit,
    handleEditComment,
    setEditingCommentText,
    handleSubmitCommentWithMembers,
    getFilteredMembers,
    getMemberName,
    
    // Logs
    selectedLog,
    isLogDialogOpen,
    handleViewLogDetails,
    handleCloseLogDialog,
  };
};