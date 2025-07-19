import ProfileDisplay from "@/components/profile/ProfileDisplay";
import ProfileEditForm from "@/components/profile/ProfileForm";
import DotLoader from "@/components/ui/loader";
import useProfile from "@/hooks/useProfile";

export default function Profile() {
  const { profile, isOwner, loading, handleUpdateProfile, handleUploadProfileImage } = useProfile();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DotLoader />
      </div>
    );
  }

  console.log("profile", profile);
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {profile && (
        <ProfileDisplay data={profile} isOwner={isOwner} handleUpdateProfile={handleUpdateProfile} handleUploadProfileImage={handleUploadProfileImage} loading={loading} />
      )}
      {!profile && (
        <ProfileEditForm data={profile} handleUpdateProfile={handleUpdateProfile} handleUploadProfileImage={handleUploadProfileImage} loading={loading} open={true} onOpenChange={() => {}} />
      )}
    </div>
  );
}