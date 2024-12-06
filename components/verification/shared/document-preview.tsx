"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, X, Eye, Download } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/format';

interface Props {
  file: File;
  onRemove?: () => void;
  disabled?: boolean;
}

export function DocumentPreview({ file, onRemove, disabled }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePreview = () => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FileUp className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {file.type.startsWith('image/') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              disabled={disabled}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={disabled}
          >
            <Download className="h-4 w-4" />
          </Button>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}