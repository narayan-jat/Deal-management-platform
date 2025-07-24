export const isMobile = () => {
  // First, check for mobile device via user agent
  const isDeviceMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isDeviceMobile) return true;
  // Fallback to window width detection
  return window.innerWidth <= 768;
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getDateString = (date: Date) => {
  return date ? new Date(date).toISOString().split('T')[0] : null;
};
