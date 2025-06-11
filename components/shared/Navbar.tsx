import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./Logout";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export default async function Navbar() {
  const session: Session | null = await getServerSession(authOptions);

  const buttonLinkStyle =
    "inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap";

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Eventease</span>
              <Image
                src="/images/logo.png"
                alt="Eventease Logo"
                width={160}
                height={80}
                className="h-auto w-auto object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            {session?.user && (
              <Link
                href="/dashboard"
                className={`${buttonLinkStyle} bg-cyan-200 text-cyan-800 hover:bg-cyan-300`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Link>
            )}

            {session?.user ? (
              <>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:inline">
                  Welcome,{" "}
                  <span className="font-bold text-gray-900">
                    {session.user.name || session.user.email}
                  </span>
                  !
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className={`${buttonLinkStyle} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                </Link>
                <Link
                  href="/login"
                  className={`${buttonLinkStyle} bg-sky-500 text-white hover:bg-sky-600`}
                >
                  <LogIn className="w-4 h-4 mr-2" /> Log in
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
