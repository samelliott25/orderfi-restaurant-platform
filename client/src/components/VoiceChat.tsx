import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VoiceChatProps {
  onMessage: (message: string) => Promise<string>;
  placeholder?: string;
  disabled?: boolean;
}

export interface VoiceChatRef {
  speakText: (text: string) => void;
}

export const VoiceChat = forwardRef<VoiceChatRef, VoiceChatProps>(({ 
  onMessage, 
  placeholder = "Speak or type your message...", 
  disabled = false 
}, ref) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      synthRef.current = SpeechSynthesis;
    }
  }, []);

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  useImperativeHandle(ref, () => ({
    speakText
  }));

  const startListening = () => {
    if (recognitionRef.current && !isListening && !disabled && !isProcessing) {
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

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isProcessing || disabled) return;

    setInput('');
    setIsProcessing(true);

    try {
      const response = await onMessage(messageToSend);
      speakText(response);
    } catch (error) {
      console.error('Message processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Voice Controls */}
      {isSupported && (
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Button
            variant={isListening ? "default" : "outline"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            disabled={disabled || isProcessing}
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
            onClick={stopSpeaking}
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
      )}

      {/* Text Input */}
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={disabled || isProcessing}
          className="flex-1"
        />
        <Button 
          onClick={() => handleSendMessage()} 
          disabled={disabled || isProcessing || !input.trim()}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isProcessing ? (
            <Bot className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});