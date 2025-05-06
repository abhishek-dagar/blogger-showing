"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, User, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
};

export default function PublicArticleDetailPage() {
  const { id } = useParams();
  const articleId = id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublishedArticle() {
      try {
        setIsLoadingArticle(true);
        setError(null);
        const response = await fetch(`/api/public/articles/${articleId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article not found");
          } else {
            throw new Error("Failed to fetch article");
          }
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load article"
        );
        toast.error(
          error instanceof Error ? error.message : "Failed to load article"
        );
      } finally {
        setIsLoadingArticle(false);
      }
    }

    fetchPublishedArticle();
  }, [articleId]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="w-full py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/articles" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>
      </div>

      {isLoadingArticle ? (
        <Card>
          <CardContent className="flex justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-rose-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/public/articles">Back to Articles</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : article ? (
        <div className="space-y-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {article.title}
                  </CardTitle>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  <span>By {article.author.name || article.author.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  <span>Created {formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  <span>
                    Last updated {formatDate(article.updatedAt)} at{" "}
                    {formatTime(article.updatedAt)}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button asChild variant="outline">
                <Link href="/articles">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Articles
                </Link>
              </Button>

              <div className="space-x-2">
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mb-2">Article not found</h3>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or isn't published.
            </p>
            <Button asChild>
              <Link href="/public/articles">Back to Articles</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
