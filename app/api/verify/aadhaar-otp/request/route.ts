import { NextResponse } from "next/server";
import { withLogging } from "@/lib/middleware/logging";
import logger from "@/lib/utils/logger";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { aadhaarNumber } = await req.json();

      if (!aadhaarNumber) {
        return NextResponse.json(
          { error: "Aadhaar number is required" },
          { status: 400 }
        );
      }

      // Mock OTP generation
      // In production, this would call the actual Aadhaar API
      const mockResponse = {
        status: "Success",
        statusCode: "200",
        data: {
          ref_id: "123456789",
          status: "Success",
          message: "OTP sent successfully"
        }
      };

      logger.info("OTP requested for Aadhaar", { aadhaarNumber });

      return NextResponse.json(mockResponse);
    } catch (error) {
      logger.error("OTP request error:", error);
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }
  });
}