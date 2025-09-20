import { useState, useEffect, useRef } from 'react';
import { DealCardType } from '@/types/deal/DealCard';
import { DealLogModel } from '@/types/deal/Deal.model';
import { DealSectionName } from '@/types/deal/Deal.sections';
import { DealSectionsService } from '@/services/deals/DealSectionsService';
import { useComment } from './useComment';
import { useDocumentUpload } from './useDocumentUpload';
import { DocumentStorageService } from '@/services/DocumentStorageService';
import { toast } from 'sonner';

export const useDealView = (deal: DealCardType) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DealLogModel | null>(null);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DealSectionName | 'BASIC_INFO'>('BASIC_INFO');
  const [sectionsData, setSectionsData] = useState<any>(null);
  const [sectionsEnabled, setSectionsEnabled] = useState<{ [key in DealSectionName]: boolean }>({
    [DealSectionName.OVERVIEW]: false,
    [DealSectionName.PURPOSE]: false,
    [DealSectionName.COLLATERAL]: false,
    [DealSectionName.FINANCIALS]: false,
    [DealSectionName.NEXT_STEPS]: false,
  });
  const [loadingSections, setLoadingSections] = useState(true);

  // Use the centralized comment hook
  const { 
    comments: dealComments, 
    isFetchingComments: isFetchingDealComments,
    handleUpdateCommentLocal,
    handleUpdateCommentLocalWithMembers,
    handleCancelEdit,
    handleSubmitComment,
    handleSubmitCommentWithMembers,
    handleEditComment,
    newComment,
    setNewComment,
    isSubmittingComment,
    editingCommentId,
    editingCommentText,
    setEditingCommentText,
    handleMentionDetection,
    handleMemberSelection,
    getFilteredMembers,
  } = useComment();

  // Use the document upload hook
  const { updateDealDocuments } = useDocumentUpload();

  // Mention-related state
  const [isMentionDropdownOpen, setIsMentionDropdownOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch deal sections data
  useEffect(() => {
    const fetchSectionsData = async () => {
      if (deal?.id) {
        try {
          setLoadingSections(true);
          const sectionsResponse = await DealSectionsService.getAllDealSections(deal.id);
          setSectionsData(sectionsResponse);
          
          // Set enabled sections
          if (sectionsResponse.sections) {
            const enabledSections: { [key in DealSectionName]: boolean } = {
              [DealSectionName.OVERVIEW]: false,
              [DealSectionName.PURPOSE]: false,
              [DealSectionName.COLLATERAL]: false,
              [DealSectionName.FINANCIALS]: false,
              [DealSectionName.NEXT_STEPS]: false,
            };
            
            sectionsResponse.sections.forEach((section: any) => {
              const sectionName = section.sectionName?.toUpperCase() as DealSectionName;
              if (sectionName && enabledSections.hasOwnProperty(sectionName)) {
                enabledSections[sectionName] = section.enabled;
              }
            });
            
            setSectionsEnabled(enabledSections);
            
            // Set first enabled section as active tab (or Basic Info if no sections enabled)
            const firstEnabledSection = Object.entries(enabledSections).find(([_, enabled]) => enabled);
            if (firstEnabledSection) {
              setActiveTab(firstEnabledSection[0] as DealSectionName);
            } else {
              setActiveTab('BASIC_INFO');
            }
          }
        } catch (error) {
          console.error('Error fetching sections data:', error);
          toast.error('Failed to load deal sections');
        } finally {
          setLoadingSections(false);
        }
      }
    };

    fetchSectionsData();
  }, [deal?.id]);

  // Helper function to get member name from memberId
  const getMemberName = (memberId: string): string => {
    const contributor = deal.contributors?.find(contributor => contributor.id === memberId);
    return contributor?.name || `Member ${memberId.slice(0, 8)}...`;
  };

  // Handle opening log details dialog
  const handleViewLogDetails = (log: DealLogModel) => {
    setSelectedLog(log);
    setIsLogDialogOpen(true);
  };

  // Handle closing log details dialog
  const handleCloseLogDialog = () => {
    setIsLogDialogOpen(false);
    setSelectedLog(null);
  };

  // Handle document download
  const handleDocumentDownload = async (dealDocument: any) => {
    try {
      if (dealDocument.filePath) {
        const signedUrl = await DocumentStorageService.getDocumentSignedUrl(dealDocument.filePath);
        const link = document.createElement('a');
        link.href = `${signedUrl}&download=${encodeURIComponent(dealDocument.fileName || 'document')}`;
        link.setAttribute('download', dealDocument.fileName || 'document');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }      
      toast.success(`Downloading ${dealDocument.fileName}`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  // Handle document preview
  const handleDocumentPreview = async (document: any) => {
    const fileExtension = document.fileName?.split('.').pop()?.toLowerCase();
    const previewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    
    if (previewableExtensions.includes(fileExtension)) {
      try {
        const signedUrl = await DocumentStorageService.getDocumentSignedUrl(document.filePath);
        window.open(signedUrl, '_blank');
        toast.success(`Opening ${document.fileName} in new tab`);
      } catch (error) {
        console.error('Error opening document preview:', error);
        toast.error('Failed to open document preview');
      }
    } else {
      toast.info(`${document.fileName} cannot be previewed. Downloading instead.`);
      handleDocumentDownload(document);
    }
  };

  // Handle mention input changes
  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, isEditing: boolean = false) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    if (isEditing) {
      setEditingCommentText(value);
    } else {
      setNewComment(value);
    }

    const mentionInfo = handleMentionDetection(value, cursorPosition);
    
    if (mentionInfo.isMentioning) {
      setIsMentionDropdownOpen(true);
      setMentionQuery(mentionInfo.query);
      setMentionStartIndex(mentionInfo.startIndex);
      setSelectedMentionIndex(0);
    } else {
      setIsMentionDropdownOpen(false);
      setMentionQuery('');
      setMentionStartIndex(-1);
    }
  };

  // Handle member selection from mention dropdown
  const handleMemberSelect = (member: any) => {
    const currentText = editingCommentId ? editingCommentText : newComment;
    const cursorPosition = commentInputRef.current?.selectionStart || 0;
    
    const updatedText = handleMemberSelection(member, currentText, cursorPosition);
    
    if (editingCommentId) {
      setEditingCommentText(updatedText);
    } else {
      setNewComment(updatedText);
    }
    
    setIsMentionDropdownOpen(false);
    setMentionQuery('');
    setMentionStartIndex(-1);
    
    setTimeout(() => {
      if (commentInputRef.current) {
        const newPosition = mentionStartIndex + member.name.length + 2;
        commentInputRef.current.focus();
        commentInputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Handle keyboard navigation in mention dropdown
  const handleMentionKeyDown = (e: React.KeyboardEvent) => {
    if (!isMentionDropdownOpen) return;
    
    const filteredMembers = getFilteredMembers(mentionQuery, deal.contributors || []);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredMembers[selectedMentionIndex]) {
          handleMemberSelect(filteredMembers[selectedMentionIndex]);
        }
        break;
      case 'Escape':
        setIsMentionDropdownOpen(false);
        setMentionQuery('');
        setMentionStartIndex(-1);
        break;
    }
  };

  // Get all available tabs (Basic Info + enabled sections)
  const getAvailableTabs = () => {
    const tabs = [{ key: 'BASIC_INFO', label: 'Basic Info' }];
    
    Object.entries(sectionsEnabled).forEach(([sectionName, enabled]) => {
      if (enabled) {
        const labels = {
          [DealSectionName.OVERVIEW]: 'Overview',
          [DealSectionName.PURPOSE]: 'Purpose',
          [DealSectionName.COLLATERAL]: 'Collateral',
          [DealSectionName.FINANCIALS]: 'Financials',
          [DealSectionName.NEXT_STEPS]: 'Next Steps',
        };
        tabs.push({
          key: sectionName as DealSectionName,
          label: labels[sectionName as DealSectionName]
        });
      }
    });
    
    return tabs;
  };

  return {
    // State
    selectedDocument,
    selectedLog,
    isLogDialogOpen,
    activeTab,
    sectionsData,
    sectionsEnabled,
    loadingSections,
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
    
    // Actions
    setActiveTab,
    handleViewLogDetails,
    handleCloseLogDialog,
    handleDocumentDownload,
    handleDocumentPreview,
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
    getAvailableTabs,
    updateDealDocuments,
  };
};
