import React, { useRef } from 'react';
import { MessageCircle, Send, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MentionDropdown } from '@/components/ui/MentionDropdown';
import { formatDate } from '@/utility/Utility';
import { useAuth } from '@/context/AuthProvider';
import { canUserCommentOnDeal } from '@/utility/DealRoleUtils';

interface CommentsSectionProps {
  dealComments: any[];
  isFetchingDealComments: boolean;
  newComment: string;
  isSubmittingComment: boolean;
  editingCommentId: string | null;
  editingCommentText: string;
  isMentionDropdownOpen: boolean;
  mentionQuery: string;
  selectedMentionIndex: number;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
  getMemberName: (memberId: string) => string;
  handleCommentInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>, isEditing: boolean) => void;
  handleMentionKeyDown: (e: React.KeyboardEvent) => void;
  handleMemberSelect: (member: any) => void;
  handleSubmitCommentWithMembers: (deal: any) => void;
  handleUpdateCommentLocalWithMembers: (deal: any) => void;
  handleCancelEdit: () => void;
  handleEditComment: (comment: any) => void;
  getFilteredMembers: (query: string, members: any[]) => any[];
  deal: any;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
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
  getMemberName,
  handleCommentInputChange,
  handleMentionKeyDown,
  handleMemberSelect,
  handleSubmitCommentWithMembers,
  handleUpdateCommentLocalWithMembers,
  handleCancelEdit,
  handleEditComment,
  getFilteredMembers,
  deal
}) => {
  const { user } = useAuth();
  
  // Check if current user can comment on the deal
  const canComment = user ? canUserCommentOnDeal(user.id, deal.contributors || []) : false;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <span>Comments</span>
          <Badge variant="secondary" className="ml-2">
            {dealComments?.length || 0}
          </Badge>
        </h3>
      </div>
      <div className="p-6">
        {/* Add Comment Form - Only show if user can comment */}
        {canComment && (
          <div className="mb-6">
            <div className="flex space-x-3 items-center relative">
              <Textarea
                ref={commentInputRef}
                placeholder="Add a comment... Use @ to mention team members"
                value={newComment}
                onChange={(e) => handleCommentInputChange(e, false)}
                onKeyDown={handleMentionKeyDown}
                className="flex-1 min-h-[80px] resize-none"
                disabled={isSubmittingComment}
              />
              <Button
                onClick={() => handleSubmitCommentWithMembers(deal)}
                disabled={!newComment.trim() || isSubmittingComment}
              >
                <Send className="w-4 h-4" />
              </Button>
              
              {/* Mention Dropdown */}
              <MentionDropdown
                isOpen={isMentionDropdownOpen}
                members={getFilteredMembers(mentionQuery, deal.contributors || [])}
                selectedIndex={selectedMentionIndex}
                onSelectMember={handleMemberSelect}
                onClose={() => {}}
              />
            </div>
          </div>
        )}
        
        {/* Show message if user cannot comment */}
        {!canComment && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              You have view-only access to this deal. Only members with editor, admin, or owner roles can add comments.
            </p>
          </div>
        )}

        {/* Comments List */}
        {isFetchingDealComments ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading comments...</p>
          </div>
        ) : dealComments && dealComments.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {dealComments.map((comment, index) => (
              <div
                key={comment.id || index}
                className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {getMemberName(comment.memberId)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2 relative">
                      <Textarea
                        value={editingCommentText}
                        onChange={(e) => handleCommentInputChange(e, true)}
                        onKeyDown={handleMentionKeyDown}
                        className="min-h-[60px] resize-none"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCommentLocalWithMembers(deal)}
                          disabled={!editingCommentText.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                      
                      {/* Mention Dropdown for Edit Mode */}
                      <MentionDropdown
                        isOpen={isMentionDropdownOpen && editingCommentId === comment.id}
                        members={getFilteredMembers(mentionQuery, deal.contributors || [])}
                        selectedIndex={selectedMentionIndex}
                        onSelectMember={handleMemberSelect}
                        onClose={() => {}}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-700 break-words flex-1">
                        {comment.comment}
                      </p>
                      {/* Only show edit button if user can comment */}
                      {canComment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditComment(comment)}
                          className="ml-2 flex-shrink-0 p-2 h-8 w-8 hover:bg-gray-50 hover:border-gray-300"
                          title="Edit comment"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to add a comment</p>
          </div>
        )}
      </div>
    </div>
  );
};
