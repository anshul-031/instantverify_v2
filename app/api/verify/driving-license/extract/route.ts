import { NextResponse } from "next/server";
import { extractDrivingLicenseInfo } from "@/lib/services/verification/driving-license";
import { withLogging } from "@/lib/middleware/logging";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      const result = await extractDrivingLicenseInfo(file);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to process driving license" },
        { status: 500 }
      );
    }
  });
}