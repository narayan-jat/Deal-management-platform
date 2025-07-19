import { useEffect, useState } from "react";
import { ProfileData, ProfileEditData } from "@/types/Profile";
import { useAuth } from "@/context/AuthProvider";
import { ProfileService, ProfileStorageService, ErrorService } from "@/services";

export default function useProfile() {
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [isOwner, setIsOwner] = useState(false);
	const [loading, setLoading] = useState(true);
	const [apiStatus, setApiStatus] = useState<string | null>(null);
	const { user } = useAuth();

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.id) {
				setLoading(false);
				return;
			}

			try {
				const profileData = await ProfileService.getProfile(user.id);

				if (profileData) {
					// Get signed URL for profile image if it exists
					if (profileData.profile_photo) {
						try {
							const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(profileData.profile_photo);
							setProfile({ ...profileData, profile_photo: signedUrl });
						} catch (error) {
							// If signed URL fails, use the stored path
							setProfile(profileData);
						}
					} else {
						setProfile(profileData);
					}

					setIsOwner(profileData.id === user.id);
				}
			} catch (error) {
				const errorMessage = ErrorService.handleApiError(error, "useProfile.fetchProfile");
				setApiStatus(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [user?.id]);

	const handleUploadProfileImage = async (file: File): Promise<string> => {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}

		try {
			// Currently uploading as new file even if the profile is being updated
			const result = await ProfileStorageService.uploadProfileImage(user.id, file);
			return result.path; // Return path for backward compatibility
		} catch (error) {
			const errorMessage = ErrorService.handleApiError(error, "useProfile.handleUploadProfileImage");
			setApiStatus(errorMessage);
			throw error;
		}
	};

	const handleUpdateProfile = async (updatedData: ProfileEditData): Promise<void> => {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}

		try {
			setLoading(true);

			const updatedProfile = await ProfileService.updateProfile(user.id, updatedData);

			// Get signed URL for profile image if it exists
			if (updatedProfile.profile_photo) {
				try {
					const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(updatedProfile.profile_photo);
					setProfile({ ...updatedProfile, profile_photo: signedUrl });
				} catch (error) {
					// If signed URL fails, use the stored path
					setProfile(updatedProfile);
				}
			} else {
				setProfile(updatedProfile);
			}

			setIsOwner(updatedProfile.id === user.id);
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
		handleUpdateProfile
	};
}