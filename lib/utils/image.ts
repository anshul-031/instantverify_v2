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

  // Add metadata directly using canvas context
  const fontSize = 14;
  const padding = 10;
  const textHeight = fontSize + padding;
  const bgHeight = textHeight * 2 + padding * 2;

  // Add semi-transparent background
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.fillRect(0, canvas.height - bgHeight, canvas.width, bgHeight);

  // Configure text style
  context.fillStyle = 'white';
  context.font = `${fontSize}px Arial`;
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  // Add timestamp and location
  const y1 = canvas.height - bgHeight + textHeight;
  const y2 = y1 + textHeight;
  
  context.fillText(`Captured: ${timestamp}`, padding, y1);
  context.fillText(locationText, padding, y2);
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