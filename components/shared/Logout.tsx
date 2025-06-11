"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const buttonLinkStyle =
    "inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap";

  const handleLogout = async () => {
    try {
      const result = await signOut({ redirect: false });

      if (result?.url) {
        toast.success("Logged out successfully!", {
          position: "bottom-center",
        });
        router.push("/");
        router.refresh();
      } else {
        toast.error("Logout failed. Please try again.");
        console.error("signOut did not return a URL or failed:", result);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logout.");
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`${buttonLinkStyle} bg-red-500 text-white hover:bg-red-600 cursor-pointer`}
      aria-label="Log out"
    >
      <LogOut className="w-4 h-4 mr-2" /> Log out{" "}
    </button>
  );
}
