import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ROUTES } from "@/config/routes";
import { SignInFormType } from "@/types/auth/Signup";

export default function SignIn() {
  const navigate = useNavigate();
  const { loading, handleInputChange, handleSignIn, redirectUrl, createSignUpLink } = useAuthorization();

  // Form state
  const [formData, setFormData] = useState<SignInFormType>({
    email: "",
    password: "",
    confirmPassword: "", // Not used in signin but kept for consistency
  });

  // Handle input changes
  const onInputChange = (field: keyof SignInFormType, value: any) => {
    handleInputChange(formData, setFormData, field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleSignIn(formData);
    
    if (result.success) {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    }
  };



  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your GoDex account"
    >
      <AuthForm
        type="signin"
        formData={formData}
        onInputChange={onInputChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Sign In"
        bottomText="Don't have an account?"
        bottomLinkText="Sign up"
        bottomLinkTo={createSignUpLink()}
      />
    </AuthLayout>
  );
}
