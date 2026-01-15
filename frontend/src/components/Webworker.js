// worker.js - This file should be in the same directory as your HeroSection component
// Make sure this file contains only JavaScript, no HTML or JSX

// Handle image preloading
self.preloadImages = (images) => {
  return new Promise((resolve) => {
    if (!images || images.length === 0) {
      resolve({ success: true, message: 'No images to preload' });
      return;
    }
    
    let loadedCount = 0;
    const totalImages = images.length;
    const results = [];
    
    images.forEach((src, index) => {
      // Simulate image loading in the worker
      const xhr = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        loadedCount++;
        results[index] = { src, success: true };
        
        if (loadedCount === totalImages) {
          resolve({ success: true, results });
        }
      };
      
      xhr.onerror = function() {
        loadedCount++;
        results[index] = { src, success: false };
        
        if (loadedCount === totalImages) {
          resolve({ success: true, results });
        }
      };
      
      // Set timeout to prevent blocking
      const timeoutId = setTimeout(() => {
        xhr.abort();
        loadedCount++;
        results[index] = { src, success: false, timedOut: true };
        
        if (loadedCount === totalImages) {
          resolve({ success: true, results });
        }
      }, 2000);
      
      xhr.send();
    });
  });
};

// Handle API requests
self.fetchHomeHero = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl, {
      credentials: 'include',
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Failed to fetch home hero data' 
    };
  }
};

// Message handler
self.onmessage = async function(e) {
  const { type, payload } = e.data;
  
  switch (type) {
    case 'PRELOAD_IMAGES':
      const imageResults = await self.preloadImages(payload.images);
      self.postMessage({ type: 'PRELOAD_IMAGES_RESULT', payload: imageResults });
      break;
      
    case 'FETCH_HOME_HERO':
      const heroData = await self.fetchHomeHero(payload.url);
      self.postMessage({ type: 'FETCH_HOME_HERO_RESULT', payload: heroData });
      break;
      
    default:
      self.postMessage({ 
        type: 'ERROR', 
        payload: { message: `Unknown command: ${type}` } 
      });
  }
};