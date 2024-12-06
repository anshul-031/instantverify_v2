import { NextResponse } from "next/server";
import { verifyVoterId } from "@/lib/services/verification/voter-id";
import { withLogging } from "@/lib/middleware/logging";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { voterIdNumber, dateOfBirth } = await req.json();

      if (!voterIdNumber || !dateOfBirth) {
        return NextResponse.json(
          { error: "Voter ID number and date of birth are required" },
          { status: 400 }
        );
      }

      const result = await verifyVoterId(voterIdNumber, dateOfBirth);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to verify voter ID" },
        { status: 500 }
      );
    }
  });
}