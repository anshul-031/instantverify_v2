import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';
import { convertVerificationToDetails } from '@/lib/services/verification/utils';

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
        include: {
          user: true
        }
      });

      if (!verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        );
      }

      // Convert Prisma model to VerificationDetails type
      const details = convertVerificationToDetails(verification);
      return NextResponse.json(details);
    } catch (error) {
      logger.error('Failed to fetch verification:', error);
      return NextResponse.json(
        { error: 'Failed to fetch verification' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: Request, { params }: Props) {
  return withLogging(request, async (req) => {
    try {
      const data = await req.json();
      
      const verification = await prisma.verification.update({
        where: { id: params.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          user: true
        }
      });

      logger.info('Verification updated successfully', { id: params.id });

      // Convert and return updated verification
      const details = convertVerificationToDetails(verification);
      return NextResponse.json(details);
    } catch (error) {
      logger.error('Failed to update verification:', error);
      return NextResponse.json(
        { error: 'Failed to update verification' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: Request, { params }: Props) {
  return withLogging(request, async () => {
    try {
      await prisma.verification.delete({
        where: { id: params.id },
      });

      logger.info('Verification deleted successfully', { id: params.id });

      return NextResponse.json({ success: true });
    } catch (error) {
      logger.error('Failed to delete verification:', error);
      return NextResponse.json(
        { error: 'Failed to delete verification' },
        { status: 500 }
      );
    }
  });
}