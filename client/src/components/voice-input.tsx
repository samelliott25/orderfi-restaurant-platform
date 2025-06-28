import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Square } from "lucide-react";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  isProcessing?: boolean;
  className?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceInput({ onVoiceInput, isProcessing = false, className = "" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize speech recognition
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript("");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          onVoiceInput(finalTranscript.trim());
          stopListening();
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      setIsSupported(false);
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onVoiceInput]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds to prevent hanging
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setError("Failed to start voice recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Text-to-speech for responses
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Alex') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card className={`p-4 border-dashed border-gray-300 ${className}`}>
        <div className="text-center text-gray-500">
          <MicOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Voice input not supported in this browser</p>
          <p className="text-xs mt-1">Try Chrome, Edge, or Safari</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Voice Input Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleListening}
          disabled={isProcessing}
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          className={`transition-all duration-200 ${
            isListening ? "animate-pulse" : ""
          }`}
        >
          {isListening ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Speak
            </>
          )}
        </Button>

        {/* TTS Button for testing */}
        <Button
          onClick={() => speakText("Hello! I'm Mimi, your AI waitress. How can I help you today?")}
          variant="ghost"
          size="sm"
          title="Test voice output"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Status and Transcript */}
      {(isListening || transcript || error) && (
        <Card className="p-3">
          <div className="space-y-2">
            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <Badge variant="secondary">Listening...</Badge>
              </div>
            )}
            
            {transcript && (
              <div>
                <p className="text-sm text-gray-600 mb-1">You said:</p>
                <p className="text-sm font-medium">{transcript}</p>
                {confidence > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {(confidence * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            )}
            
            {error && (
              <div className="text-red-600 text-sm">
                <p>Voice recognition error: {error}</p>
                <p className="text-xs mt-1">
                  Make sure your microphone is enabled and try again
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Usage Tips */}
      {!isListening && !transcript && !error && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Click "Speak" and say your order clearly</p>
          <p>• Speak at normal pace for best results</p>
          <p>• Allow microphone access when prompted</p>
        </div>
      )}
    </div>
  );
}