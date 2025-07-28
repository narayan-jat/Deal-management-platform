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
      const { error } = await signUp(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        throw error;
      }
      // Get the user's id
      const { data: user } = await supabase.auth.getUser();
      // Update the user's profile with the first name, last name, and location
      await ProfileService.updateProfile(user.user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
      });

      if (formData.organizationType === "create") {
        const organization: any = await OrganizationService.createOrganization({
          name: formData.organizationName,
          code: await getUniqueOrgCode(),
          createdBy: user.user.id,
        });
        // Add this user to organization members as leader since it's the creator.
        if (organization) {
          await OrganizationMemberService.createOrgMember({
            organizationId: organization.id,
            memberId: user.user.id,
            role: OrganizationRole.LEADER,
          });
        }
      }else{
        const organization: any = await OrganizationService.getOrganizationByCode(formData.organizationCode);
        if (organization) {
          await OrganizationMemberService.createOrgMember({
            organizationId: organization.id,
            memberId: user.user.id,
            role: OrganizationRole.MEMBER,
          });
        }
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