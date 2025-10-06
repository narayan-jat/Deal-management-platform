import { useEffect, useState } from "react";
import { ProfileEditFormType } from "@/types/Profile";
import { useAuth } from "@/context/AuthProvider";
import { ProfileService, ProfileStorageService, ErrorService } from "@/services";
import { useUserProfile } from "@/context/UserProfileProvider";
import { getSignedProfileImageUrl } from "@/utility/Utility";

export default function useProfile() {
	const [profile, setProfile] = useState<ProfileEditFormType | null>(null);
	const [isOwner, setIsOwner] = useState(false);
	const [loading, setLoading] = useState(false);
	const [apiStatus, setApiStatus] = useState<string | null>(null);
	const { user } = useAuth();
	const { userProfile, refreshUserProfile, loading: userProfileLoading } = useUserProfile();

	useEffect(() => {
		const getProfile = async () => {
			if (userProfile) {
				if (userProfile.profilePath) {
					const signedUrl = await getSignedProfileImageUrl(userProfile.profilePath);
					setProfile({ ...userProfile, profileUrl: signedUrl });
				} else {
					setProfile(userProfile);
				}
			}
			setIsOwner(userProfile.id === user.id);
		}
		getProfile();
	}, [userProfile, user]);

	const handleUploadProfileImage = async (originalProfileFilePath: string, file: File): Promise<string> => {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}

		try {
			// Currently uploading as new file even if the profile is being updated
			const result = await ProfileStorageService.updateProfileImage(user.id, file, originalProfileFilePath);
			return result.path; // Return path for backward compatibility
		} catch (error) {
			const errorMessage = ErrorService.handleApiError(error, "useProfile.handleUploadProfileImage");
			setApiStatus(errorMessage);
			throw error;
		}
	};

	const handleUpdateProfile = async (updatedData: Partial<ProfileEditFormType>): Promise<void> => {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}

		try {
			setLoading(true);
			// Remove the ProfileUrl from the updatedData
			const { profileUrl, ...rest } = updatedData;
			const updatedProfile = await ProfileService.updateProfile(user.id, rest);
			refreshUserProfile();
		} catch (error) {
			const errorMessage = ErrorService.handleApiError(error, "useProfile.handleUpdateProfile");
			setApiStatus(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return {
		profile,
		isOwner,
		loading,
		apiStatus,
		handleUploadProfileImage,
		handleUpdateProfile,
		userProfile,
		userProfileLoading,
	};
}