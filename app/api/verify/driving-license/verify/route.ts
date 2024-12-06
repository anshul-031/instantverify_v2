import { NextResponse } from "next/server";
import { verifyDrivingLicense } from "@/lib/services/verification/driving-license";
import { withLogging } from "@/lib/middleware/logging";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { licenseNumber, dateOfBirth } = await req.json();

      if (!licenseNumber || !dateOfBirth) {
        return NextResponse.json(
          { error: "License number and date of birth are required" },
          { status: 400 }
        );
      }

      const result = await verifyDrivingLicense(licenseNumber, dateOfBirth);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to verify driving license" },
        { status: 500 }
      );
    }
  });
}