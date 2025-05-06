import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    // Get session to verify the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Valid name is required" },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = session.user.id;
    
    // Update user name
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Return data in a format that NextAuth can use for session updates
    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,  // Return the raw user object from Prisma
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
} 