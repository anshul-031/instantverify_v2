export interface DocumentMetadata {
  capturedAt: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  device: {
    type: string;
    os: string;
    browser: string;
  };
}

export async function getDeviceInfo(): Promise<DocumentMetadata['device']> {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  return {
    type: /Mobile|Android|iPhone|iPad/i.test(userAgent) ? 'mobile' : 'desktop',
    os: platform,
    browser: getBrowserInfo(userAgent),
  };
}

export async function getCurrentLocation(): Promise<DocumentMetadata['location']> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}