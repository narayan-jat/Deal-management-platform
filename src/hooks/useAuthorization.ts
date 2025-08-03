import { useState } from "react";
import supabase from "@/lib/supabase";
import { SignUpFormType, SignInFormType } from "@/types/auth/Signup";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";
import { ProfileService } from "@/services/ProfileService";
import { OrganizationService } from "@/services/organization/OrganizationService";
import { getUniqueOrgCode } from "./utils";
import { OrganizationMemberService } from "@/services/organization/OrganizationMemberService";
import { OrganizationRole } from "@/types/organization/Organization.model";
import axios from "axios";
/**
 * This hook is used to handle the authorization process.
 * It is used to sign up and sign in a user.
 * It is also used to handle the input change for any form.
 * It is used to handle the sign up and sign in process.
 * It is used to handle the organization creation and joining process.
 */
export const useAuthorization = () => {
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  // Generic form handler for any form data
  const handleInputChange = <T extends Record<string, any>>(
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    field: keyof T,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sign up handler
  const handleSignUp = async (formData: SignUpFormType) => {
    setLoading(true);
    
    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return { error: "Passwords do not match" };
      }

      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast.error("First name and last name are required");
        return { error: "First name and last name are required" };
      }

      if (formData.organizationType === "create" && !formData.organizationName.trim()) {
        toast.error("Organization name is required");
        return { error: "Organization name is required" };
      }

      if (formData.organizationType === "join" && !formData.organizationCode.trim()) {
        toast.error("Organization code is required");
        return { error: "Organization code is required" };
      }

      // Sign up with Supabase
      const {data: signUpData, error } = await signUp(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        throw error;
      }

      // const signUpData = {
      //   user: {
      //     id: "03da50fa-5bd5-477f-9020-11b49c6927d2",
      //   },
      // };
      // // Get the user's id
      console.log("user", signUpData.user);

      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
      };

      const organizationData = {
        type: formData.organizationType,
        name: formData?.organizationName,
        code: formData?.organizationCode,
      };
      
      // Call the create-user-data edge function
      const response = await axios.post(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user-data`,
        {
          userId: signUpData.user.id,
          profileData,
          organizationData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.status !== 200) {
        console.log("response", response);
        throw new Error(response.data.error);
      }

      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in handler
  const handleSignIn = async (formData: SignInFormType) => {
    setLoading(true);
    
    try {
      if (!formData.email || !formData.password) {
        toast.error("Email and password are required");
        return { error: "Email and password are required" };
      }

      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleInputChange,
    handleSignUp,
    handleSignIn,
  };
};