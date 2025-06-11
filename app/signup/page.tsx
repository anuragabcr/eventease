/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Briefcase,
  UserPlus,
} from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [role, setRole] = useState("EVENT_OWNER");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const signupToastId = toast.loading("Creating your account...");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (res.ok) {
        toast.success("Account created successfully! Please log in.", {
          id: signupToastId,
        });
        router.push("/login");
      } else {
        const errorData = await res.json();
        toast.error(`Signup failed: ${errorData.message || res.statusText}`, {
          id: signupToastId,
        });
        console.error("API error during signup:", errorData);
      }
    } catch (error: any) {
      console.error("Network or unexpected error during signup:", error);
      toast.error(
        `An unexpected error occurred: ${error.message || "Please try again."}`,
        { id: signupToastId }
      );
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 lg:p-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Create Your Account
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Join us to manage your events or explore new opportunities!
        </p>

        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label
              htmlFor="name"
              className="text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <User className="w-5 h-5 mr-2 text-blue-500" /> Your Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              placeholder="e.g., Jane Doe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className=" text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <Mail className="w-5 h-5 mr-2 text-blue-500" /> Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              placeholder="e.g., jane@company.com"
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

          <div>
            <label
              htmlFor="repassword"
              className=" text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <ShieldCheck className="w-5 h-5 mr-2 text-blue-500" /> Confirm
              Password
            </label>
            <input
              type="password"
              id="repassword"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 text-gray-900"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className=" text-md font-semibold text-gray-700 mb-2 flex items-center"
            >
              <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> Select Your
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white" // Added bg-white for dropdown
              required
            >
              <option value="EVENT_OWNER">Event Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 inline-flex items-center justify-center"
          >
            <UserPlus className="w-5 h-5 mr-2" /> Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-sm font-light text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
