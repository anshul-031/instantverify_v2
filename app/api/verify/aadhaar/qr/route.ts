import { NextResponse } from "next/server";
import { scanAadhaarQR } from "@/lib/services/verification/qr";
import { withLogging } from "@/lib/middleware/logging";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const formData = await req.formData();
      const imageData = formData.get("qrImage") as string;

      if (!imageData) {
        return NextResponse.json(
          { error: "QR code image data is required" },
          { status: 400 }
        );
      }

      const result = await scanAadhaarQR(imageData);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to scan QR code" },
        { status: 500 }
      );
    }
  });
}