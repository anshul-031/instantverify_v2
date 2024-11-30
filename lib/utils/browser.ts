export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function';
}