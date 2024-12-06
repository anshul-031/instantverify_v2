import { NextResponse } from "next/server";
import { withLogging } from "@/lib/middleware/logging";
import logger from "@/lib/utils/logger";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { aadhaarNumber, otp } = await req.json();

      if (!aadhaarNumber || !otp) {
        return NextResponse.json(
          { error: "Aadhaar number and OTP are required" },
          { status: 400 }
        );
      }

      // Mock OTP verification
      // In production, this would call the actual Aadhaar API
      const mockResponse = {
        status: "Success",
        statusCode: "200",
        data: {
          ref_id: "123456789",
          status: "Success",
          message: "OTP verified successfully"
        }
      };

      logger.info("OTP verified for Aadhaar", { aadhaarNumber });

      return NextResponse.json(mockResponse);
    } catch (error) {
      logger.error("OTP verification error:", error);
      return NextResponse.json(
        { error: "Failed to verify OTP" },
        { status: 500 }
      );
    }
  });
}