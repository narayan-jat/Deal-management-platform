import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthProvider";
import { Toaster, toast } from 'sonner';

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      toast.error(signInError.message);
    } else {
      toast.success("Signed in successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <AuthLayout title="Sign in" subtitle="Sign in to your account">
      <AuthForm
        type="signin"
        onSubmit={handleSignIn}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        submitLabel="Sign in"
        bottomText="Don't have an account?"
        bottomLinkText="Sign up"
        bottomLinkTo="/signup"
      />
      <Toaster position="top-right" richColors />
    </AuthLayout>
  );
};

export default SignIn;
