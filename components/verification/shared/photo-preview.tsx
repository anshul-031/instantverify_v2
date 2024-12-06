"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Download } from 'lucide-react';
import { DocumentMetadata } from '@/lib/utils/verification/metadata';
import { formatDate } from '@/lib/utils/format';

interface Props {
  photoUrl: string;
  metadata?: DocumentMetadata;
  onRetake?: () => void;
  disabled?: boolean;
}

export function PhotoPreview({ photoUrl, metadata, onRetake, disabled }: Props) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = photoUrl;
    a.download = `photo-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
          <img
            src={photoUrl}
            alt="Captured photo"
            className="w-full h-full object-cover"
          />
        </div>

        {metadata && (
          <div className="text-sm text-gray-500 space-y-1">
            <p>Captured: {formatDate(metadata.capturedAt)}</p>
            {metadata.location && (
              <p>
                Location: {metadata.location.latitude.toFixed(6)},{' '}
                {metadata.location.longitude.toFixed(6)}
              </p>
            )}
            <p>
              Device: {metadata.device.type} ({metadata.device.os} -{' '}
              {metadata.device.browser})
            </p>
          </div>
        )}

        <div className="flex justify-between">
          {onRetake && (
            <Button
              variant="outline"
              onClick={onRetake}
              disabled={disabled}
            >
              <Camera className="h-4 w-4 mr-2" />
              Retake Photo
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={disabled}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}