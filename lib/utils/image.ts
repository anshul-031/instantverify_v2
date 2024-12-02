export async function addMetadataToImage(canvas: HTMLCanvasElement): Promise<void> {
  const context = canvas.getContext('2d');
  if (!context) return;

  // Get current date, time and location
  const timestamp = new Date().toLocaleString();
  let locationText = 'Location: Getting...';

  try {
    const position = await getCurrentPosition();
    locationText = `Location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Error getting location:', error);
    locationText = 'Location: Unavailable';
  }

  // Configure text style
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(0, canvas.height - 60, canvas.width, 60);

  context.fillStyle = 'white';
  context.font = '14px Arial';
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  // Add timestamp and location
  context.fillText(`Captured: ${timestamp}`, 10, canvas.height - 40);
  context.fillText(locationText, 10, canvas.height - 20);
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}