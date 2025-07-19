import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Loader2 } from "lucide-react";
import defaultProfile from "@/assets/default-profile.png";
import { ProfileStorageService } from "@/services";

interface Props {
  imageUrl: string;
  handleImageChange: (filePath: string) => void;
  handleUploadProfileImage: (file: File) => Promise<string>;
}

export default function ProfileAvatarUploader({ imageUrl, handleImageChange, handleUploadProfileImage }: Props) {
  const [preview, setPreview] = useState<string | null>(imageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // handle upload profile image
      try {
        setIsUploading(true);
        const filePath = await handleUploadProfileImage(e.target.files[0]);
        try {
          const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(filePath);
          setPreview(signedUrl);
        } catch (error) {
          // If signed URL fails, use the stored path
          setPreview(filePath);
        }
        handleImageChange(filePath);
      } catch (error) {
        console.error("Error uploading profile image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <img
          src={preview || defaultProfile}
          alt="Profile Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg group-hover:border-godex-primary/30 transition-colors"
        />
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="avatar-upload" 
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-godex-primary hover:bg-godex-primary/90 text-white rounded-lg font-inter text-sm transition-colors"
        >
          <Upload className="w-4 h-4" />
          Change Photo
        </Label>
        <input
          name="profile_photo"
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <p className="text-xs text-gray-500 font-inter text-center max-w-xs">
        Upload a profile photo. JPG, PNG or GIF up to 5MB.
      </p>
    </div>
  );
}
