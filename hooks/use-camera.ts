"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { buildVideoConstraints } from "@/lib/camera/constraints";
import { handleCameraError } from "@/lib/camera/errors";
import { getCameraDevices, isCameraSupported, type CameraDevice } from "@/lib/camera/devices";

interface CameraOptions {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

interface CameraState {
  isInitialized: boolean;
  isPermissionGranted: boolean;
  error: string | null;
}

export function useCamera(options: CameraOptions = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>({
    isInitialized: false,
    isPermissionGranted: false,
    error: null,
  });
  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<string>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const getDevices = useCallback(async () => {
    try {
      const devices = await getCameraDevices();
      setAvailableDevices(devices);
      
      if (devices.length > 0 && !currentDevice) {
        setCurrentDevice(devices[0].id);
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: "Failed to get camera devices" }));
    }
  }, [currentDevice]);

  const initializeVideo = useCallback(async (mediaStream: MediaStream): Promise<void> => {
    if (!videoRef.current) return;

    try {
      videoRef.current.srcObject = mediaStream;
      
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject(new Error("Video element not found"));
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setState(prev => ({ ...prev, isInitialized: true }));
                resolve();
              })
              .catch(reject);
          }
        };
        
        videoRef.current.onerror = () => {
          reject(new Error("Failed to load video"));
        };
      });
    } catch (error) {
      throw handleCameraError(error);
    }
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      if (!isCameraSupported()) {
        throw new Error("Camera API not supported");
      }

      setState(prev => ({ ...prev, error: null }));

      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: buildVideoConstraints({
          ...options,
          deviceId
        }),
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      await initializeVideo(mediaStream);
      
      setStream(mediaStream);
      setCurrentDevice(deviceId);

      setState(prev => ({
        ...prev,
        isPermissionGranted: true,
        error: null
      }));

      await getDevices();
    } catch (err) {
      const cameraError = handleCameraError(err);
      setState(prev => ({
        ...prev,
        error: cameraError.message,
        isInitialized: false
      }));
    }
  }, [getDevices, initializeVideo, options, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState(prev => ({ ...prev, isInitialized: false }));
  }, [stream]);

  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !stream) return null;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // Flip horizontally if using front camera
      if (options.facingMode === "user") {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }

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
      console.error("Error taking photo:", error);
      setState(prev => ({ ...prev, error: "Failed to capture photo" }));
      return null;
    }
  }, [options.facingMode]);

  const switchCamera = useCallback(async (deviceId: string) => {
    await stopCamera();
    await startCamera(deviceId);
  }, [startCamera, stopCamera]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (mounted) {
        await startCamera();
      }
    };

    init();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return {
    stream,
    videoRef,
    error: state.error,
    isInitialized: state.isInitialized,
    isPermissionGranted: state.isPermissionGranted,
    startCamera,
    stopCamera,
    takePhoto,
    availableDevices,
    currentDevice,
    switchCamera
  };
}