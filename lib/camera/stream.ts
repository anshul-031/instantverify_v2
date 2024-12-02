"use client";

import { CameraError } from './errors';

export async function getMediaStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new CameraError('Camera API not supported', 'API_NOT_SUPPORTED');
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error: any) {
    if (error instanceof CameraError) throw error;

    if (error.name === 'NotAllowedError') {
      throw new CameraError(
        'Camera access denied. Please grant permission to use your camera.',
        'PERMISSION_DENIED'
      );
    }
    if (error.name === 'NotFoundError') {
      throw new CameraError(
        'No camera found. Please ensure your device has a camera.',
        'NO_CAMERA'
      );
    }
    if (error.name === 'NotReadableError') {
      throw new CameraError(
        'Camera is in use by another application.',
        'CAMERA_IN_USE'
      );
    }

    throw new CameraError('Failed to access camera', 'UNKNOWN_ERROR', error);
  }
}

export function stopMediaStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}