import { useState, useRef } from 'react';

export const useAnimationEngine = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const stopRef = useRef(false);
  const speedRef = useRef(800);

  // Update ref whenever speed changes
  const updateSpeed = (newSpeed) => {
    setAnimationSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const animate = async (steps, onStep, onComplete) => {
    setIsAnimating(true);
    stopRef.current = false;
    
    for (let i = 0; i < steps.length; i++) {
      if (stopRef.current) {
        break;
      }
      
      setCurrentStep(i);
      await onStep(steps[i], i);
      // Use ref so speed changes are reflected immediately
      await new Promise(resolve => setTimeout(resolve, speedRef.current));
    }
    
    setIsAnimating(false);
    setCurrentStep(0);
    if (onComplete) onComplete();
  };

  const stop = () => {
    stopRef.current = true;
    setIsAnimating(false);
  };

  return { 
    animate, 
    stop, 
    isAnimating, 
    currentStep, 
    animationSpeed, 
    setAnimationSpeed: updateSpeed
  };
};