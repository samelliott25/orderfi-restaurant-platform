import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // words per second
  onComplete?: () => void;
}

export function TypingText({ text, speed = 3, onComplete }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  useEffect(() => {
    if (currentCharIndex >= text.length) {
      onComplete?.();
      return;
    }
    
    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentCharIndex + 1));
      setCurrentCharIndex(prev => prev + 1);
    }, 1000 / (speed * 8)); // Much faster, character by character for fluid effect
    
    return () => clearTimeout(timer);
  }, [currentCharIndex, text, speed, onComplete]);
  
  return (
    <span>
      {displayedText}
      {currentCharIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}