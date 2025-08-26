import React, { useState, useEffect, useRef } from 'react';

const CustomTextAnimation = ({ strings = [], typeSpeed = 100, backSpeed = 60, loop = true, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef(null);
  
  useEffect(() => {
    if (!strings.length) return;
    
    const currentString = strings[currentStringIndex];
    
    // Clear previous timeout
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    
    // Calculate typing/deleting speed
    let typeTimer = isDeleting ? backSpeed : typeSpeed;
    
    // Handle typing logic
    const handleTyping = () => {
      if (isDeleting) {
        // Deleting text
        setDisplayText(currentString.substring(0, displayText.length - 1));
        
        // When fully deleted, move to next string
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentStringIndex((prevIndex) => 
            loop ? (prevIndex + 1) % strings.length : Math.min(prevIndex + 1, strings.length - 1)
          );
        }
      } else {
        // Typing text
        setDisplayText(currentString.substring(0, displayText.length + 1));
        
        // When fully typed, start deleting after a pause
        if (displayText.length === currentString.length) {
          typingRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, 1500); // Pause at end of word
          return;
        }
      }
      
      // Continue the animation loop
      typingRef.current = setTimeout(handleTyping, typeTimer);
    };
    
    // Start the animation
    typingRef.current = setTimeout(handleTyping, typeTimer);
    
    // Cleanup
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [displayText, currentStringIndex, isDeleting, strings, typeSpeed, backSpeed, loop]);
  
  return <span className={className}>{displayText}</span>;
};

export default React.memo(CustomTextAnimation);