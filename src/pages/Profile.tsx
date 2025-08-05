import ProfileDisplay from "@/components/profile/ProfileDisplay";
import ProfileEditForm from "@/components/profile/ProfileForm";
import DotLoader from "@/components/ui/loader";
import useProfile from "@/hooks/useProfile";

export default function Profile() {
  const { profile, isOwner, loading, handleUpdateProfile, handleUploadProfileImage, userProfileLoading } = useProfile();


  if (loading || userProfileLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DotLoader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {profile && (
        <ProfileDisplay data={profile} isOwner={isOwner} handleUpdateProfile={handleUpdateProfile} handleUploadProfileImage={handleUploadProfileImage} loading={loading} />
      )}
      {!profile && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-500">No profile found</p>
        </div>
      )}
    </div>
  );
}