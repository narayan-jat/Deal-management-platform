import { DealCardType } from "@/types/deal/DealCard";
import { DealLogModel, DealModel, DealCommentModel } from "@/types/deal/Deal.model";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DealService } from "@/services/deals/DealService";
import { DealLogService } from "@/services/deals/DealLogService";
import { DealCommentService } from "@/services/deals/DealCommentService";
import { DealMemberService } from "@/services/deals/DealMemberService";
import { ProfileService } from "@/services/ProfileService";
import { ProfileStorageService } from "@/services/ProfileStorageService";
import { ErrorService } from "@/services/ErrorService";
import { DealDocumentService } from "@/services/deals/DealDocumentService";
import { toast } from "sonner";
import { useDashboard } from "./useDashboard";
import { useCreateEditDeal } from "./useCreateEditDeal";
import { UploadDocumentForm } from "@/types/deal/Deal.documents";
import { InviteMemberForm } from "@/types/deal/Deal.members";
import camelcaseKeys from "camelcase-keys";
import { getSignedProfileImageUrl } from "@/utility/Utility";

export const useViewDealPage = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFetchingDealLogs, setIsFetchingDealLogs] = useState(false);
  const [isFetchingDealComments, setIsFetchingDealComments] = useState(false);
  const [dealLogs, setDealLogs] = useState<DealLogModel[]>([]);
  const [dealComments, setDealComments] = useState<DealCommentModel[]>([]);
  const { handleEditDeal, handleDeleteDocument, handleCreateComment: createComment, handleUpdateComment: updateComment } = useCreateEditDeal();

  useEffect(() => {
    const fetchDealCardDetails = async () => {
      if (dealId) {
        // Try to get deal data from sessionStorage first
        const storedDealData = sessionStorage.getItem('viewDealData');
        if (storedDealData) {
          try {
            const dealData = JSON.parse(storedDealData);
            // Verify it's the correct deal
            if (dealData.id === dealId) {
              setDeal(dealData);
  
              // Fetch the deal logs and comments
              setIsFetchingDealLogs(true);
              setIsFetchingDealComments(true);
              
              const [dealLogs, dealComments] = await Promise.all([
                DealLogService.getDealLogs(dealId),
                DealCommentService.getDealComments(dealId)
              ]);
              
              const camelCaseDealLogs = camelcaseKeys(dealLogs, { deep: true });
              const camelCaseDealComments = camelcaseKeys(dealComments, { deep: true });
              
              setDealLogs(camelCaseDealLogs);
              setDealComments(camelCaseDealComments);
            }
          } catch (error) {
            console.error('Error parsing stored deal data:', error);
          } finally {
            setLoading(false);
            setIsFetchingDealLogs(false);
            setIsFetchingDealComments(false);
          }
        }
        else {
          // Get the deal from the deal ID.
          refreshDealCardDetails(dealId);
        }
      }
    }
    fetchDealCardDetails();
  }, [dealId]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditSubmit = async (dealData: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
    try {
      const updatedDeal = await handleEditDeal(dealData, documents, members);
      if (updatedDeal) {
        toast.success('Deal updated successfully');
        setIsEditModalOpen(false);
        // Refresh the deal data
        await refreshDealCardDetails(dealId);
      }
      return updatedDeal;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
      return null;
    }
  };

  const handleCreateComment = async (comment: string): Promise<DealCommentModel | null> => {
    if (!dealId) return null;
    
    try {
      const createdComment = await createComment(dealId, comment);
      if (createdComment) {
        toast.success('Comment added successfully');
        // Refresh comments
        await refreshDealComments(dealId);
      }
      return createdComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  };

  const handleUpdateComment = async (commentId: string, comment: string): Promise<DealCommentModel | null> => {
    if (!dealId) return null;
    
    try {
      const updatedComment = await updateComment(commentId, dealId, comment);
      if (updatedComment) {
        toast.success('Comment updated successfully');
        // Refresh comments
        await refreshDealComments(dealId);
      }
      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
      return null;
    }
  };

  const refreshDealComments = async (dealId: string) => {
    try {
      setIsFetchingDealComments(true);
      const comments = await DealCommentService.getDealComments(dealId);
      const camelCaseComments = camelcaseKeys(comments, { deep: true });
      setDealComments(camelCaseComments);
    } catch (error) {
      ErrorService.handleApiError(error, "useViewDealPage");
    } finally {
      setIsFetchingDealComments(false);
    }
  };

  const refreshDealCardDetails = async (dealId: string) => {
      try {
        setLoading(true);
        // Get the deal from the deal ID.
        const deals = await DealService.getDeals([dealId]);
  
        // Get the members of the deals to show on the card.
        await Promise.all(deals.map(async (deal) => {
          const dealMembers = await DealMemberService.getDealMembers(deal.id);
          const contributors = await Promise.all(
            dealMembers.map(async (member) => {
              try {
                const memberDetails = await ProfileService.getProfile(member.member_id);
                if (!memberDetails) return null;
                return {
                  id: memberDetails.id,
                  name: memberDetails.first_name + ' ' + memberDetails.last_name,
                  email: memberDetails.email,
                  title: memberDetails.title,
                  profilePath: await getSignedProfileImageUrl(memberDetails.profile_path),
                  role: member.role,
                };
              } catch (error) {
                ErrorService.handleApiError(error, "useDashboard");
                return null;
              }
            })
          );
          // Filter out any nulls (in case of failed lookups)
          deal.contributors = contributors.filter(Boolean);
        }));
  
        // Get the documents of the deals to show on the card.
        await Promise.all(deals.map(async (deal) => {
          const dealDocuments = await DealDocumentService.getDealDocuments(deal.id);
          deal.documents = dealDocuments.map((document) => ({
            id: document.id,
            fileName: document.file_name,
            filePath: document.file_path,
            mimeType: document.mime_type,
            signatureStatus: document.signature_status,
            uploadedAt: document.uploaded_at,
            uploadedBy: document.uploaded_by,
          }));
        }));
  
        // convert to camelCase
        const camelCaseDeals = camelcaseKeys(deals, { deep: true });
        if (camelCaseDeals.length > 0) {
          setDeal(camelCaseDeals[0]);
        }
        
        // Fetch the deal logs and comments
        setIsFetchingDealLogs(true);
        setIsFetchingDealComments(true);
        
        const [dealLogs, dealComments] = await Promise.all([
          DealLogService.getDealLogs(dealId),
          DealCommentService.getDealComments(dealId)
        ]);
        
        const camelCaseDealLogs = camelcaseKeys(dealLogs, { deep: true });
        const camelCaseDealComments = camelcaseKeys(dealComments, { deep: true });
        
        setDealLogs(camelCaseDealLogs);
        setDealComments(camelCaseDealComments);
      } catch (error) {
        ErrorService.handleApiError(error, "useDashboard");
      } finally {
        setLoading(false);
        setIsFetchingDealLogs(false);
        setIsFetchingDealComments(false);
      }
    };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return {
    dealId,
    deal,
    loading,
    isEditModalOpen,
    handleEdit,
    handleClose,
    isFetchingDealLogs,
    isFetchingDealComments,
    dealLogs,
    dealComments,
    handleEditDeal,
    handleDeleteDocument,
    handleEditSubmit,
    handleCloseEditModal,
    handleCreateComment,
    handleUpdateComment,
  };
};