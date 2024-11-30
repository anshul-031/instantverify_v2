"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCamera } from "@/hooks/use-camera";
import { Camera, RefreshCw, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  onCapture: (file: File, preview: string) => void;
  width?: number;
  height?: number;
}

export function CameraFeed({ onCapture, width = 1280, height = 720 }: Props) {
  const {
    videoRef,
    error,
    startCamera,
    stopCamera,
    takePhoto,
    availableDevices,
    currentDevice,
    switchCamera
  } = useCamera({ width, height });

  useEffect(() => {
    const initCamera = async () => {
      try {
        await startCamera();
      } catch (err) {
        console.error('Failed to initialize camera:', err);
      }
    };

    initCamera();
    return () => stopCamera();
  }, []);

  const handleCapture = async () => {
    const result = await takePhoto();
    if (result) {
      onCapture(result.file, result.dataUrl);
      stopCamera();
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex flex-col items-center space-y-4">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => startCamera()}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {!videoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="flex items-center justify-between">
        {availableDevices.length > 1 && (
          <Select
            value={currentDevice}
            onValueChange={switchCamera}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {availableDevices.map(device => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 4)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button onClick={handleCapture}>
          <Camera className="h-4 w-4 mr-2" />
          Capture
        </Button>
      </div>
    </div>
  );
}