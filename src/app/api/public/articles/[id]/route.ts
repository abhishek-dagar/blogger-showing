import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all published articles for public view
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Fetch only published articles
    const articleId = (await params).id;
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return NextResponse.json(
      { message: "Error fetching published articles" },
      { status: 500 }
    );
  }
}