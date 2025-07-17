import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthProvider";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess("Account created successfully! Please check your email to verify your account.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join GoDex and start managing your deals">
      <AuthForm
        type="signup"
        onSubmit={handleSignUp}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        error={error}
        success={success}
        submitLabel="Create Account"
        bottomText="Already have an account?"
        bottomLinkText="Sign in"
        bottomLinkTo="/signin"
      />
    </AuthLayout>
  );
};

export default SignUp;
