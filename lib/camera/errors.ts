export class CameraError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'CameraError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, CameraError.prototype);

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CameraError);
    }
  }

  static fromDOMException(error: DOMException): CameraError {
    switch (error.name) {
      case 'NotAllowedError':
        return new CameraError(
          'Camera access denied. Please grant permission to use your camera.',
          'PERMISSION_DENIED',
          error
        );
      case 'NotFoundError':
        return new CameraError(
          'No camera found. Please ensure your device has a camera.',
          'NO_CAMERA',
          error
        );
      case 'NotReadableError':
        return new CameraError(
          'Camera is in use by another application.',
          'CAMERA_IN_USE',
          error
        );
      case 'OverconstrainedError':
        return new CameraError(
          'Camera does not support the requested constraints.',
          'INVALID_CONSTRAINTS',
          error
        );
      case 'SecurityError':
        return new CameraError(
          'Camera access is restricted due to security policy.',
          'SECURITY_ERROR',
          error
        );
      default:
        return new CameraError(
          error.message || 'An unknown camera error occurred',
          'UNKNOWN_ERROR',
          error
        );
    }
  }
}