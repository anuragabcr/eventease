import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./Logout";

export default async function Navbar() {
  const session: Session | null = await getServerSession(authOptions);
  console.log(session);

  return (
    <>
      <header className="bg-[#e0e6ea]">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="">
              <span className="sr-only">Eventease</span>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={200}
                height={100}
              />
            </Link>
          </div>

          <div className="lg:flex lg:flex-1 lg:justify-end items-center">
            {session && session.user ? (
              <>
                <span className="mx-2 text-sm/6 font-semibold text-gray-900">
                  Welcome, {session.user.name || session.user.email}!
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="mx-1 text-sm/6 font-semibold text-gray-900 bg-blue-300 p-3 rounded-2xl hover:bg-blue-400 transition-colors"
                >
                  Sign Up <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link
                  href="/login"
                  className="mx-1 text-sm/6 font-semibold text-gray-900 bg-sky-300 p-3 rounded-2xl hover:bg-sky-400 transition-colors"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
