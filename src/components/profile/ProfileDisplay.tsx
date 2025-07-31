import { Edit } from "lucide-react";
import { ProfileEditFormType } from "@/types/Profile";
import { Button } from "../ui/button";
import { useState } from "react";
import ProfileEditForm from "./ProfileForm";
import defaultProfile from "@/assets/default-profile.png";

interface ProfileDisplayProps {
  data: ProfileEditFormType;
  isOwner: boolean;
  handleUpdateProfile: (updatedData: Partial<ProfileEditFormType>) => Promise<void>;
  handleUploadProfileImage: (originalProfileFilePath: string, file: File) => Promise<string>;
  loading: boolean;
}

export default function ProfileDisplay({ data, isOwner, handleUpdateProfile, handleUploadProfileImage, loading }: ProfileDisplayProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 items-center text-center sm:text-left relative">
        <div className="relative">
          <img
            src={data.profileUrl || defaultProfile}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg"
          />
        </div>
        <div className="mt-4 sm:mt-0 flex-1">
          <h2 className="text-2xl font-bold text-black font-inter mb-1">
            {data.firstName + " " + data.lastName || "No name provided"}
          </h2>
          <p className="text-lg text-godex-primary font-medium font-inter mb-2">
            {data.title || "Engineer(default)"} @ {data.organizationName || "Godex(default)"}
          </p>
          <p className="text-gray-600 font-inter">
            {data.email || "No email provided"}
          </p>
        </div>
        {isOwner && (
          <Button className="mt-4 flex items-center gap-2" onClick={handleEditProfile}>
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
      </div>
      
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-black font-inter mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed font-inter">
          {data.bio && (
            <span>{data.bio}</span>
          )}
          {!data.bio && (
            <span>Please add a professional bio to your profile</span>
          )}
          </p>
        </div>
        {isEditingProfile && (
          <ProfileEditForm data={data} handleUpdateProfile={handleUpdateProfile} handleUploadProfileImage={handleUploadProfileImage} loading={loading} open={isEditingProfile} onOpenChange={setIsEditingProfile} />
        )}
    </div>
  );
}
