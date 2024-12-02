"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface CameraOptions {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

export interface CameraDevice {
  id: string;
  label: string;
}

export interface CameraHookResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  error: string | null;
  isInitialized: boolean;
  devices: CameraDevice[];
  activeDeviceId: string | undefined;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  takePhoto: () => Promise<{ file: File; dataUrl: string; } | null>;
  switchCamera: (deviceId: string) => Promise<void>;
}

export function useCamera({ width = 1280, height = 720, facingMode = "user" }: CameraOptions = {}): CameraHookResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          id: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 4)}`
        }));
      setDevices(videoDevices);
    } catch (err) {
      console.error('Failed to get camera devices:', err);
      setError('Failed to get camera devices');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsInitialized(false);
  }, [stream]);

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      stopCamera();
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: deviceId ? undefined : facingMode,
          deviceId: deviceId ? { exact: deviceId } : undefined
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setStream(mediaStream);
        setIsInitialized(true);
        setActiveDeviceId(deviceId);
        
        // Only get devices after successful initialization
        if (devices.length === 0) {
          await getDevices();
        }
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      let errorMessage = 'Failed to start camera';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please grant permission to use your camera.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please ensure your device has a camera.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application.';
        }
      }
      
      setError(errorMessage);
      setIsInitialized(false);
    }
  }, [width, height, facingMode, stopCamera, getDevices, devices.length]);

  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !isInitialized) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flip horizontally if using front camera
    if (facingMode === 'user') {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Convert to File object
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

    return { file, dataUrl };
  }, [isInitialized, facingMode]);

  const switchCamera = useCallback(async (deviceId: string) => {
    if (deviceId === activeDeviceId) return;
    await startCamera(deviceId);
  }, [activeDeviceId, startCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return {
    videoRef,
    error,
    isInitialized,
    devices,
    activeDeviceId,
    startCamera,
    stopCamera,
    takePhoto,
    switchCamera
  };
}