"use client";

import { Button } from "@/components/ui/button";
import { RoleGate } from "@/components/auth/RoleGate";
import { ComponentProps, ReactNode } from "react";

type RoleButtonProps = ComponentProps<typeof Button> & {
  allowedRoles: ("USER" | "ADMIN")[];
  children: ReactNode;
};

/**
 * A button component that only renders if the user has the required role
 */
export function RoleButton({ 
  allowedRoles, 
  children, 
  ...props 
}: RoleButtonProps) {
  return (
    <RoleGate allowedRoles={allowedRoles}>
      <Button {...props}>{children}</Button>
    </RoleGate>
  );
} 