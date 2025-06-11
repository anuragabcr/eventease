"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginToastId = toast.loading("Signing in...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Login error:", result.error);
      toast.error(
        `Login failed: ${result.error || "Please check your credentials."}`,
        { id: loginToastId }
      );
    } else if (result?.ok) {
      toast.success("Login successful! Redirecting...", { id: loginToastId });
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Sign in to your account
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Welcome back! Please enter your credentials to continue.
        </p>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className=" text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <Mail className="w-5 h-5 mr-2 text-blue-500" /> Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className=" text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <Lock className="w-5 h-5 mr-2 text-blue-500" /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 transition-colors cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
          >
            <LogIn className="w-5 h-5 mr-2" /> Sign in
          </button>

          <p className="text-center text-sm font-light text-gray-500 mt-6">
            Don’t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
