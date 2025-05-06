"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RoleButton,
  RoleLink,
  AdminOnly,
  AuthRequired,
} from "@/components/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FileText, Settings, Shield, User, UserPlus } from "lucide-react";

export default function RoleUIExamplesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
            Admin Only
          </span>
          <span className="text-muted-foreground text-sm">This page is restricted to administrators</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">Role-Based UI Examples</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
            <CardDescription>
              Your current authentication status and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
            </p>
            {isAuthenticated && (
              <>
                <p className="mb-2">
                  <strong>Name:</strong> {user?.name}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                AuthRequired
              </CardTitle>
              <CardDescription>Only visible to logged-in users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AuthRequired
                fallback={
                  <div className="rounded-md bg-amber-50 border border-amber-100 p-4 text-amber-800">
                    This content is only available to authenticated users.
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/login">Sign in</Link>
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="rounded-md bg-green-50 border border-green-100 p-4 text-green-800">
                  This content is visible because you are authenticated!
                </div>
              </AuthRequired>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                AdminOnly
              </CardTitle>
              <CardDescription>Only visible to admins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminOnly
                fallback={
                  <div className="rounded-md bg-rose-50 border border-rose-100 p-4 text-rose-800">
                    This content requires admin privileges.
                  </div>
                }
              >
                <div className="rounded-md bg-green-50 border border-green-100 p-4 text-green-800">
                  This content is visible because you have admin privileges!
                </div>
              </AdminOnly>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Role-Based Buttons</CardTitle>
            <CardDescription>
              Buttons that only show for specific roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button>Always Visible</Button>

              <AuthRequired>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  User Content
                </Button>
              </AuthRequired>

              <RoleButton allowedRoles={["ADMIN"]}>
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </RoleButton>

              <RoleButton allowedRoles={["ADMIN"]} variant="destructive">
                Danger Zone
              </RoleButton>
            </div>

            <div className="flex flex-wrap gap-2">
              <RoleButton allowedRoles={["USER", "ADMIN"]} variant="secondary">
                <User className="mr-2 h-4 w-4" />
                Any User
              </RoleButton>

              <RoleButton allowedRoles={["USER"]} variant="outline">
                USER Only
              </RoleButton>

              <RoleButton allowedRoles={["ADMIN"]} variant="secondary">
                <Shield className="mr-2 h-4 w-4" />
                ADMIN Only
              </RoleButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role-Based Links</CardTitle>
            <CardDescription>
              Links that only show for specific roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/">Home (Always Visible)</Link>
              </Button>

              <RoleLink
                href="/profile"
                allowedRoles={["USER", "ADMIN"]}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Profile (Any User)
              </RoleLink>

              <RoleLink
                href="/admin"
                allowedRoles={["ADMIN"]}
                className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </RoleLink>

              <RoleLink
                href="/admin/users"
                allowedRoles={["ADMIN"]}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Users
              </RoleLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
