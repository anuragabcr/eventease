import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/dashboard/attendees",
  "/dashboard/new-event",
];

const roleProtectedRoutes: Record<string, string[]> = {
  "/dashboard": ["EVENT_OWNER", "ADMIN", "STAFF"],
  "/dashboard/attendees": ["EVENT_OWNER", "ADMIN"],
  "/dashboard/new-event": ["EVENT_OWNER"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  for (const route in roleProtectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      const userRole = token.role;

      if (!allowedRoles.includes(userRole!)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}
