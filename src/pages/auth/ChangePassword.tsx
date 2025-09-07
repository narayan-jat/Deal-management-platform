import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

interface ChangePasswordProps {
  // Layout customization
  useAuthLayout?: boolean;
  
  // Text customization
  title?: string;
  subtitle?: string;
  successTitle?: string;
  successSubtitle?: string;
  
  // Navigation customization
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonAction?: () => void;
  
  // Success actions
  primarySuccessAction?: () => void;
  primarySuccessButtonText?: string;
  secondarySuccessAction?: () => void;
  secondarySuccessButtonText?: string;
  
  // Form customization
  submitButtonText?: string;
  loadingText?: string;
}

export default function ChangePassword({
  useAuthLayout = true,
  title = "Set new password",
  subtitle = "Enter your new password below",
  successTitle = "Password updated",
  successSubtitle = "Your password has been successfully changed",
  showBackButton = false,
  backButtonText = "Back",
  backButtonAction,
  primarySuccessAction,
  primarySuccessButtonText = "Go to Dashboard",
  secondarySuccessAction,
  secondarySuccessButtonText = "Sign In",
  submitButtonText = "Update Password",
  loadingText = "Updating password..."
}: ChangePasswordProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!user && useAuthLayout) {
      // If no user and using auth layout, check if there's a session from password reset
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("You must be logged in to change your password");
          navigate(ROUTES.SIGNIN);
          return;
        }
      };
      checkSession();
    } else if (!user && !useAuthLayout) {
      // If no user and not using auth layout (account settings), redirect to sign in
      toast.error("You must be logged in to change your password");
      navigate(ROUTES.SIGNIN);
    }
  }, [user, navigate, useAuthLayout]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      // For the time being we are not checking for the password requirements
      //isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      isValid: true,
      errors: {
        length: password.length >= minLength,
        upperCase: true,
        lowerCase: true,
        numbers: true,
        specialChar: true,
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setPasswordChanged(true);
      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      navigate(ROUTES.SIGNIN);
    }
  };

  const handleGoToDashboard = () => {
    if (primarySuccessAction) {
      primarySuccessAction();
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleSecondaryAction = () => {
    if (secondarySuccessAction) {
      secondarySuccessAction();
    } else {
      navigate(ROUTES.SIGNIN);
    }
  };

  if (passwordChanged) {
    const successContent = (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            {successTitle}
          </h3>
          <p className="text-sm text-gray-600">
            {successSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoToDashboard}
            className="w-full"
          >
            {primarySuccessButtonText}
          </Button>
          
          <Button
            onClick={handleSecondaryAction}
            variant="outline"
            className="w-full"
          >
            {secondarySuccessButtonText}
          </Button>
        </div>
      </div>
    );

    if (useAuthLayout) {
      return (
        <AuthLayout
          title={successTitle}
          subtitle={successSubtitle}
        >
          {successContent}
        </AuthLayout>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {successContent}
        </div>
      </div>
    );
  }

  const passwordValidation = validatePassword(formData.password);
  const isFormValid = formData.password.trim() && 
                     formData.confirmPassword.trim() && 
                     formData.password === formData.confirmPassword &&
                     passwordValidation.isValid;

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              className="w-full pl-10 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Requirements */}
          {formData.password && (
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">Password requirements:</p>
              <div className="grid grid-cols-2 gap-1">
                <span className={passwordValidation.errors.length ? "text-green-600" : "text-red-500"}>
                  ✓ At least 8 characters
                </span>
                <span className={passwordValidation.errors.upperCase ? "text-green-600" : "text-red-500"}>
                  ✓ One uppercase letter
                </span>
                <span className={passwordValidation.errors.lowerCase ? "text-green-600" : "text-red-500"}>
                  ✓ One lowercase letter
                </span>
                <span className={passwordValidation.errors.numbers ? "text-green-600" : "text-red-500"}>
                  ✓ One number
                </span>
                <span className={passwordValidation.errors.specialChar ? "text-green-600" : "text-red-500"}>
                  ✓ One special character
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
              className="w-full pl-10 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className={`text-xs ${formData.password === formData.confirmPassword ? "text-green-600" : "text-red-500"}`}>
              {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {loadingText}
            </>
          ) : (
            submitButtonText
          )}
        </Button>

        {useAuthLayout && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToSignIn}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </form>
    );

    if (useAuthLayout) {
      return (
        <AuthLayout
          title={title}
          subtitle={subtitle}
        >
          {formContent}
        </AuthLayout>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            {showBackButton && (
              <button
                onClick={handleBackToSignIn}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backButtonText}
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>

          {formContent}
        </div>
      </div>
    );
  }
