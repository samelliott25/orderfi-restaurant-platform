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

  const speak = async (text: string) => {
    if (isMuted) return;

    // Cancel any ongoing speech - try both methods
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }

    setIsPlaying(true);

    try {
      // Use OpenAI TTS for natural voice
      const response = await fetch('/api/tts/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          handleStepComplete();
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          // Fallback to browser TTS if OpenAI fails
          fallbackSpeak(text);
        };

        await audio.play();
      } else {
        // Fallback to browser TTS if API fails
        fallbackSpeak(text);
      }
    } catch (error) {
      console.log('TTS API unavailable, using browser fallback');
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (text: string) => {
    if (!hasSpeechSupport) {
      setIsPlaying(false);
      handleStepComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Mimi's waitress voice settings - warm and friendly
    utterance.rate = 0.82;
    utterance.pitch = 1.25;
    utterance.volume = 0.9;

    // Find the best female voice available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('female') ||
      (voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('us'))
    ) || voices.find(voice => voice.lang.startsWith('en-US'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      handleStepComplete();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      handleStepComplete();
    };

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
    setTimeout(async () => {
      if (tutorialSteps[0]) {
        await speak(tutorialSteps[0].instruction);
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
      
      setTimeout(async () => {
        if (steps[newIndex]) {
          await speak(steps[newIndex].instruction);
        }
      }, 500);
    } else {
      // Tutorial complete
      const completionMessage = "And that's a wrap, sweetie! You're now a pro at Web3 ordering! I'm so proud of you for learning something completely new. Go ahead and order some delicious food - you've earned it! Thanks for letting me be your guide today!";
      speak(completionMessage).then(() => {
        setTimeout(() => {
          stopTutorial();
        }, 2000);
      });
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setTimeout(async () => {
        if (steps[newIndex]) {
          await speak(steps[newIndex].instruction);
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
      
      setTimeout(async () => {
        if (steps[index]) {
          await speak(steps[index].instruction);
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