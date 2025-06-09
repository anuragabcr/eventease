"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "EVENT_OWNER" }),
    });

    if (res.ok) router.push("/login");
    else alert("Signup failed");
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border p-2"
      />
      <button type="submit" className="bg-black text-white w-full py-2">
        Sign Up
      </button>
    </form>
  );
}
