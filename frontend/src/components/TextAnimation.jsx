import React, { useState, useEffect, useRef, useCallback } from 'react';

const CustomTextAnimation = ({ strings = [], typeSpeed = 100, backSpeed = 60, loop = true, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const animationFrameRef = useRef(null);
  const mountedRef = useRef(false);

  const animateText = useCallback(() => {
    if (!mountedRef.current || !strings.length) return;

    const currentString = strings[currentStringIndex];
    const delay = isDeleting ? backSpeed : typeSpeed;

    const updateText = () => {
      if (isDeleting) {
        if (displayText.length > 0) {
          setDisplayText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentStringIndex((prev) => 
            loop ? (prev + 1) % strings.length : Math.min(prev + 1, strings.length - 1)
          );
        }
      } else {
        if (displayText.length < currentString.length) {
          setDisplayText((prev) => currentString.slice(0, prev.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateText);
    };

    const timeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(updateText);
    }, delay);

    return () => clearTimeout(timeout);
  }, [strings, currentStringIndex, isDeleting, typeSpeed, backSpeed, loop, displayText.length]);

  useEffect(() => {
    mountedRef.current = true;
    if (!strings.length) return;

    const cleanup = animateText();

    return () => {
      mountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cleanup) cleanup();
    };
  }, [animateText]);

  return <span className={className}>{displayText}</span>;
};

export default React.memo(CustomTextAnimation);