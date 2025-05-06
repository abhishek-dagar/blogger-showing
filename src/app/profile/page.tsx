"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isLoading, updateSession } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [updatedName, setUpdatedName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Initialize name input with user's current name when data is loaded
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // Force a reload if the UI doesn't update
  useEffect(() => {
    if (updatedName && user && user.name !== updatedName) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [updatedName, user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setStatusMessage({ text: "Name cannot be empty", type: "error" });
      return;
    }

    // Save current name for update
    const updatedNameValue = name.trim();
    
    // Show loading only during the API request
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedNameValue }),
      });

      // API request is done, hide loading state immediately
      setIsSubmitting(false);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }

      // Remember the updated name
      setUpdatedName(updatedNameValue);

      // Show immediate success message
      setStatusMessage({
        text: "Profile updated successfully",
        type: "success",
      });
      
      toast.success("Profile updated successfully");

      // Try to update the session with the new user data
      try {
        // Pass just the name property for update
        await updateSession({
          name: responseData.user.name
        });
        
        // Force a refresh of the page data
        router.refresh();
      } catch (sessionError) {
        console.error("Error updating session:", sessionError);
      }
    } catch (error) {
      // Ensure loading state is disabled on error
      setIsSubmitting(false);
      
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
      setStatusMessage({
        text:
          error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    }
  }

  // Don't show loading indicator for the initial auth state check
  if (isLoading && !user) {
    return (
      <div className="container max-w-md m-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>Loading your profile details...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-md m-auto py-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You need to be logged in to view your profile</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md m-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>View and edit your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={user.name || "User"} />
              <AvatarFallback className="text-xl">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{user.role}</p>
                <p className="text-xs text-muted-foreground">Role</p>
              </div>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-md ${
                statusMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-100"
                  : "bg-rose-50 text-rose-800 border border-rose-100"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={name === user.name || !name.trim() || isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-muted-foreground">Account Information</p>
        </CardFooter>
      </Card>
    </div>
  );
}
