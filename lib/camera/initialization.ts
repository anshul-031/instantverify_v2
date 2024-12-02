import { CameraConstraints } from './types';
import { buildVideoConstraints } from './devices';
import { CameraError } from './errors';

export async function initializeCamera(constraints: CameraConstraints): Promise<MediaStream> {
  try {
    // Check if camera API is supported
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new CameraError('Camera API not supported', 'API_NOT_SUPPORTED');
    }

    // Request permissions first
    const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
    
    if (permissionResult.state === 'denied') {
      throw new CameraError('Camera permission denied', 'PERMISSION_DENIED');
    }

    // Build video constraints
    const mediaConstraints: MediaStreamConstraints = {
      video: buildVideoConstraints(constraints),
      audio: false
    };

    // Get media stream
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    return stream;
  } catch (error) {
    if (error instanceof CameraError) throw error;
    throw CameraError.fromDOMException(error as DOMException);
  }
}

export async function setupVideoElement(
  videoElement: HTMLVideoElement,
  stream: MediaStream
): Promise<void> {
  try {
    // Reset video element
    videoElement.srcObject = null;
    videoElement.removeAttribute('src');
    videoElement.load();

    // Set new stream
    videoElement.srcObject = stream;
    videoElement.muted = true;
    videoElement.playsInline = true;
    
    // Wait for metadata to load
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new CameraError('Video loading timeout', 'TIMEOUT_ERROR'));
      }, 100000);

      const cleanup = () => {
        clearTimeout(timeoutId);
        videoElement.removeEventListener('loadedmetadata', handleLoad);
        videoElement.removeEventListener('error', handleError);
      };

      const handleLoad = () => {
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();
        const error = videoElement.error;
        reject(new CameraError(
          `Video setup error: ${error?.message || 'Unknown error'}`,
          'VIDEO_ERROR'
        ));
      };

     // videoElement.addEventListener('loadedmetadata', handleLoad);
      videoElement.addEventListener('error', handleError);
    });

    // Start playing
    try {
      await videoElement.play();
    } catch (error) {
      throw new CameraError(
        'Failed to start video playback',
        'PLAYBACK_ERROR',
        error as Error
      );
    }
  } catch (error) {
    if (error instanceof CameraError) throw error;
    throw new CameraError(
      'Failed to setup video element',
      'VIDEO_SETUP_ERROR',
      error as Error
    );
  }
}