"use client";

import { useState } from "react";
import { VerificationReport } from "@/lib/types/report";
import { IDVerificationSection } from "./id-verification";
import { LocationInfoSection } from "./location-info";
import { BackgroundCheckSection } from "./background-check";
import { ReportHeader } from "./report-header";
import { generatePDF } from "@/lib/utils/pdf";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  report: VerificationReport;
}

export function VerificationReportView({ report }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

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
        <IDVerificationSection result={report.idVerification} />
        <LocationInfoSection info={report.locationInfo} />
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