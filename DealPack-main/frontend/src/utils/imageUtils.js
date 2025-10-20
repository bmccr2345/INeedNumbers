// Image optimization utilities

// Generate different image sizes for responsive images
export const generateSrcSet = (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920]) => {
  return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
};

// Generate sizes attribute for responsive images
export const generateSizes = () => {
  return '(max-width: 320px) 280px, (max-width: 640px) 600px, (max-width: 768px) 720px, (max-width: 1024px) 960px, (max-width: 1280px) 1200px, 1920px';
};

// Preload critical images
export const preloadImage = (src, priority = 'high') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = priority;
    document.head.appendChild(link);
  }
};

// Convert to WebP if supported
export const getOptimizedImageUrl = (url, options = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  // For external CDN services, you would modify the URL
  // For now, return the original URL with potential query parameters
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality !== 80) params.append('q', quality);
  if (format !== 'auto') params.append('f', format);
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Lazy loading with IntersectionObserver
export const createLazyLoader = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  const config = { ...defaultOptions, ...options };
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, config);
};

// Image compression for uploads (client-side)
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};