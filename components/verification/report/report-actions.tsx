"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";
import { isShareSupported } from "@/lib/utils/browser";

interface Props {
  trackingId: string;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  isGenerating: boolean;
}

export function ReportActions({ 
  trackingId, 
  onDownload, 
  onPrint, 
  onShare, 
  isGenerating 
}: Props) {
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        onClick={onDownload}
        disabled={isGenerating}
      >
        <Download className="h-4 w-4 mr-2" />
        {isGenerating ? "Generating..." : "Download PDF"}
      </Button>
      <Button variant="outline" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      {isShareSupported() && (
        <Button variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}
    </div>
  );
}