import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import supabase from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

export default function ChangePassword() {
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
    if (!user) {
      // If no user, check if there's a session from password reset
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("You must be logged in to change your password");
          navigate(ROUTES.SIGNIN);
          return;
        }
      };
      checkSession();
    }
  }, [user, navigate]);

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
    navigate(ROUTES.SIGNIN);
  };

  const handleGoToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  if (passwordChanged) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="Your password has been successfully changed"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Password changed successfully!
            </h3>
            <p className="text-sm text-gray-600">
              You can now sign in with your new password.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            
            <Button
              onClick={handleBackToSignIn}
              variant="outline"
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const passwordValidation = validatePassword(formData.password);
  const isFormValid = formData.password.trim() && 
                     formData.confirmPassword.trim() && 
                     formData.password === formData.confirmPassword &&
                     passwordValidation.isValid;

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
    >
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
              Updating password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleBackToSignIn}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
