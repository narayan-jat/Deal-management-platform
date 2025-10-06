import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ROUTES } from "@/config/routes";
import { SignUpFormType } from "@/types/auth/Signup";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useRequestEarlyAccess from "@/hooks/useRequestEarlyAccess";
import RequestAccessPopup from "@/components/landing/RequestAccessPopup";

export default function SignUp() {
  const navigate = useNavigate();
  const { loading, handleInputChange, handleSignUp, createSignInLink } = useAuthorization();
  const [askUserForEarlyAccess, setAskUserForEarlyAccess] = useState(true);
  const [isOrganizationApproved, setIsOrganizationApproved] = useState(false);
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

  const {accessRequestFormData, updateAccessRequestFormField, handleSubmitEarlyAccessRequest} = useRequestEarlyAccess();

  // Handle input changes
  const onInputChange = (field: keyof SignUpFormType, value: any) => {
    handleInputChange(formData, setFormData, field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await handleSignUp(formData);

    if (result.success) {
      navigate(createSignInLink());
    }
  };

  const handleRequestEarlyAccess = () => {
    // navigate to the home page and pass the requestearlyaccess in query params.
    setAskUserForEarlyAccess(false)
    setIsOrganizationApproved(false);
  }

  const handleCloseAccessPopup = () => {
    setIsOrganizationApproved(true);
    navigate(ROUTES.HOME)

  }
  return (
    // Show a small popup if the organization is not approved
    <>
      {
        isOrganizationApproved ? (
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
              bottomLinkTo={createSignInLink()}
            />
          </AuthLayout>
        ) : (
          <Dialog open={askUserForEarlyAccess} onOpenChange={setAskUserForEarlyAccess}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <h5 className="font-bold text-gray-900 font-inter">Has your organization or someone in your organization already been approved for early
                  access?</h5>
                </div>

                {/* Form */}
                <form className="space-y-4 sm:space-y-6">
                    {/* Give two buttons for yes and no */}
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setIsOrganizationApproved(true)}>Yes</Button>
                      <Button variant="outline" onClick={handleRequestEarlyAccess}>No</Button>
                    </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
      {
        !isOrganizationApproved && !askUserForEarlyAccess && (
          <RequestAccessPopup isOpen={!isOrganizationApproved} onClose={handleCloseAccessPopup} formData={accessRequestFormData} updateFormField={updateAccessRequestFormField} submitForm={handleSubmitEarlyAccessRequest}/>
        ) 
      }
    </>
  );
}
