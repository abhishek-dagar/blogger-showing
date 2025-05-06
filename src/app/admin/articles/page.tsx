"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Eye, EyeOff, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleGate } from "@/components/auth/RoleGate";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default function AdminArticlesPage() {
  const { user, isLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);

  useEffect(() => {
    // Fetch all articles when component mounts
    async function fetchAllArticles() {
      if (!user) return;

      try {
        setIsLoadingArticles(true);
        const response = await fetch("/api/admin/articles");

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to load articles");
      } finally {
        setIsLoadingArticles(false);
      }
    }

    if (user && user.role === "ADMIN") {
      fetchAllArticles();
    }
  }, [user]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>All Articles</CardTitle>
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
      <div className="w-full py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Articles</h1>
          <Button asChild>
            <Link href="/articles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Article
            </Link>
          </Button>
        </div>

        {isLoadingArticles ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                There are no articles in the database yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">
                      {article.title}
                    </CardTitle>
                    {article.published ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <Eye className="mr-1 h-3 w-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        <EyeOff className="mr-1 h-3 w-3" />
                        Draft
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: article.content.substring(0, 100) + "...",
                      }}
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    Created {formatDate(article.createdAt)}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/articles/edit/${article.id}`}>
                      View Article
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
