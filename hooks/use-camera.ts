"use client";

import { useState, useEffect, useRef } from "react";

interface CameraOptions {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

interface CameraHook {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  error: string | null;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  takePhoto: () => Promise<{ file: File; dataUrl: string } | null>;
  availableDevices: MediaDeviceInfo[];
  currentDevice: string | undefined;
  switchCamera: (deviceId: string) => Promise<void>;
}

export function useCamera(options: CameraOptions = {}): CameraHook {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDevice, setCurrentDevice] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const getDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true }); // Request permission first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setAvailableDevices(videoDevices);
    } catch (err) {
      setError("Camera permission denied or not available");
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: options.width || 1280,
          height: options.height || 720,
          facingMode: deviceId ? undefined : (options.facingMode || "user"),
          deviceId: deviceId ? { exact: deviceId } : undefined
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCurrentDevice(deviceId);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start camera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current || !stream) return null;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(videoRef.current, 0, 0);
      
      const timestamp = new Date().toLocaleString();
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`Date: ${timestamp}`, 10, canvas.height - 30);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });

      return { file, dataUrl };
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to capture photo');
      return null;
    }
  };

  const switchCamera = async (deviceId: string) => {
    stopCamera();
    await startCamera(deviceId);
  };

  useEffect(() => {
    getDevices();
    return () => {
      stopCamera();
    };
  }, []);

  return {
    stream,
    videoRef,
    error,
    startCamera,
    stopCamera,
    takePhoto,
    availableDevices,
    currentDevice,
    switchCamera
  };
}