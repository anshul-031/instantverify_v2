export class CameraError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'CameraError';
  }
}

export function handleCameraError(error: unknown): CameraError {
  if (error instanceof Error) {
    // Handle specific error types
    if ((error as any).name === 'NotAllowedError') {
      return new CameraError(
        'Camera access denied. Please grant permission to use your camera.',
        'PERMISSION_DENIED',
        error
      );
    }
    if ((error as any).name === 'NotFoundError') {
      return new CameraError(
        'No camera found. Please ensure your device has a camera.',
        'NO_CAMERA',
        error
      );
    }
    if ((error as any).name === 'NotReadableError') {
      return new CameraError(
        'Camera is in use by another application.',
        'CAMERA_IN_USE',
        error
      );
    }
    return new CameraError(
      error.message || 'Failed to access camera',
      'UNKNOWN_ERROR',
      error
    );
  }
  return new CameraError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR'
  );
}