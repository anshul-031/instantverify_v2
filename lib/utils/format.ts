export function formatMethodName(method: string): string {
  return method.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function formatSecurityLevel(level: string): string {
  return level.replace(/-/g, ' ');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}