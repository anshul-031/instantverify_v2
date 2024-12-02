import type { CameraDevice, CameraConstraints } from './types';
import { CameraError } from './errors';

export async function getVideoDevices(): Promise<CameraDevice[]> {
  try {
    // Request permissions first to ensure device labels are available
    await navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });

    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        id: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 4)}`
      }));
  } catch (error) {
    throw new CameraError(
      'Failed to get camera devices',
      'DEVICE_ENUMERATION_ERROR',
      error as Error
    );
  }
}

export function buildVideoConstraints(options: CameraConstraints): MediaTrackConstraints {
  const constraints: MediaTrackConstraints = {
    width: { ideal: options.width || 1280 },
    height: { ideal: options.height || 720 }
  };

  if (options.deviceId) {
    constraints.deviceId = { exact: options.deviceId };
  } else if (options.facingMode) {
    constraints.facingMode = { ideal: options.facingMode };
  }

  return constraints;
}