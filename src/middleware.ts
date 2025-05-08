import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Path patterns that require authentication
const authRequiredPaths = ["/profile", "/articles"];

// Path patterns that require ADMIN role
const adminRequiredPaths = ["/admin", "/examples/role-ui"];

// Ensure we have a valid secret
const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.error("NEXTAUTH_SECRET is not set in environment variables");
    throw new Error("NEXTAUTH_SECRET is not set");
  }
  return secret;
};

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
    const secret = getSecret();
    
    const token = await getToken({
      req: request,
      secret,
      secureCookie: process.env.NODE_ENV === "production",
    });

    // Log token status for debugging (remove in production)
    if (process.env.NODE_ENV !== "production") {
      console.log("Token status:", token ? "Present" : "Null");
      console.log("Request URL:", request.url);
      console.log("Environment:", process.env.NODE_ENV);
    }

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
    // In production, redirect to error page or home page
    if (process.env.NODE_ENV === "production") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // In development, let the page handle the error
    return NextResponse.next();
  }
} 