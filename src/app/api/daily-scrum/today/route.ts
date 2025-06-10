
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }

  try {
    const todayDate = new Date();
    const dateStart = startOfDay(todayDate);
    const dateEnd = endOfDay(todayDate);

    const scrumLogs = await prisma.dailyScrumLog.findMany({
      where: {
        date: {
          gte: dateStart,
          lt: dateEnd,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // Add avatarUrl here if you add it to your User model
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                // Add avatarUrl here
              },
            },
          },
          orderBy: {
            createdAt: 'asc', // Oldest comments first
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Newest scrum logs first
      },
    });

    return NextResponse.json({ logs: scrumLogs }, { status: 200 });

  } catch (error) {
    console.error("Error fetching today's daily scrum logs:", error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
