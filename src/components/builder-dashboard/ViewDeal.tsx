import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { DealCardType } from '@/types/deal/DealCard';
import { DealStatus } from '@/types/deal/Deal.enums';
import { cn } from '@/lib/utils';
import { formatCurrency, getStatusInfo, formatDate } from '@/utility/Utility';

interface ViewDealProps {
  deal: DealCardType;
  onEdit: () => void;
  onClose?: () => void;
}

export default function ViewDeal({ deal, onEdit, onClose }: ViewDealProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const statusInfo = getStatusInfo(deal.status);

  // Handle document download
  const handleDocumentDownload = (document: any) => {
    // TODO: Implement document download logic
    console.log('Downloading document:', document.fileName);
  };

  // Handle document preview
  const handleDocumentPreview = (document: any) => {
    // TODO: Implement document preview logic
    console.log('Previewing document:', document.fileName);
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
                          {contributor.profilePhoto ? (
                            <img
                              src={contributor.profilePhoto}
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
    </div>
  );
}
