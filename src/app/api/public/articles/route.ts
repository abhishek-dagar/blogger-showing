import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all published articles for public view
export async function GET() {
  try {
    // Fetch only published articles
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return NextResponse.json(
      { message: "Error fetching published articles" },
      { status: 500 }
    );
  }
}