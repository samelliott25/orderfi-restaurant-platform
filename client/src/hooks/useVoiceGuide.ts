import { useState, useEffect, useRef } from 'react';

export interface VoiceGuideStep {
  id: string;
  title: string;
  instruction: string;
  highlight?: string;
  action?: () => void;
  waitForAction?: boolean;
  duration?: number;
}

export interface UseVoiceGuideReturn {
  isActive: boolean;
  currentStep: VoiceGuideStep | null;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isMuted: boolean;
  startTutorial: (steps: VoiceGuideStep[]) => void;
  stopTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  toggleMute: () => void;
  skipToStep: (index: number) => void;
}

export function useVoiceGuide(): UseVoiceGuideReturn {
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<VoiceGuideStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for speech synthesis support
  const hasSpeechSupport = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const currentStep = steps[currentStepIndex] || null;

  const speak = (text: string) => {
    if (!hasSpeechSupport || isMuted) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Mimi's waitress voice settings - warm and friendly
    utterance.rate = 0.82;  // Slower, more conversational pace
    utterance.pitch = 1.25; // Higher pitch for feminine, friendly tone
    utterance.volume = 0.9; // Clear and confident

    // Find the best female voice available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('female') ||
      (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('us')) ||
      (voice.name.toLowerCase().includes('microsoft') && voice.name.toLowerCase().includes('zira'))
    ) || voices.find(voice => voice.lang.startsWith('en-US'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      handleStepComplete();
    };
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStepComplete = () => {
    if (!currentStep) return;

    // If step doesn't wait for user action, auto-advance
    if (!currentStep.waitForAction) {
      const delay = currentStep.duration || 2000;
      timeoutRef.current = setTimeout(() => {
        nextStep();
      }, delay);
    }

    // Execute step action if present
    if (currentStep.action) {
      currentStep.action();
    }
  };

  const startTutorial = (tutorialSteps: VoiceGuideStep[]) => {
    setSteps(tutorialSteps);
    setCurrentStepIndex(0);
    setIsActive(true);
    
    // Start first step after a brief delay
    setTimeout(() => {
      if (tutorialSteps[0]) {
        speak(tutorialSteps[0].instruction);
      }
    }, 500);
  };

  const stopTutorial = () => {
    setIsActive(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    
    // Cancel speech and timeouts
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setTimeout(() => {
        if (steps[newIndex]) {
          speak(steps[newIndex].instruction);
        }
      }, 500);
    } else {
      // Tutorial complete
      speak("And that's a wrap, sweetie! You're now a pro at Web3 ordering! I'm so proud of you for learning something completely new. Go ahead and order some delicious food - you've earned it! Thanks for letting me be your guide today!");
      setTimeout(() => {
        stopTutorial();
      }, 4000);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setTimeout(() => {
        if (steps[newIndex]) {
          speak(steps[newIndex].instruction);
        }
      }, 500);
    }
  };

  const skipToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setTimeout(() => {
        if (steps[index]) {
          speak(steps[index].instruction);
        }
      }, 500);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Load voices when they become available
  useEffect(() => {
    if (hasSpeechSupport) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [hasSpeechSupport]);

  return {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    isPlaying,
    isMuted,
    startTutorial,
    stopTutorial,
    nextStep,
    previousStep,
    toggleMute,
    skipToStep
  };
}