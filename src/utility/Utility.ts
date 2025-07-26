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

// Format currency utility
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status color and label utility
export const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'new':
      return { color: 'bg-blue-100 text-blue-800', label: 'New' };
    case 'in progress':
      return { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' };
    case 'negotiation':
      return { color: 'bg-purple-100 text-purple-800', label: 'Negotiation' };
    case 'completed':
      return { color: 'bg-green-100 text-green-800', label: 'Completed' };
    default:
      return { color: 'bg-gray-100 text-gray-800', label: status };
  }
};

// Format date utility
export const formatDate = (dateString: string) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};
