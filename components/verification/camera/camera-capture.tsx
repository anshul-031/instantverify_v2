"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Repeat, Download } from 'lucide-react';
import { addMetadataToImage } from '@/lib/utils/image';
import { useToast } from '@/components/ui/use-toast';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  mode: 'person' | 'document';
  aspectRatio?: number;
  onClose?: () => void;
}

export function CameraCapture({ onCapture, mode, aspectRatio = 4/3, onClose }: CameraCaptureProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getDevices() {
      try {
        // Request camera permissions first
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting camera devices:', error);
        toast({
          title: "Error",
          description: "Failed to access camera devices. Please ensure camera permissions are granted.",
          variant: "destructive",
        });
      }
    }

    getDevices();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    async function startCamera() {
      if (!selectedDevice) return;

      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDevice,
            aspectRatio,
            facingMode: mode === 'person' ? 'user' : 'environment',
          }
        });

        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Error",
          description: "Failed to access camera. Please check your camera permissions.",
          variant: "destructive",
        });
      }
    }

    startCamera();
  }, [selectedDevice, aspectRatio, mode]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Add metadata if it's a person photo
      if (mode === 'person') {
        await addMetadataToImage(canvas);
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.95);
      });

      // Create file from blob
      const file = new File([blob], `${mode}-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Set captured image preview
      setCapturedImage(URL.createObjectURL(blob));
      
      // Call the onCapture callback with the file
      onCapture(file);

      // Auto-dismiss after successful capture
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      toast({
        title: "Error",
        description: "Failed to capture image",
        variant: "destructive",
      });
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {mode === 'person' ? 'Capture Person Photo' : 'Capture Document'}
        </h3>
        {devices.length > 0 && (
          <Select 
            value={selectedDevice} 
            onValueChange={setSelectedDevice}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem 
                  key={device.deviceId} 
                  value={device.deviceId || 'default'}
                >
                  {device.label || `Camera ${device.deviceId.slice(0, 4)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center space-x-4">
        {!capturedImage ? (
          <Button onClick={captureImage} disabled={!selectedDevice}>
            <Camera className="w-4 h-4 mr-2" />
            Capture
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={retake}>
              <Repeat className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={() => capturedImage && window.open(capturedImage)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}