import { ROUTES } from "@/config/routes";
import { useNavigate } from "react-router-dom";
import ChangePassword from "@/pages/auth/ChangePassword";

// Account Change Password Wrapper
export default function AccountChangePasswordWrapper() {
  const navigate = useNavigate();
  
  return (
    <ChangePassword 
      useAuthLayout={false}
      title="Change Password"
      subtitle="Update your account password"
      successTitle="Password changed successfully!"
      successSubtitle="Your password has been updated successfully."
      showBackButton={true}
      backButtonText="Back to Profile"
      backButtonAction={() => navigate(ROUTES.PROFILE)}
      primarySuccessAction={() => navigate(ROUTES.DASHBOARD)}
      primarySuccessButtonText="Go to Dashboard"
      secondarySuccessAction={() => navigate(ROUTES.PROFILE)}
      secondarySuccessButtonText="Back to Profile"
      submitButtonText="Update Password"
      loadingText="Updating password..."
    />
  );
};