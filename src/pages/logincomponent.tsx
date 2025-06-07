import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setError(""); // Clear old errors
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      // Redirect or show dashboard (optional)
      console.log("Login successful");
    }
  };

  const handleForgotPassword = () => {
    // You can implement password reset here later
    alert("Password reset not implemented yet.");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <div className="m-auto w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
          Login
        </h1>

        <div className="mt-4">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>

        <div className="mt-4 text-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="mt-6">
            <Alert variant="destructive">
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginComponent;
