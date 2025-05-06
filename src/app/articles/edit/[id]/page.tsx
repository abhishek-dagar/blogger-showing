"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

type ArticleWithAuthor = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export default function ArticleDetailPage() {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [pendingPublishState, setPendingPublishState] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  useEffect(() => {
    // Fetch article when component mounts
    async function fetchArticle() {
      if (!user || !articleId) return;
      
      try {
        setIsLoadingArticle(true);
        const response = await fetch(`/api/articles/${articleId}`);
        
        if (response.status === 404) {
          setError("Article not found");
          return;
        }
        
        if (response.status === 403) {
          setError("You don't have permission to view this article");
          return;
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        
        const data = await response.json();
        setArticle(data.article);
        
        // Initialize edit form with current article data
        setEditedArticle({
          title: data.article.title,
          content: data.article.content,
          published: data.article.published,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to load article");
        setError("Failed to load article");
      } finally {
        setIsLoadingArticle(false);
      }
    }
    
    if (user) {
      fetchArticle();
    }
  }, [user, articleId]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditedArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  
  function handleQuillChange(content: string) {
    setEditedArticle((prev) => ({
      ...prev,
      content,
    }));
  }
  
  function handlePublishToggle(checked: boolean) {
    // If trying to publish, show confirmation dialog
    if (checked && !editedArticle.published) {
      setPendingPublishState(true);
      setShowPublishDialog(true);
    } 
    // If unpublishing, show confirmation dialog
    else if (!checked && editedArticle.published) {
      setPendingPublishState(false);
      setShowPublishDialog(true);
    }
    // If no state change, just update directly
    else {
      setEditedArticle(prev => ({
        ...prev,
        published: checked
      }));
    }
  }
  
  function confirmPublishChange() {
    // Update the edited article with the new publish state
    setEditedArticle(prev => ({
      ...prev,
      published: pendingPublishState
    }));
    setShowPublishDialog(false);
    
    // If we're not in edit mode, save immediately on publish toggle
    if (!isEditing && article) {
      // Create a temporary article object with the new published state
      const updatedArticle: ArticleWithAuthor = { 
        ...article, 
        published: pendingPublishState
      };
      
      // Update the UI immediately
      setArticle(updatedArticle);
      
      // Then save to the server
      saveArticleWithData({
        title: article.title,
        content: article.content,
        published: pendingPublishState
      });
    }
  }
  
  function cancelPublishChange() {
    setShowPublishDialog(false);
  }
  
  function validateForm() {
    const newErrors: {
      title?: string;
      content?: string;
    } = {};

    if (!editedArticle.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!editedArticle.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  function startEditing() {
    if (!article) return;
    
    setIsEditing(true);
    setEditedArticle({
      title: article.title,
      content: article.content,
      published: article.published,
    });
  }
  
  function cancelEditing() {
    setIsEditing(false);
    setErrors({});
    
    // Reset to original state
    if (article) {
      setEditedArticle({
        title: article.title,
        content: article.content,
        published: article.published,
      });
    }
  }
  
  async function saveArticleWithData(data: {
    title: string;
    content: string;
    published: boolean;
  }) {
    if (!article) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update article");
      }
      
      // Update the article with the response data
      setArticle(responseData.article);
      setIsEditing(false);
      toast.success(
        `Article ${data.published ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update article"
      );
      
      // Revert the UI state if there was an error
      if (article) {
        setArticle(article);
        setEditedArticle({
          title: article.title,
          content: article.content,
          published: article.published,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveArticle() {
    if (!validateForm() || !article) {
      return;
    }
    
    await saveArticleWithData(editedArticle);
  }

  if (isLoading && !user) {
    return (
      <div className="w-full py-10">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Loading...</CardDescription>
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
      <div className="w-full py-10">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to view articles
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={isAdmin ? "/admin/articles" : "/articles"} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>
      </div>

      {/* Publish/Unpublish Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingPublishState ? "Publish Article?" : "Unpublish Article?"}
            </DialogTitle>
            <DialogDescription>
              {pendingPublishState 
                ? "This will make your article visible to anyone with access to view articles." 
                : "This will mark your article as a draft and it won't be visible to others."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-2 my-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-500">
              {pendingPublishState 
                ? "Make sure your article is complete and ready to be seen."
                : "Any users who have the link will no longer be able to view this article."}
            </p>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={cancelPublishChange}>Cancel</Button>
            <Button 
              onClick={confirmPublishChange}
              variant={pendingPublishState ? "default" : "secondary"}
            >
              {pendingPublishState ? "Publish" : "Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-center items-center">
        {isLoadingArticle ? (
          <Card className="w-full">
            <CardContent className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-rose-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button className="mt-4" onClick={() => router.push("/articles")}>
                Return to Articles
              </Button>
            </CardContent>
          </Card>
        ) : article ? (
          <div className="w-full">
            <Card className="mb-6">
              {isEditing ? (
                <>
                  <CardHeader>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={editedArticle.title}
                        onChange={handleChange}
                        className={errors.title ? "border-rose-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-rose-500">{errors.title}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <RichTextEditor
                        value={editedArticle.content}
                        onChange={handleQuillChange}
                        placeholder="Write your article content here..."
                        error={!!errors.content}
                      />
                      {errors.content && (
                        <p className="text-sm text-rose-500 mt-2">
                          {errors.content}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="published"
                            checked={editedArticle.published}
                            onCheckedChange={handlePublishToggle}
                          />
                          <Label htmlFor="published" className="cursor-pointer">
                            {editedArticle.published ? (
                              <span className="flex items-center text-green-600">
                                <Eye className="mr-1 h-4 w-4" />
                                Published
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-600">
                                <EyeOff className="mr-1 h-4 w-4" />
                                Draft
                              </span>
                            )}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {editedArticle.published 
                            ? "This article is publicly visible" 
                            : "This article is only visible to you"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={cancelEditing}
                      disabled={isSubmitting}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={saveArticle} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {article.author.name || article.author.email}
                          <span className="mx-2">•</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.createdAt)}
                        </CardDescription>
                      </div>
                      
                      {/* Publish Switch (View Mode) */}
                      {(user.id === article.authorId || isAdmin) && (
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="article-published"
                              checked={article.published}
                              onCheckedChange={(checked) => {
                                // Only show dialog if the state is actually changing
                                if (checked !== article.published) {
                                  setPendingPublishState(checked);
                                  setShowPublishDialog(true);
                                }
                              }}
                            />
                            <Label htmlFor="article-published" className="cursor-pointer">
                              {article.published ? (
                                <span className="flex items-center text-green-600">
                                  <Eye className="mr-1 h-4 w-4" />
                                  Published
                                </span>
                              ) : (
                                <span className="flex items-center text-amber-600">
                                  <EyeOff className="mr-1 h-4 w-4" />
                                  Draft
                                </span>
                              )}
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {article.published 
                              ? "This article is publicly visible" 
                              : "This article is only visible to you"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Last updated: {formatDate(article.updatedAt)}
                    </div>
                    {(user.id === article.authorId || isAdmin) && (
                      <Button onClick={startEditing} variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Article
                      </Button>
                    )}
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
