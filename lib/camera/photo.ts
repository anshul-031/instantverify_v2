"use client";

export async function capturePhoto(video: HTMLVideoElement, options: {
  width?: number;
  height?: number;
  flipHorizontal?: boolean;
} = {}): Promise<{ file: File; dataUrl: string }> {
  const canvas = document.createElement('canvas');
  const { videoWidth, videoHeight } = video;
  
  canvas.width = options.width || videoWidth;
  canvas.height = options.height || videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Flip horizontally if needed
  if (options.flipHorizontal) {
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  
  // Convert to File
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

  return { file, dataUrl };
}