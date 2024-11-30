"use client";

export interface CameraConstraints {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
  deviceId?: string;
}

export function buildVideoConstraints(options: CameraConstraints): MediaTrackConstraints {
  return {
    width: { ideal: options.width || 1280 },
    height: { ideal: options.height || 720 },
    facingMode: options.deviceId ? undefined : (options.facingMode || "user"),
    deviceId: options.deviceId ? { exact: options.deviceId } : undefined
  };
}