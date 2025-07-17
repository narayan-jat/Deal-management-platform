import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthProvider";
import { Toaster, toast } from 'sonner';


const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
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

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      toast.error(signUpError.message);
    } else {
      toast.success("Account created successfully! Please check your email to verify your account before signing in.");
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
        submitLabel="Create Account"
        bottomText="Already have an account?"
        bottomLinkText="Sign in"
        bottomLinkTo="/signin"
      />
      <Toaster position="top-right" richColors />
    </AuthLayout>
  );
};

export default SignUp;
