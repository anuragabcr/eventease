"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log("logout");

    try {
      const result = await signOut({ redirect: false });
      console.log(result);

      if (result?.url) {
        toast.success("Logged out successfully!");
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
      className="mx-1 text-sm/6 font-semibold text-gray-900 bg-red-300 p-3 rounded-2xl hover:bg-red-400 transition-colors cursor-pointer"
      aria-label="Log out"
    >
      Log out
    </button>
  );
}
