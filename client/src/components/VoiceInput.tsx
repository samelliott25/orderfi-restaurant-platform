import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
  disabled?: boolean;
}

export function VoiceInput({ 
  onTranscript, 
  onStartListening, 
  onStopListening, 
  disabled = false 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition() as ISpeechRecognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onStartListening?.();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(interimTranscript);
        
        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
          setTranscript('');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        onStopListening?.();
      };

      recognition.onend = () => {
        setIsListening(false);
        onStopListening?.();
        setTranscript('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onStartListening, onStopListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !disabled) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't show the button if voice input isn't supported
  }

  return (
    <div className="flex flex-col items-center">
      {/* Voice Input Button */}
      <button
        onClick={toggleListening}
        disabled={disabled}
        className="p-3 rounded-full transition-all duration-200 text-white hover:bg-blue-600 shadow-md hover:shadow-lg bg-[#f9be39]"
        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      {/* Live Transcript Display */}
      {transcript && (
        <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-300 max-w-xs">
          <div className="flex items-center mb-1">
            <Volume2 size={16} className="text-blue-500 mr-1" />
            <span className="text-sm text-gray-600">Listening...</span>
          </div>
          <p className="text-sm text-gray-800 italic">"{transcript}"</p>
        </div>
      )}
      {/* Instructions */}
      <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
        {isListening 
          ? 'Speak clearly. Tap microphone to stop.' 
          : 'Tap microphone to speak your order'
        }
      </p>
    </div>
  );
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}