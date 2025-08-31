import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2, 
  Users, 
  FileText, 
  Edit, 
  Download,
  Eye,
  Trash2,
  Plus,
  Clock,
  Tag,
  MessageSquare,
  ArrowLeft,
  Activity,
  MessageCircle,
  Send,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { DealCardType } from '@/types/deal/DealCard';
import { DealStatus } from '@/types/deal/Deal.enums';
import { cn } from '@/lib/utils';
import { formatCurrency, getStatusInfo, formatDate } from '@/utility/Utility';
import { DealLogModel, DealCommentModel } from '@/types/deal/Deal.model';
import { parseLogData } from '@/utility/LogDataParser';
import { getLogIcon } from '@/utility/LogIconUtils';
import DealLogDetailsDialog from './DealLogDetailsDialog';
import { useComment } from '@/hooks/useComment';
import { MentionDropdown } from '@/components/ui/MentionDropdown';
import { DocumentUploadButton } from './DocumentUploadButton';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface ViewDealProps {
  deal: DealCardType;
  onEdit: () => void;
  onClose?: () => void;
  dealLogs: DealLogModel[];
  isFetchingDealLogs: boolean;
  onRefreshDeal?: () => void;
}

export default function ViewDeal({ 
  deal, 
  onEdit, 
  onClose, 
  dealLogs, 
  isFetchingDealLogs,
  onRefreshDeal
}: ViewDealProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DealLogModel | null>(null);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);

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

  const statusInfo = getStatusInfo(deal.status);

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
  const handleDocumentDownload = (document: any) => {
    // TODO: Implement document download logic
  };

  // Handle document preview
  const handleDocumentPreview = (document: any) => {
    // TODO: Implement document preview logic
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

    // Check for mention detection
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
    
    // Focus back to input and set cursor position after the mention
    setTimeout(() => {
      if (commentInputRef.current) {
        const newPosition = mentionStartIndex + member.name.length + 2; // +2 for @ and space
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
                <p className="text-sm text-gray-500">Deal Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Document Upload Button */}
              <DocumentUploadButton
                dealId={deal.id}
                organizationId={deal.organizationId}
                onUpload={async (documents) => {
                  return await updateDealDocuments(deal.id, documents, deal.organizationId || '');
                }}
                onSuccess={() => {
                  if (onRefreshDeal) {
                    onRefreshDeal();
                  }
                }}
                variant="outline"
                size="default"
                buttonText="Upload Documents"
                loadingText="Uploading..."
              />

              {/* Edit Deal Button */}
              <Button
                onClick={onEdit}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Deal</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Deal Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Overview Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Deal Overview</span>
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Status and Amount Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requested Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(deal.requestedAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={cn("text-xs font-medium", statusInfo.color)}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Industry and Location Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium text-gray-900">{deal.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{deal.location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium text-gray-900">{formatDate(deal.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium text-gray-900">{formatDate(deal.endDate || '')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Meeting</p>
                      <p className="font-medium text-gray-900">{formatDate(deal.nextMeetingDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {deal.notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
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
                {/* Add Comment Form */}
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
                      onClick={() => handleSubmitCommentWithMembers(deal.contributors || [])}
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
                      onClose={() => setIsMentionDropdownOpen(false)}
                    />
                  </div>
                </div>

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
                                  onClick={() => handleUpdateCommentLocalWithMembers(deal.contributors || [])}
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
                                onClose={() => setIsMentionDropdownOpen(false)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <p className="text-sm text-gray-700 break-words flex-1">
                                {comment.comment}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditComment(comment)}
                                className="ml-2 flex-shrink-0 p-2 h-8 w-8 hover:bg-gray-50 hover:border-gray-300"
                                title="Edit comment"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
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

            {/* Documents Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                  <Badge variant="secondary" className="ml-2">
                    {deal.documents?.length || 0}
                  </Badge>
                </h3>
              </div>
              <div className="p-6">
                {deal.documents && deal.documents.length > 0 ? (
                  <div className="space-y-3">
                    {deal.documents.map((document, index) => (
                      <div
                        key={document.id || index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div 
                          className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleDocumentPreview(document)}
                        >
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                              {document.fileName}
                            </p>
                            <p className="text-xs text-gray-500 hidden sm:block">
                              {document.mimeType} • {formatDate(document.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocumentDownload(document);
                            }}
                            className="p-2 h-8 w-8 hover:bg-blue-50 hover:border-blue-200"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                    <p className="text-sm text-gray-400">Documents will appear here once uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Logs Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Activity Log</span>
                  <Badge variant="secondary" className="ml-2">
                    {dealLogs?.length || 0}
                  </Badge>
                </h3>
              </div>
              <div className="p-6">
                {isFetchingDealLogs ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading activity log...</p>
                  </div>
                ) : dealLogs && dealLogs.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {dealLogs.map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-0"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getLogIcon(log.logType, log.logData)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {getMemberName(log.memberId)}
                              </p>
                              <Badge variant="outline" className="text-xs flex-shrink-0 mt-1 sm:mt-0">
                                {log.logType}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-1 break-words">
                              {parseLogData(log.logData)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(log.createdAt)}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewLogDetails(log)}
                              className="p-2 h-8 w-8 hover:bg-gray-50 hover:border-gray-300"
                              title="View log details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No activity yet</p>
                    <p className="text-sm text-gray-400">Activity log will appear here once actions are performed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Collaborators */}
          <div className="space-y-6">
            {/* Collaborators Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Collaborators</span>
                  <Badge variant="secondary" className="ml-2">
                    {deal.contributors?.length || 0}
                  </Badge>
                </h3>
              </div>
              <div className="p-6">
                {deal.contributors && deal.contributors.length > 0 ? (
                  <div className="space-y-4">
                    {deal.contributors.map((contributor, index) => (
                      <div
                        key={contributor.id || index}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {contributor.profilePath ? (
                            <img
                              src={contributor.profilePath}
                              alt={contributor.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {contributor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {contributor.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {contributor.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            {contributor.title} • {contributor.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No collaborators yet</p>
                    <p className="text-sm text-gray-400">Team members will appear here once added</p>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Deal Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(deal.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(deal.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Details Dialog */}
      <DealLogDetailsDialog
        isOpen={isLogDialogOpen}
        onClose={handleCloseLogDialog}
        selectedLog={selectedLog}
        getMemberName={getMemberName}
      />
    </div>
  );
}
