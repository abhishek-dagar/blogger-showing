"use client";

import { ReactNode } from "react";
import { RoleGate } from "@/components/auth/RoleGate";

type AdminOnlyProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * A component that only renders its children if the user is an admin
 */
export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  return (
    <RoleGate 
      allowedRoles={["ADMIN"]}
      fallback={fallback}
    >
      {children}
    </RoleGate>
  );
} 