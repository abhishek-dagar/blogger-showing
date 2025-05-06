"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleGate } from "@/components/auth/RoleGate";
import {
  ClipboardList,
  Users,
  FileText,
  Settings
} from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RoleGate
      allowedRoles={["ADMIN"]}
      fallback={
        <div className="container py-10">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need administrator privileges to view this page
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your application</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Articles Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Articles
              </CardTitle>
              <CardDescription>
                Manage all user articles in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                View, edit, and manage articles created by all users.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href="/admin/articles">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View All Articles
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Users Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Users
              </CardTitle>
              <CardDescription>
                Manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                View all users and change their roles between USER and ADMIN.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </RoleGate>
  );
} 