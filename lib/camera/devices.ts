"use client";

export interface CameraDevice {
  id: string;
  label: string;
}

export async function getCameraDevices(): Promise<CameraDevice[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        id: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 4)}`
      }));
    
    return videoDevices;
  } catch (error) {
    console.error('Failed to enumerate devices:', error);
    return [];
  }
}

export function isCameraSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}