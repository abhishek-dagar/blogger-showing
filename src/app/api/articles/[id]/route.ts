import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Fetch a single article by ID
export async function GET(
  request: Request,
  {params}: { params: Promise<{ id: string }> }
) {
  try {
    // Get session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articleId = (await params).id;

    // Fetch the article
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author or an admin
    const isAuthor = article.authorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "You don't have permission to view this article" },
        { status: 403 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: "Error fetching article" },
      { status: 500 }
    );
  }
}

// PUT: Update an article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articleId = (await params).id;
    const body = await request.json();
    const { title, content, published } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    // Fetch the article to check ownership
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    // Check if the user is the author or an admin
    const isAuthor = existingArticle.authorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { message: "You don't have permission to update this article" },
        { status: 403 }
      );
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        published: Boolean(published),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Error updating article" },
      { status: 500 }
    );
  }
} 