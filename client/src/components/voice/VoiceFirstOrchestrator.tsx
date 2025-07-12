import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Brain, 
  Activity, 
  Heart,
  AlertCircle,
  CheckCircle,
  Volume2
} from 'lucide-react';

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  currentTranscript: string;
  aiResponse: string;
  conversationHistory: Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    confidence?: number;
    sentiment?: string;
  }>;
}

interface VoiceFirstOrchestratorProps {
  onOrderUpdate?: (orderData: any) => void;
  onUIAdaptation?: (adaptationData: any) => void;
  className?: string;
}

export function VoiceFirstOrchestrator({
  onOrderUpdate,
  onUIAdaptation,
  className = ''
}: VoiceFirstOrchestratorProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    confidence: 0,
    sentiment: 'neutral',
    currentTranscript: '',
    aiResponse: '',
    conversationHistory: []
  });

  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = handleSpeechEnd;
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize audio context for noise detection
    initializeAudioContext();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeAudioContext = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateNoiseLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setNoiseLevel(average);
        requestAnimationFrame(updateNoiseLevel);
      };
      
      updateNoiseLevel();
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  };

  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    const confidence = event.results[event.results.length - 1][0].confidence;
    
    setVoiceState(prev => ({
      ...prev,
      currentTranscript: transcript,
      confidence: confidence || 0
    }));

    // Check for wake word
    if (transcript.toLowerCase().includes('hey orderfi') || transcript.toLowerCase().includes('order fi')) {
      setIsWakeWordActive(true);
      processVoiceCommand(transcript);
    }
  };

  const handleSpeechError = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    setVoiceState(prev => ({
      ...prev,
      isListening: false,
      isProcessing: false
    }));
  };

  const handleSpeechEnd = () => {
    setVoiceState(prev => ({
      ...prev,
      isListening: false
    }));
  };

  const processVoiceCommand = async (transcript: string) => {
    setVoiceState(prev => ({ ...prev, isProcessing: true }));
    
    try {
      // Send to xAI Grok for processing
      const response = await fetch('/api/ai/process-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          confidence: voiceState.confidence,
          context: 'restaurant_ordering',
          conversationHistory: voiceState.conversationHistory.slice(-5) // Last 5 interactions
        })
      });

      const aiResult = await response.json();
      
      // Analyze sentiment
      const sentiment = analyzeSentiment(transcript);
      
      // Update conversation history
      const newHistory = [
        ...voiceState.conversationHistory,
        {
          type: 'user' as const,
          content: transcript,
          timestamp: new Date(),
          confidence: voiceState.confidence,
          sentiment
        },
        {
          type: 'ai' as const,
          content: aiResult.response,
          timestamp: new Date()
        }
      ];

      setVoiceState(prev => ({
        ...prev,
        sentiment,
        aiResponse: aiResult.response,
        conversationHistory: newHistory,
        isProcessing: false
      }));

      // Handle different command types
      if (aiResult.intent === 'order_item') {
        onOrderUpdate?.(aiResult.orderData);
      } else if (aiResult.intent === 'ui_adaptation') {
        onUIAdaptation?.(aiResult.adaptationData);
      }

      // Provide voice feedback
      speak(aiResult.response);
      
    } catch (error) {
      console.error('Voice processing error:', error);
      setVoiceState(prev => ({
        ...prev,
        isProcessing: false,
        aiResponse: 'Sorry, I had trouble processing that. Could you try again?'
      }));
    }
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['great', 'awesome', 'love', 'excellent', 'perfect', 'delicious'];
    const negativeWords = ['hate', 'terrible', 'awful', 'disgusting', 'horrible', 'worst'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setVoiceState(prev => ({ ...prev, isListening: true }));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceState(prev => ({ ...prev, isListening: false }));
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`voice-orchestrator ${className}`}>
      <CardContent className="p-6 space-y-6">
        {/* Voice Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-orange-500" />
              {voiceState.isProcessing && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold playwrite-font">OrderFi Voice Assistant</h3>
              <p className="text-sm text-muted-foreground">
                {voiceState.isListening ? 'Listening...' : 
                 voiceState.isProcessing ? 'Processing...' : 
                 'Say "Hey OrderFi" to start'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${getSentimentColor(voiceState.sentiment)}`} />
              <span className="text-xs">{voiceState.sentiment}</span>
            </Badge>
            
            {voiceState.confidence > 0 && (
              <Badge variant="outline" className={getConfidenceColor(voiceState.confidence)}>
                {Math.round(voiceState.confidence * 100)}%
              </Badge>
            )}
          </div>
        </div>

        {/* Voice Waveform Visualization */}
        <div className="h-20 bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-4 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="w-1 bg-orange-500 rounded-full transition-all duration-150"
                style={{
                  height: voiceState.isListening 
                    ? `${Math.random() * 40 + 10}px` 
                    : '4px',
                  opacity: voiceState.isListening ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </div>

        {/* Current Transcript */}
        {voiceState.currentTranscript && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Mic className="h-4 w-4 text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium">You said:</p>
                <p className="text-sm text-muted-foreground">"{voiceState.currentTranscript}"</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Response */}
        {voiceState.aiResponse && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Brain className="h-4 w-4 text-orange-500 mt-1" />
              <div>
                <p className="text-sm font-medium">OrderFi says:</p>
                <p className="text-sm text-muted-foreground">"{voiceState.aiResponse}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={voiceState.isListening ? stopListening : startListening}
            className={`h-12 w-12 rounded-full ${
              voiceState.isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            disabled={voiceState.isProcessing}
          >
            {voiceState.isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => speak(voiceState.aiResponse || 'Hello! I\'m OrderFi, your voice assistant. Say "Hey OrderFi" to start ordering.')}
            className="h-12 w-12 rounded-full"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Environmental Status */}
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Noise: {Math.round(noiseLevel)}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isWakeWordActive ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-yellow-500" />
            )}
            <span>Wake Word: {isWakeWordActive ? 'Active' : 'Waiting'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    AudioContext: any;
    webkitAudioContext: any;
  }
}