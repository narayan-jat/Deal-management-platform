import { useEffect, useState } from "react";
import { ProfileData, ProfileEditFormType } from "@/types/Profile";
import { useAuth } from "@/context/AuthProvider";
import { ProfileService, ProfileStorageService, ErrorService } from "@/services";
import camelcaseKeys from "camelcase-keys";

export default function useProfile() {
	const [profile, setProfile] = useState<ProfileEditFormType | null>(null);
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
				// Change this to camelcase
				const camelCaseProfileData = camelcaseKeys(profileData, { deep: true });
				if (camelCaseProfileData) {
					// Get signed URL for profile image if it exists
					if (camelCaseProfileData.profilePhoto) {
						try {
							const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(camelCaseProfileData.profilePhoto);
							setProfile({ ...camelCaseProfileData, profileUrl: signedUrl });
						} catch (error) {
							// If signed URL fails, use the stored path
							setProfile(camelCaseProfileData);
						}
					} else {
						setProfile(camelCaseProfileData);
					}

					setIsOwner(camelCaseProfileData.id === user.id);
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
			const camelCaseUpdatedProfile = camelcaseKeys(updatedProfile, { deep: true });

			// Get signed URL for profile image if it exists
			if (camelCaseUpdatedProfile.profilePhoto) {
				try {
					const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(camelCaseUpdatedProfile.profilePhoto);
					setProfile({ ...camelCaseUpdatedProfile, profileUrl: signedUrl });
				} catch (error) {
					// If signed URL fails, use the stored path
					setProfile(camelCaseUpdatedProfile);
				}
			} else {
				setProfile(camelCaseUpdatedProfile);
			}

			setIsOwner(camelCaseUpdatedProfile.id === user.id);
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