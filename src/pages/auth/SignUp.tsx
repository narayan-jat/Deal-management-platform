import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ROUTES } from "@/config/routes";
import { SignUpFormType } from "@/types/auth/Signup";

export default function SignUp() {
  const navigate = useNavigate();
  const { loading, handleInputChange, handleSignUp } = useAuthorization();
  
  // Form state
  const [formData, setFormData] = useState<SignUpFormType>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    location: "",
    organizationName: "",
    organizationCode: "",
    organizationType: "create",
  });

  // Handle input changes
  const onInputChange = (field: keyof SignUpFormType, value: any) => {
    handleInputChange(formData, setFormData, field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleSignUp(formData);
    
    if (result.success) {
      navigate(ROUTES.SIGNIN);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join GoDex to manage your deals efficiently"
    >
      <AuthForm
        type="signup"
        formData={formData}
        onInputChange={onInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Account"
        bottomText="Already have an account?"
        bottomLinkText="Sign in"
        bottomLinkTo={ROUTES.SIGNIN}
      />
    </AuthLayout>
  );
}
