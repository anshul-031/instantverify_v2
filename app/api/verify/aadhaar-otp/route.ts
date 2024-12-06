import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { withLogging } from "@/lib/middleware/logging";
import { saveUploadedFile } from "@/lib/utils/file";
import { join } from "path";
import logger from "@/lib/utils/logger";

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const formData = await req.formData();
      const aadhaarNumber = formData.get("aadhaarNumber") as string;
      const aadhaarFiles = formData.getAll("aadhaarFiles");
      const personPhoto = formData.get("personPhoto") as File;

      if (!aadhaarNumber || !aadhaarFiles.length || !personPhoto) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Save files
      const uploadDir = join(process.cwd(), "public", "uploads");
      const fileUrls = [];

      for (const file of aadhaarFiles) {
        if (file instanceof File) {
          const url = await saveUploadedFile(file, uploadDir);
          fileUrls.push(url);
        }
      }

      const personPhotoUrl = await saveUploadedFile(personPhoto, uploadDir);

      // Create verification record
      const verificationId = uuidv4();
      const verification = {
        id: verificationId,
        type: "aadhaar-otp",
        status: "payment-pending",
        aadhaarNumber,
        documents: fileUrls,
        personPhoto: personPhotoUrl,
        createdAt: new Date().toISOString(),
      };

      // In a real app, save to database here
      logger.info("Verification created", { verificationId });

      return NextResponse.json({
        success: true,
        verificationId,
        verification,
      });
    } catch (error) {
      logger.error("Verification creation error:", error);
      return NextResponse.json(
        { error: "Failed to create verification" },
        { status: 500 }
      );
    }
  });
}