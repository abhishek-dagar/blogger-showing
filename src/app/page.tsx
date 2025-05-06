import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRound, Shield, FileText, Lock } from "lucide-react";
import { AdminOnly, AuthRequired } from "@/components/auth/index";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <main className="flex-grow flex flex-col items-center py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          NextAuth RBAC App
        </h1>

        <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
          A modern demonstration of Next.js authentication with role-based
          access control.
        </p>

        {!isAuthenticated ? (
          <div className="flex flex-col gap-4 sm:flex-row justify-center items-center mb-16">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        ) : (
          <AuthRequired>
            <Card className="mb-16 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/20 dark:border-indigo-900/30">
              <CardHeader>
                <CardTitle>
                  {isAdmin ? "Admin Dashboard" : "User Dashboard"}
                </CardTitle>
                <CardDescription>
                  Logged in as {session.user.name} ({session.user.email})
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild>
                  <Link href="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/articles">
                    <FileText className="mr-2 h-4 w-4" />
                    My Articles
                  </Link>
                </Button>
                <AdminOnly>
                  <Button asChild variant="secondary">
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                </AdminOnly>
              </CardContent>
            </Card>
          </AuthRequired>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Secure login and signup with email and password using Auth.js
                credentials provider.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                Role-Based Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Different access levels for regular users and administrators
                with middleware protection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Prisma ORM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Type-safe database queries with Prisma ORM and SQLite database
                for secure data storage.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/examples/role-ui">
              View Role-Based UI Examples
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
