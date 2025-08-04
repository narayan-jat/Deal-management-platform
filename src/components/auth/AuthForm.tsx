import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  organizationName?: string;
  organizationCode?: string;
  organizationType?: "create" | "join";
}

interface AuthFormProps {
  type: "signin" | "signup";
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitLabel: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  formData,
  onInputChange,
  onSubmit,
  loading,
  submitLabel,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) => {
  const isSignup = type === "signup";
  const isFormValid = isSignup 
    ? formData.email && formData.password && formData.confirmPassword && formData.firstName && formData.lastName && 
      (formData.organizationType === "create" ? formData.organizationName : formData.organizationCode) &&
      formData.password === formData.confirmPassword
    : formData.email && formData.password;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Two-column layout for signup on larger screens */}
      {isSignup ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <Label className="block text-sm font-medium text-black mb-2">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => onInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
                required={isSignup}
              />
            </div>

            {/* Email */}
            <div>
              <Label className="block text-sm font-medium text-black mb-2">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
                required
              />
            </div>

            {/* Password */}
            <PasswordInput 
              value={formData.password} 
              onChange={(e) => onInputChange("password", e.target.value)}
              placeholder={isSignup ? "Create a password" : "Enter your password"}
              label="Password"
            />

            {/* Location */}
            <div>
              <Label className="block text-sm font-medium text-black mb-2">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location || ""}
                onChange={(e) => onInputChange("location", e.target.value)}
                placeholder="Enter your location"
                className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Last Name */}
            <div>
              <Label className="block text-sm font-medium text-black mb-2">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => onInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
                required={isSignup}
              />
            </div>

            {/* Confirm Password */}
            <PasswordInput 
              value={formData.confirmPassword || ""} 
              onChange={(e) => onInputChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              label="Confirm Password"
            />

            {/* Organization Section */}
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-black mb-2">
                  Organization
                </Label>
                <Select value={formData.organizationType || "create"} onValueChange={(value: "create" | "join") => onInputChange("organizationType", value)}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20">
                    <SelectValue placeholder="Select organization option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create New Organization</SelectItem>
                    <SelectItem value="join">Join Existing Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.organizationType === "create" ? (
                <div>
                  <Label className="block text-sm font-medium text-black mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizationName"
                    type="text"
                    value={formData.organizationName || ""}
                    onChange={(e) => onInputChange("organizationName", e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
                    required={isSignup}
                  />
                  <p className="text-sm text-gray-500">Please fill N/A if you don't have an organization</p>
                </div>
              ) : (
                <div>
                  <Label className="block text-sm font-medium text-black mb-2">
                    Organization Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organizationCode"
                    type="text"
                    value={formData.organizationCode || ""}
                    onChange={(e) => onInputChange("organizationCode", e.target.value)}
                    placeholder="Enter organization code"
                    className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
                    required={isSignup}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Single column layout for signin */
        <div className="space-y-6">
          {/* Email */}
          <div>
            <Label className="block text-sm font-medium text-black mb-2">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
              required
            />
          </div>

          {/* Password */}
          <PasswordInput 
            value={formData.password} 
            onChange={(e) => onInputChange("password", e.target.value)}
            placeholder={isSignup ? "Create a password" : "Enter your password"}
            label="Password"
          />
        </div>
      )}

      {/* Password Match Error - Signup only */}
      {isSignup && formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <p className="text-sm text-red-500">
          Passwords do not match
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-godex-primary hover:bg-godex-primary/90 text-white"
        disabled={loading || !isFormValid}
      >
        {loading ? (type === "signup" ? "Creating account..." : "Signing in...") : submitLabel}
      </Button>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600">{bottomText} </span>
        <Link to={bottomLinkTo} className="text-godex-primary hover:text-godex-primary/80 font-medium">
          {bottomLinkText}
        </Link>
      </div>
    </form>
  );
};

export default AuthForm;  