import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VoiceCommand {
  command: string;
  confidence: number;
  action: string;
  timestamp: Date;
}

interface VoiceFirstInterfaceProps {
  onVoiceCommand: (command: VoiceCommand) => void;
  isProcessing?: boolean;
  context?: 'ordering' | 'kitchen' | 'payment' | 'inventory';
}

export const VoiceFirstInterface: React.FC<VoiceFirstInterfaceProps> = ({
  onVoiceCommand,
  isProcessing = false,
  context = 'ordering'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Context-specific voice commands
  const contextCommands = {
    ordering: [
      'add burger', 'add fries', 'remove item', 'checkout', 'clear cart',
      'show menu', 'repeat order', 'apply discount', 'split bill'
    ],
    kitchen: [
      'mark ready', 'start cooking', 'need more time', 'order priority',
      'call customer', 'update status', 'print ticket', 'clear order'
    ],
    payment: [
      'process payment', 'refund order', 'print receipt', 'split payment',
      'apply tip', 'cash payment', 'card payment', 'crypto payment'
    ],
    inventory: [
      'check stock', 'reorder item', 'update count', 'low stock alert',
      'scan barcode', 'print labels', 'export report', 'schedule delivery'
    ]
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setConfidence(0);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let maxConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            maxConfidence = Math.max(maxConfidence, result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        setConfidence(maxConfidence);
        
        // Process final command
        if (finalTranscript && maxConfidence > 0.7) {
          const command: VoiceCommand = {
            command: finalTranscript.trim(),
            confidence: maxConfidence,
            action: interpretCommand(finalTranscript.trim(), context),
            timestamp: new Date()
          };
          
          setLastCommand(command);
          onVoiceCommand(command);
          
          // Provide voice feedback
          if (voiceEnabled) {
            speakFeedback(command.action);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [context, onVoiceCommand, voiceEnabled]);

  const interpretCommand = (command: string, context: string): string => {
    const lowerCommand = command.toLowerCase();
    const commands = contextCommands[context as keyof typeof contextCommands];
    
    // Find best matching command
    const match = commands.find(cmd => 
      lowerCommand.includes(cmd.toLowerCase()) || 
      cmd.toLowerCase().includes(lowerCommand)
    );
    
    if (match) {
      return match;
    }
    
    // Fallback interpretation
    if (lowerCommand.includes('add') || lowerCommand.includes('order')) {
      return 'add_item';
    } else if (lowerCommand.includes('remove') || lowerCommand.includes('delete')) {
      return 'remove_item';
    } else if (lowerCommand.includes('pay') || lowerCommand.includes('checkout')) {
      return 'process_payment';
    } else if (lowerCommand.includes('ready') || lowerCommand.includes('done')) {
      return 'mark_ready';
    } else {
      return 'unknown_command';
    }
  };

  const speakFeedback = (action: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    
    const feedbackMessages = {
      'add_item': 'Item added to order',
      'remove_item': 'Item removed from order',
      'process_payment': 'Processing payment',
      'mark_ready': 'Order marked as ready',
      'unknown_command': 'Command not recognized, please try again'
    };
    
    const message = feedbackMessages[action as keyof typeof feedbackMessages] || 'Command processed';
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  if (!speechSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Voice commands are not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border-2 border-orange-200 dark:border-orange-800">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-lg">Voice Assistant</h3>
            <Badge variant="outline" className="capitalize">
              {context}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className="h-8 w-8 p-0"
            >
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Voice Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Button
              onClick={toggleListening}
              disabled={isProcessing}
              size="lg"
              className={`h-20 w-20 rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isListening ? 'Listening...' : 'Tap to speak'}
            </p>
            
            {transcript && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                <p className="text-sm font-medium">"{transcript}"</p>
                {confidence > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Last Command */}
          {lastCommand && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Last Command
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                "{lastCommand.command}" → {lastCommand.action}
              </p>
            </div>
          )}

          {/* Quick Commands */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Try saying:
            </p>
            <div className="flex flex-wrap gap-2">
              {contextCommands[context as keyof typeof contextCommands].slice(0, 4).map((cmd, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900"
                  onClick={() => {
                    const command: VoiceCommand = {
                      command: cmd,
                      confidence: 1.0,
                      action: interpretCommand(cmd, context),
                      timestamp: new Date()
                    };
                    onVoiceCommand(command);
                  }}
                >
                  "{cmd}"
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceFirstInterface;