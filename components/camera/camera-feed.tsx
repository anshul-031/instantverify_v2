"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCamera } from "@/hooks/use-camera";
import { Camera, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  onCapture: (file: File, preview: string) => void;
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

export function CameraFeed({ onCapture, width = 1280, height = 720, facingMode = "user" }: Props) {
  const {
    videoRef,
    error,
    isInitialized,
    startCamera,
    stopCamera,
    takePhoto,
    availableDevices,
    currentDevice,
    switchCamera
  } = useCamera({ width, height, facingMode });

  const handleCapture = async () => {
    const result = await takePhoto();
    if (result) {
      onCapture(result.file, result.dataUrl);
      stopCamera();
    }
  };

  const handleRetry = useCallback(async () => {
    await stopCamera();
    await startCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Camera Error</AlertTitle>
        <AlertDescription className="flex flex-col items-start space-y-4">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={handleRetry}
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
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          autoPlay
          muted
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
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
                <SelectItem key={device.id} value={device.id}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button 
          onClick={handleCapture} 
          className="ml-auto"
          disabled={!isInitialized}
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture
        </Button>
      </div>
    </div>
  );
}