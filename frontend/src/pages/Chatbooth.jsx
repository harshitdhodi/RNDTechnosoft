// In your Chatbot.jsx file
import React, { useEffect, useState } from 'react';

const Chatbot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Function to load the Tawk.to script
  const loadTawkTo = () => {
    if (isLoaded) return; // Prevent duplicate loading
    
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/630dcc4b37898912e96620d6/1gbmuc2sq";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    
    // Set loaded state when script loads
    script.onload = () => setIsLoaded(true);
    
    // Add script to document
    document.body.appendChild(script);
    
    // Store script reference for cleanup
    window.tawkScript = script;
  };

  useEffect(() => {
    // Use Intersection Observer to detect when chatbot container is visible
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    });
    
    // Get the container element
    const container = document.getElementById('chatbot-container');
    if (container) {
      observer.observe(container);
    }
    
    // Cleanup function
    return () => {
      observer.disconnect();
      
      // Remove script element if it exists
      if (window.tawkScript && document.body.contains(window.tawkScript)) {
        document.body.removeChild(window.tawkScript);
      }
      
      // Clean up Tawk API if it exists
      if (window.Tawk_API) {
        if (typeof window.Tawk_API.endChat === 'function') {
          window.Tawk_API.endChat();
        }
        delete window.Tawk_API;
        delete window.Tawk_LoadStart;
      }
    };
  }, []);

  // Load Tawk.to when component becomes visible or when user interacts
  useEffect(() => {
    if (isVisible) {
      // Use requestIdleCallback for non-critical loading
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadTawkTo(), { timeout: 5000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(loadTawkTo, 3000); // Delay load by 3 seconds
      }
    }
  }, [isVisible]);

  // Load chatbot immediately if user interacts with the page
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsVisible(true);
      
      // Remove event listeners after first interaction
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
    
    // Add event listeners for user interaction
    window.addEventListener('scroll', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <div 
      id="chatbot-container"
      className="chatbot-wrapper"
      aria-label="Customer support chat"
    />
  );
};

// Just export the default component
export default Chatbot;