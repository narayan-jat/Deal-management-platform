import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfileAvatarUploader from "./ProfileAvatarUploader";
import { ProfileEditFormType } from "@/types/Profile";


interface ProfileEditFormProps {
  data: ProfileEditFormType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleUploadProfileImage: (originalProfileFilePath: string, file: File) => Promise<string>;
  handleUpdateProfile: (updatedData: ProfileEditFormType) => Promise<void>;
  loading: boolean;
}

export default function ProfileEditForm({ data, open, onOpenChange, handleUploadProfileImage, handleUpdateProfile, loading }: ProfileEditFormProps) {
  const [form, setForm] = useState<ProfileEditFormType>({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    profileUrl: data?.profileUrl || "",
    bio: data?.bio || "",
    organizationName: data?.organizationName || "",
    profilePhoto: data?.profilePhoto,
    location: data?.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (filePath: string) => {
    setForm({ ...form, profilePhoto: filePath });
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with data:", form);
      await handleUpdateProfile(form);
      onOpenChange(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 font-inter">Edit Profile</h2>
            <p className="text-sm text-gray-600 font-inter mt-1">
              Update your professional information and profile picture
            </p>
          </div>
          
          <div className="flex justify-center">
            <ProfileAvatarUploader originalProfileFilePath={form.profilePhoto} imageUrl={form.profileUrl} handleImageChange={handleImageChange} handleUploadProfileImage={handleUploadProfileImage} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-black font-inter">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-black font-inter">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
              />
            </div>
          </div>

          {/* Organisation Field */}
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-sm font-medium text-black font-inter">
              Organisation
            </Label>
            <Input
              id="organizationName"
              type="text"
              name="organizationName"
              value={form.organizationName || ""}
              onChange={handleChange}
              disabled
              placeholder="Enter your organisation"
              className="border-gray-300 bg-gray-50 text-gray-500 font-inter"
            />
            <p className="text-xs text-gray-500 font-inter">Organisation cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-black font-inter">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email || ""}
              disabled
              className="border-gray-300 bg-gray-50 text-gray-500 font-inter"
            />
            <p className="text-xs text-gray-500 font-inter">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-black font-inter">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-black font-inter">
              Professional Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself and your professional background..."
              className="min-h-[120px] border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-inter"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-godex-primary hover:bg-godex-primary/90 text-white font-inter px-6"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
