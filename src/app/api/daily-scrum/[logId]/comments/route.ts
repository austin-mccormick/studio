
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const commentSchema = z.object({
  text: z.string().min(1, { message: "Comment text cannot be empty" }),
});

interface RouteContext {
  params: {
    logId: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  const userId = decodedToken.userId; // This is the commenter's ID
  const { logId } = params;

  if (!logId) {
    return NextResponse.json({ error: 'Daily Scrum Log ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { text } = validation.data;

    // Check if the DailyScrumLog exists
    const dailyScrumLog = await prisma.dailyScrumLog.findUnique({
      where: { id: logId },
    });

    if (!dailyScrumLog) {
      return NextResponse.json({ error: 'Daily Scrum Log not found' }, { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        dailyScrumLogId: logId,
        userId, // The logged-in user who is commenting
      },
      include: {
        user: { // Include commenter's details in the response
            select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ message: 'Comment added successfully', comment: newComment }, { status: 201 });

  } catch (error) {
    console.error(`Error adding comment to log ${logId}:`, error);
    if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid input provided.', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while adding the comment.' }, { status: 500 });
  }
}
