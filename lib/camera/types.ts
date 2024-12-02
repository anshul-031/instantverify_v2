export interface CameraDevice {
  id: string;
  label: string;
}

export interface CameraOptions {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

export interface PhotoResult {
  file: File;
  dataUrl: string;
}

export interface CameraHookResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  error: string | null;
  isInitialized: boolean;
  devices: CameraDevice[];
  activeDeviceId: string | undefined;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  takePhoto: () => Promise<PhotoResult | null>;
  switchCamera: (deviceId: string) => Promise<void>;
}

export interface CameraConstraints {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
  deviceId?: string;
}