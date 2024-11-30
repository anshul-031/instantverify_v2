"use client";

import { Card } from "@/components/ui/card";
import { ReportActions } from "./report-actions";

interface Props {
  trackingId: string;
  generatedAt: string;
  status: string;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  isGenerating: boolean;
}

export function ReportHeader({
  trackingId,
  generatedAt,
  status,
  onDownload,
  onPrint,
  onShare,
  isGenerating
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Verification Report</h1>
          <p className="text-gray-600">
            Tracking ID: {trackingId}
          </p>
        </div>
        <ReportActions
          trackingId={trackingId}
          onDownload={onDownload}
          onPrint={onPrint}
          onShare={onShare}
          isGenerating={isGenerating}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Generated At:</span>{" "}
          {new Date(generatedAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium">Status:</span>{" "}
          <span className="capitalize">{status}</span>
        </div>
      </div>
    </Card>
  );
}