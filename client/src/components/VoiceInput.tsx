import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  onVoiceResponse?: (text: string) => void;
  isProcessing?: boolean;
}

export function VoiceInput({ onVoiceInput, onVoiceResponse, isProcessing }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      synthRef.current = SpeechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onVoiceInput]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      // Stop any ongoing speech
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current && text) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
      
      if (onVoiceResponse) {
        onVoiceResponse(text);
      }
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-speak AI responses
  useEffect(() => {
    if (onVoiceResponse && !isSpeaking) {
      // This would be called from the parent component when AI responds
    }
  }, [onVoiceResponse, isSpeaking]);

  if (!isSupported) {
    return (
      <div className="text-xs text-gray-500 text-center p-2">
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 p-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'hover:bg-orange-50'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-1" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-1" />
            Speak
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSpeech}
        disabled={!isSpeaking}
        className={`transition-all duration-200 ${
          isSpeaking ? 'text-orange-600' : 'text-gray-400'
        }`}
      >
        {isSpeaking ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>

      {isListening && (
        <div className="text-xs text-orange-600 animate-pulse">
          Listening...
        </div>
      )}
      
      {isSpeaking && (
        <div className="text-xs text-orange-600 animate-pulse">
          Speaking...
        </div>
      )}
    </div>
  );
}