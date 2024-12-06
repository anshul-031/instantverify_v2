import logger from '@/lib/utils/logger';

export interface PhotoValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PhotoRequirements {
  maxSize: number;
  minWidth: number;
  minHeight: number;
  allowedTypes: string[];
}

const DEFAULT_REQUIREMENTS: PhotoRequirements = {
  maxSize: 5 * 1024 * 1024, // 5MB
  minWidth: 600,
  minHeight: 800,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

export async function validatePhoto(
  file: File,
  requirements: PhotoRequirements = DEFAULT_REQUIREMENTS
): Promise<PhotoValidationResult> {
  try {
    // Check file type
    if (!requirements.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPG, PNG, or WebP image',
      };
    }

    // Check file size
    if (file.size > requirements.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${requirements.maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check image dimensions
    const dimensions = await getImageDimensions(file);
    if (dimensions.width < requirements.minWidth || 
        dimensions.height < requirements.minHeight) {
      return {
        isValid: false,
        error: `Image must be at least ${requirements.minWidth}x${requirements.minHeight} pixels`,
      };
    }

    return { isValid: true };
  } catch (error) {
    logger.error('Photo validation error:', error);
    return {
      isValid: false,
      error: 'Failed to validate photo',
    };
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}