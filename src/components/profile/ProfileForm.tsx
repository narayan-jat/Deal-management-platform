import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfileAvatarUploader from "./ProfileAvatarUploader";
import { ProfileData } from "@/types/Profile";


interface ProfileEditFormProps {
  data: ProfileData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleUploadProfileImage: (file: File) => Promise<string>;
  handleUpdateProfile: (updatedData: Partial<ProfileData>) => Promise<void>;
  loading: boolean;
}

export default function ProfileEditForm({ data, open, onOpenChange, handleUploadProfileImage, handleUpdateProfile, loading }: ProfileEditFormProps) {
  const [form, setForm] = useState<Partial<ProfileData>>({
    full_name: data?.full_name || "",
    title: data?.title || "",
    email: data?.email || "",
    profile_photo: data?.profile_photo || "",
    bio: data?.bio || "",
    organization_tag: data?.organization_tag || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (filePath: string) => {
    setForm({ ...form, profile_photo: filePath });
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
            <ProfileAvatarUploader imageUrl={form.profile_photo} handleImageChange={handleImageChange} handleUploadProfileImage={handleUploadProfileImage} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-black font-inter">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                name="full_name"
                value={form.full_name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-black font-inter">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                placeholder="Your job title"
                className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
              />
            </div>
          </div>

          {/* Organisation Field */}
          <div className="space-y-2">
            <Label htmlFor="organization_tag" className="text-sm font-medium text-black font-inter">
              Organisation
            </Label>
            <Input
              id="organization_tag"
              type="text"
              name="organization_tag"
              value={form.organization_tag || ""}
              onChange={handleChange}
              placeholder="Your organisation or company"
              className="border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20 font-inter"
            />
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
