
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

  const userId = decodedToken.userId;

  try {
    const todayDate = new Date();
    const dateStart = startOfDay(todayDate);
    const dateEnd = endOfDay(todayDate);

    const scrumLog = await prisma.dailyScrumLog.findFirst({
      where: {
        userId,
        date: {
          gte: dateStart,
          lt: dateEnd,
        },
      },
    });

    if (!scrumLog) {
      return NextResponse.json({ log: null, message: 'No scrum log found for today.' }, { status: 200 }); // Or 404, depending on desired behavior
    }

    return NextResponse.json({ log: scrumLog }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user's daily scrum log for today:", error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
