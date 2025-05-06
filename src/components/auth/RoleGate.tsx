"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

type RoleGateProps = {
  children: ReactNode;
  allowedRoles: ("USER" | "ADMIN")[];
  fallback?: ReactNode;
};

/**
 * A component that conditionally renders children based on user roles
 * 
 * @param children - Content to render if user has required role
 * @param allowedRoles - Array of roles that are allowed to see the content
 * @param fallback - Optional content to render if user doesn't have required role
 */
export function RoleGate({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleGateProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Don't render anything while loading
  if (isLoading) return null;
  
  // If not authenticated or user doesn't have allowed role, show fallback
  if (!isAuthenticated || !user?.role || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  // User has required role, render children
  return <>{children}</>;
} 