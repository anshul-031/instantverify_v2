"use client";

import { CameraConstraints } from './types';

export function buildCameraConstraints(options: CameraConstraints): MediaTrackConstraints {
  const constraints: MediaTrackConstraints = {
    width: { ideal: options.width || 1280 },
    height: { ideal: options.height || 720 }
  };

  if (options.deviceId) {
    constraints.deviceId = { exact: options.deviceId };
  } else if (options.facingMode) {
    constraints.facingMode = options.facingMode;
  }

  return constraints;
}

export function validateConstraints(constraints: CameraConstraints): boolean {
  if (constraints.width && constraints.width < 0) return false;
  if (constraints.height && constraints.height < 0) return false;
  if (constraints.facingMode && !['user', 'environment'].includes(constraints.facingMode)) return false;
  return true;
}