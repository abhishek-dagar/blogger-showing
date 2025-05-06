"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

type AuthRequiredProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * A component that only renders its children if the user is authenticated
 */
export function AuthRequired({ children, fallback = null }: AuthRequiredProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Don't render anything while loading
  if (isLoading) return null;
  
  // If not authenticated, show fallback
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
} 