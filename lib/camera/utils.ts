export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'NotAllowedError') {
      return 'Camera access denied. Please grant permission to use your camera.';
    }
    if (error.name === 'NotFoundError') {
      return 'No camera found. Please ensure your device has a camera.';
    }
    if (error.name === 'NotReadableError') {
      return 'Camera is in use by another application.';
    }
    return error.message;
  }
  return 'Failed to start camera';
}

export async function createPhotoFile(
  canvas: HTMLCanvasElement, 
  quality: number = 0.8
): Promise<{ file: File; dataUrl: string }> {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
  return { file, dataUrl };
}