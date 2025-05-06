"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { RoleGate } from "@/components/auth/RoleGate";
import { ComponentProps, ReactNode } from "react";

type RoleLinkProps = ComponentProps<typeof Link> & {
  allowedRoles: ("USER" | "ADMIN")[];
  children: ReactNode;
};

/**
 * A link component that only renders if the user has the required role
 */
export function RoleLink({ 
  allowedRoles, 
  children, 
  ...props 
}: RoleLinkProps) {
  return (
    <RoleGate allowedRoles={allowedRoles}>
      <Link {...props}>{children}</Link>
    </RoleGate>
  );
} 