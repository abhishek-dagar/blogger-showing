"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User, FileText, Home, Shield } from "lucide-react";
import { useState } from "react";
import { AdminOnly, AuthRequired } from "@/components/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="font-bold text-xl">
                NextAuth App
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
                <Link
                  href="/articles"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Articles
                </Link>

                <AuthRequired>
                  {!isAdmin && (
                    <Link
                      href="/articles/my"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      My Articles
                    </Link>
                  )}
                </AuthRequired>

                <AdminOnly>
                  <Link
                    href="/admin"
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                  <Link
                    href="/admin/articles"
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    All Articles
                  </Link>
                </AdminOnly>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoading && !user ? (
                <div className="text-foreground">Loading...</div>
              ) : isAuthenticated ? (
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center mr-4 cursor-pointer">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="" alt={user?.name || "User"} />
                          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {user?.name || "User"}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({user?.role})
                          </span>
                        </span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="default" size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background z-10 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <AuthRequired>
              <Link
                href="/articles"
                className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Articles
              </Link>
              {!isAdmin && (
                <Link
                  href="/articles/my"
                  className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Articles
                </Link>
              )}
            </AuthRequired>

            <AdminOnly>
              <Link
                href="/admin"
                className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/admin/articles"
                className="text-foreground hover:bg-accent hover:text-accent-foreground block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Articles
              </Link>
            </AdminOnly>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {isAuthenticated ? (
              <div className="flex flex-col px-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user?.email} ({user?.role})
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    <Link 
                      href="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-4 flex flex-col space-y-2">
                <Button asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
