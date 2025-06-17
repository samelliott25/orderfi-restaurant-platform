import { useState, useEffect } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number; // words per second
  onComplete?: () => void;
}

export function TypingText({ text, speed = 3, onComplete }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const words = text.split(' ');
  
  useEffect(() => {
    if (currentWordIndex >= words.length) {
      onComplete?.();
      return;
    }
    
    const timer = setTimeout(() => {
      const wordsToShow = words.slice(0, currentWordIndex + 1);
      setDisplayedText(wordsToShow.join(' '));
      setCurrentWordIndex(prev => prev + 1);
    }, 1000 / speed); // Convert speed to milliseconds
    
    return () => clearTimeout(timer);
  }, [currentWordIndex, words, speed, onComplete]);
  
  return (
    <span>
      {displayedText}
      {currentWordIndex < words.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}