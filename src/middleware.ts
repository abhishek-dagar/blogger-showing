import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Path patterns that require authentication
const authRequiredPaths = ["/profile", "/articles"];

// Path patterns that require ADMIN role
const adminRequiredPaths = ["/admin", "/examples/role-ui"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get token from session
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if path requires authentication
    const isAuthRequired = authRequiredPaths.some((path) =>
      pathname.startsWith(path)
    );

    // Check if path requires admin role
    const isAdminRequired = adminRequiredPaths.some((path) =>
      pathname.startsWith(path)
    );

    // If the user is not logged in and the path requires authentication
    if (isAuthRequired && !token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // If the user is logged in but not an admin and the path requires admin role
    if (isAdminRequired && (!token || token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is already logged in but tries to access login or signup pages
    if (token && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    // If there's an error with the token, let the page handle it
    return NextResponse.next();
  }
} 