"use client";

import { useState } from "react";
import { VerificationReport } from "@/lib/types/report";
import { LocationInfoSection } from "./location-info";
import { BackgroundCheckSection } from "./background-check";
import { ReportHeader } from "./report-header";
import { IDVerificationComparison } from "./id-comparison";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/lib/utils/pdf";

interface Props {
  report: VerificationReport;
}

export function VerificationReportView({ report }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  // Extract OCR and eKYC data from the verification metadata
  const { metadata } = report.verificationDetails;
  
  const ocrData = {
    name: metadata?.ocrData?.name || metadata?.extractedInfo?.name || "N/A",
    address: metadata?.ocrData?.address || metadata?.extractedInfo?.address || "N/A",
    gender: metadata?.ocrData?.gender || metadata?.extractedInfo?.gender || "N/A",
    dateOfBirth: metadata?.ocrData?.dateOfBirth || metadata?.ocrData?.year_of_birth || metadata?.extractedInfo?.dateOfBirth || "N/A",
    fatherName: metadata?.ocrData?.fatherName || metadata?.extractedInfo?.fatherName || "N/A",
    district: metadata?.ocrData?.district || metadata?.extractedInfo?.district || "N/A",
    state: metadata?.ocrData?.state || metadata?.extractedInfo?.state || "N/A",
    city: metadata?.ocrData?.city || metadata?.extractedInfo?.city || "N/A",
    pincode: metadata?.ocrData?.pincode || metadata?.extractedInfo?.pincode || "N/A",
    country: metadata?.ocrData?.country || metadata?.extractedInfo?.country || "India",
    idNumber: metadata?.ocrData?.id_number || metadata?.extractedInfo?.idNumber || "N/A",
    photo: report.verificationDetails.documents?.personPhoto?.[0]?.url || "",
  };

  const ekycData = {
    name: metadata?.ekycData?.name || "N/A",
    address: metadata?.ekycData?.address || "N/A",
    gender: metadata?.ekycData?.gender || "N/A",
    dateOfBirth: metadata?.ekycData?.dateOfBirth || "N/A",
    fatherName: metadata?.ekycData?.fatherName || "N/A",
    district: metadata?.ekycData?.district || "N/A",
    state: metadata?.ekycData?.state || "N/A",
    city: metadata?.ekycData?.city || "N/A",
    pincode: metadata?.ekycData?.pincode || "N/A",
    country: metadata?.ekycData?.country || "India",
    photo: metadata?.ekycData?.photo || "",
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(report);
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Verification Report',
        text: `Verification Report - ${report.trackingId}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 verification-report">
      <ReportHeader
        trackingId={report.trackingId}
        generatedAt={report.generatedAt}
        status={report.status}
        onDownload={handleDownloadPDF}
        onPrint={handlePrint}
        onShare={handleShare}
        isGenerating={isGeneratingPDF}
      />

      <div className="space-y-8 print:space-y-6">
        <IDVerificationComparison 
          ocrData={ocrData}
          ekycData={ekycData}
        />
        <BackgroundCheckSection result={report.backgroundCheck} />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 20mm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}