export function formatBytes(bytes : number): string {
  if (bytes === 0) return '0.00 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formatted = (bytes / Math.pow(k, i)).toFixed(2);

  return `${formatted} ${sizes[i]}`;
}
