import { useEffect, useState } from "react";
import { DealCommentModel } from "@/types/deal/Deal.model";
import { DealCommentService } from "@/services/deals/DealCommentService";
import { useAuth } from "@/context/AuthProvider";
import { useParams } from "react-router-dom";
import camelcaseKeys from "camelcase-keys";
import { toast } from "sonner";
import { NotificationService } from "@/services/NotificationService";
import { ErrorService } from "@/services/ErrorService";

export const useComment = () => {
  const { user } = useAuth();
  const { dealId } = useParams();
  const [comments, setComments] = useState<DealCommentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [mentions, setMentions] = useState<Record<string, any>[]>([]);

  // Fetch comments for the current deal
  const fetchComments = async () => {
    if (!dealId) return;

    try {
      setIsFetchingComments(true);
      const fetchedComments = await DealCommentService.getDealComments(dealId);
      const camelCaseComments = camelcaseKeys(fetchedComments, {
        deep: true,
      }) as DealCommentModel[];
      setComments(camelCaseComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setApiError(error.message);
    } finally {
      setIsFetchingComments(false);
    }
  };

  // Load comments when dealId changes
  useEffect(() => {
    if (dealId) {
      fetchComments();
    }
  }, [dealId]);

  // Create a new deal comment
  const handleCreateComment = async (
    comment: string
  ): Promise<DealCommentModel | null> => {
    if (!user?.id || !dealId) {
      setApiError("User not authenticated or deal ID missing");
      return null;
    }

    try {
      setLoading(true);
      const dealComment: Partial<DealCommentModel> = {
        dealId,
        memberId: user.id,
        comment,
      };

      const createdComment = await DealCommentService.createDealComment(
        dealComment
      );
      const camelCaseComment = camelcaseKeys(createdComment, {
        deep: true,
      }) as DealCommentModel;

      // Add the new comment to the local state
      setComments((prev) => [camelCaseComment, ...prev]);

      toast.success("Comment added successfully");
      return camelCaseComment;
    } catch (error) {
      console.error("Error creating comment:", error);
      setApiError(error.message);
      toast.error("Failed to add comment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing deal comment
  const handleUpdateComment = async (
    commentId: string,
    comment: string
  ): Promise<DealCommentModel | null> => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return null;
    }

    try {
      setLoading(true);
      const dealComment: Partial<DealCommentModel> = {
        id: commentId,
        comment,
      };

      const updatedComment = await DealCommentService.updateDealComment(
        dealComment
      );
      const camelCaseComment = camelcaseKeys(updatedComment, {
        deep: true,
      }) as DealCommentModel;

      // Update the comment in the local state
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? camelCaseComment : c))
      );

      toast.success("Comment updated successfully");
      return camelCaseComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      setApiError(error.message);
      toast.error("Failed to update comment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string): Promise<boolean> => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      await DealCommentService.deleteDealComment(commentId);

      // Remove the comment from the local state
      setComments((prev) => prev.filter((c) => c.id !== commentId));

      toast.success("Comment deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      setApiError(error.message);
      toast.error("Failed to delete comment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh comments
  const refreshComments = async () => {
    await fetchComments();
  };

  // add funtionality to mention deal members in the comment
  const handleMentionMember = async (memberId: string, commentId: string, comment: string) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return false;
    }
    try {
      // create a notification for the member
      await NotificationService.createNotification({
        userId: memberId,
        data: {
          "deal_id": dealId,
          "comment": comment,
        },
        type: "mentions",
      });
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useComment.handleMentionMember");
      console.error("Error mentioning member:", error);
    }
  };

  // Handle mention detection and selection
  const handleMentionDetection = (text: string, cursorPosition: number) => {
    const beforeCursor = text.slice(0, cursorPosition);
    const match = beforeCursor.match(/@(\w*)$/);
    
    if (match) {
      const query = match[1].toLowerCase();
      return {
        isMentioning: true,
        query,
        startIndex: beforeCursor.lastIndexOf('@'),
        endIndex: cursorPosition
      };
    }
    
    return {
      isMentioning: false,
      query: '',
      startIndex: -1,
      endIndex: -1
    };
  };

  // Handle member selection from mention dropdown
  const handleMemberSelection = (member: any, commentText: string, cursorPosition: number) => {
    const mentionInfo = handleMentionDetection(commentText, cursorPosition);
    
    if (mentionInfo.isMentioning) {
      const beforeMention = commentText.slice(0, mentionInfo.startIndex);
      const afterMention = commentText.slice(mentionInfo.endIndex);
      const newText = `${beforeMention}@${member.name} ${afterMention}`;
      
      // Update the comment text
      if (editingCommentId) {
        setEditingCommentText(newText);
      } else {
        setNewComment(newText);
      }
      
      // Add member to mentions for notification
      setMentions(prev => [...prev, { memberId: member.id, name: member.name }]);
      
      return newText;
    }
    
    return commentText;
  };

  // Get filtered members for mention dropdown
  const getFilteredMembers = (query: string, allMembers: any[]) => {
    if (!query) return allMembers;
    
    return allMembers.filter(member => 
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const extractMentions = (commentText: string, allMembers: any[]) => {
    const mentions: any[] = [];
  
    // Match @ followed by letters, numbers, spaces, dots, hyphens, or apostrophes
    // Stop at first punctuation or line break
    const fullMentionRegex = /@([A-Za-z0-9 .'-]+?)(?=[.,!?;:]|\s|$)/g;
  
    let match;
    while ((match = fullMentionRegex.exec(commentText)) !== null) {
      let mentionedName = match[1].trim();
      const member = allMembers.find(
        m => m.name.trim().toLowerCase().includes(mentionedName.toLowerCase()) || m.email.trim().toLowerCase().includes(mentionedName.toLowerCase())
      );
      if (member) {
        if (!mentions.some(m => m.memberId === member.id)) {
          mentions.push({ memberId: member.id, name: member.name });
        }
      }
    }
  
    return mentions;
  };
  

  // Handle comment submission with members for mention processing
  const handleSubmitCommentWithMembers = async (members: any[]) => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const createdComment = await handleCreateComment(newComment.trim());
      
      // Extract and process mentions from the comment text
      console.log("createdComment", createdComment);
      if (createdComment) {
        const extractedMentions = extractMentions(newComment.trim(), members);
        if (extractedMentions.length > 0) {
          for (const mention of extractedMentions) {
            await handleMentionMember(mention.memberId, createdComment.id, newComment.trim());
          }
        }
      }
      
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle comment submission (legacy function)
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await handleSubmitCommentWithMembers([]);
  };
  // Handle comment edit
  const handleEditComment = (comment: DealCommentModel) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment);
  };

  // Handle comment update with members for mention processing
  const handleUpdateCommentLocalWithMembers = async (members: any[]) => {
    if (!editingCommentId || !editingCommentText.trim()) return;

    try {
      const updatedComment = await handleUpdateComment(editingCommentId, editingCommentText.trim());
      
      // Extract and process mentions from the comment text
      if (updatedComment) {
        const extractedMentions = extractMentions(editingCommentText.trim(), members);
        if (extractedMentions.length > 0) {
          for (const mention of extractedMentions) {
            await handleMentionMember(mention.memberId, updatedComment.id, editingCommentText.trim());
          }
        }
      }
      
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Handle comment update (legacy function)
  const handleUpdateCommentLocal = async () => {
    if (!editingCommentId || !editingCommentText.trim()) return;
    await handleUpdateCommentLocalWithMembers([]);
  };

  // Handle cancel comment edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  return {
    comments,
    loading,
    isFetchingComments,
    apiError,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    newComment,
    setNewComment,
    isSubmittingComment,
    editingCommentId,
    editingCommentText,
    setEditingCommentText,
    refreshComments,
    handleEditComment,
    handleUpdateCommentLocal,
    handleUpdateCommentLocalWithMembers,
    handleCancelEdit,
    handleSubmitComment,
    handleSubmitCommentWithMembers,
    handleMentionMember,
    handleMentionDetection,
    handleMemberSelection,
    getFilteredMembers,
    mentions,
  };
};
