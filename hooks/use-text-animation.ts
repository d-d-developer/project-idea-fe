"use client";

import { useState, useEffect } from 'react';

export function useTextAnimation(phrases: string[], interval: number = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsVisible(true);
      }, 500); // Half a second for fade out
      
    }, interval);

    return () => clearInterval(fadeInterval);
  }, [interval, phrases.length]);

  return {
    currentPhrase: phrases[currentIndex],
    isVisible,
  };
}
