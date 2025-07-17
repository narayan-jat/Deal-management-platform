import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";

interface AuthFormProps {
  type: "signin" | "signup";
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  success: string;
  submitLabel: string;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkTo: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
  success,
  submitLabel,
  bottomText,
  bottomLinkText,
  bottomLinkTo,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label className="block text-sm font-medium text-black mb-2">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border-gray-300 focus:border-godex-primary focus:ring-godex-primary/20"
          required
        />
      </div>

      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button
        type="submit"
        className="w-full bg-godex-primary hover:bg-godex-primary/90 text-white"
        disabled={loading}
      >
        {loading ? (type === "signup" ? "Creating account..." : "Signing in...") : submitLabel}
      </Button>

      {error && (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertTitle>{type === "signup" ? "Sign-up failed" : "Sign-in failed"}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {success && (
        <div className="mt-6">
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </div>
      )}

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