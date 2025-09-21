import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';
import { toast } from 'sonner';

interface DocumentUploadButtonProps {
  dealId: string;
  organizationId?: string;
  onUpload: (documents: UploadDocumentForm[]) => Promise<any[]>;
  onSuccess?: (uploadedDocuments: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
  buttonText?: string;
  loadingText?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const DocumentUploadButton: React.FC<DocumentUploadButtonProps> = ({
  dealId,
  organizationId,
  onUpload,
  onSuccess,
  onError,
  className = '',
  buttonText = 'Upload Documents',
  loadingText = 'Uploading...',
  accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif',
  multiple = true,
  maxFiles = 10,
  disabled = false,
  variant = 'outline',
  size = 'default'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate file count
    if (fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types
    const validFiles = fileArray.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      return acceptedTypes.some(type => fileExtension === type);
    });

    if (validFiles.length !== fileArray.length) {
      toast.error('Some files have unsupported formats');
    }

    if (validFiles.length === 0) return;

    // Auto-upload files after selection
    await handleUpload(validFiles);
  };

  const handleUpload = async (files: File[]) => {
    if (!files.length) return

    setIsUploading(true);

    try {
      // Convert files to UploadDocumentForm format
      const documents: UploadDocumentForm[] = files.map(file => ({
        file: file,
      }));

      // Upload documents using the provided callback
      const uploadedDocuments = await onUpload(documents);
      
      if (uploadedDocuments.length > 0) {
        toast.success(`${uploadedDocuments.length} document(s) selected for upload successfully`);
        onSuccess?.(uploadedDocuments);
      }
    } catch (error) {
      const errorMsg = 'Failed to upload documents';
      console.error('Error uploading documents:', error);
      toast.error(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsUploading(false);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isDisabled = disabled || isUploading;

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={(e) => handleFileSelection(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={accept}
        id={`document-upload-button-${dealId}`}
        disabled={isDisabled}
      />
      <label
        htmlFor={`document-upload-button-${dealId}`}
        className={cn(
          "cursor-pointer",
          isDisabled && "cursor-not-allowed"
        )}
      >
        <Button
          variant={variant}
          size={size}
          disabled={isDisabled}
          className={cn("flex items-center space-x-2", className)}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="hidden sm:inline">{loadingText}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{buttonText}</span>
            </>
          )}
        </Button>
      </label>
    </div>
  );
};
