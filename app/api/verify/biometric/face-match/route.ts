import { NextResponse } from "next/server";
import { verifyFaceMatch } from "@/lib/services/verification/biometric";
import { withLogging } from "@/lib/middleware/logging";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const formData = await req.formData();
      const personPhoto = formData.get("personPhoto") as File;
      const idPhoto = formData.get("idPhoto") as string;

      if (!personPhoto || !idPhoto) {
        return NextResponse.json(
          { error: "Both person photo and ID photo are required" },
          { status: 400 }
        );
      }

      const result = await verifyFaceMatch(personPhoto, idPhoto);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Face match verification failed" },
        { status: 500 }
      );
    }
  });
}