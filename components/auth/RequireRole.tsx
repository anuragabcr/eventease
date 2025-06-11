import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReactNode } from "react";
import { Ban } from "lucide-react";
import Link from "next/link";

type RequireRoleProps = {
  children: ReactNode;
  allowedRoles: string[];
};

export default async function RequireRole({
  children,
  allowedRoles,
}: RequireRoleProps) {
  const session: Session | null = await getServerSession(authOptions);

  if (
    !session ||
    !session.user ||
    !session.user.role ||
    !allowedRoles.includes(session.user.role)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-6 text-center">
        <div className="bg-white p-10 rounded-xl shadow-2xl max-w-md w-full">
          <Ban className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-red-700 mb-4">
            Access Denied!
          </h1>
          <p className="text-gray-700 text-lg">
            You do not have permission to view this page. Please log in with the
            appropriate role.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
