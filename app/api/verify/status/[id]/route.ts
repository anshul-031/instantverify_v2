import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  return withLogging(request, async () => {
    try {
      const verification = await prisma.verification.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });

      if (!verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: verification.id,
        status: verification.status,
        lastUpdated: verification.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to fetch verification status:', error);
      return NextResponse.json(
        { error: 'Failed to fetch verification status' },
        { status: 500 }
      );
    }
  });
}