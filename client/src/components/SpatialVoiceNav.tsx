import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpatialVoiceNavProps {
  onVoiceCommand?: (command: string, confidence: number) => void;
  onSpatialUpdate?: (position: { x: number; y: number; z: number }) => void;
  enableHaptics?: boolean;
  spatialSensitivity?: number;
  className?: string;
  'data-testid'?: string;
}

interface VoiceCommand {
  command: string;
  confidence: number;
  timestamp: number;
  spatialPosition: { x: number; y: number; z: number };
}

export const SpatialVoiceNav: React.FC<SpatialVoiceNavProps> = ({
  onVoiceCommand,
  onSpatialUpdate,
  enableHaptics = true,
  spatialSensitivity = 0.5,
  className = '',
  'data-testid': testId = 'spatial-voice-nav'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpatialActive, setIsSpatialActive] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);
  const [spatialPosition, setSpatialPosition] = useState({ x: 0, y: 0, z: 0 });
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const spatialAudioRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const latest = event.results[event.results.length - 1];
        const command = latest[0].transcript;
        const confidence = latest[0].confidence;
        
        setCurrentCommand(command);
        setConfidence(confidence);
        
        if (latest.isFinal) {
          const newCommand: VoiceCommand = {
            command,
            confidence,
            timestamp: Date.now(),
            spatialPosition: { ...spatialPosition }
          };
          
          setRecentCommands(prev => [newCommand, ...prev.slice(0, 4)]);
          onVoiceCommand?.(command, confidence);
          
          // Haptic feedback for successful recognition
          if (enableHaptics && confidence > 0.7) {
            triggerHapticFeedback();
          }
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, [spatialPosition, onVoiceCommand, enableHaptics]);

  // Initialize Spatial Audio
  useEffect(() => {
    if (isSpatialActive) {
      initializeSpatialAudio();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isSpatialActive]);

  const initializeSpatialAudio = async () => {
    try {
      audioContextRef.current = new AudioContext();
      const listener = audioContextRef.current.listener;
      
      // Set up spatial audio parameters
      listener.setOrientation(0, 0, -1, 0, 1, 0);
      listener.setPosition(0, 0, 0);
      
      // Create spatial audio feedback
      spatialAudioRef.current = audioContextRef.current.createPanner();
      spatialAudioRef.current.panningModel = 'HRTF';
      spatialAudioRef.current.distanceModel = 'inverse';
      spatialAudioRef.current.refDistance = 1;
      spatialAudioRef.current.maxDistance = 10;
      spatialAudioRef.current.rolloffFactor = 1;
      spatialAudioRef.current.coneInnerAngle = 360;
      spatialAudioRef.current.coneOuterAngle = 0;
      spatialAudioRef.current.coneOuterGain = 0;
      
    } catch (error) {
      console.error('Failed to initialize spatial audio:', error);
    }
  };

  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const toggleSpatialAudio = () => {
    setIsSpatialActive(!isSpatialActive);
  };

  const updateSpatialPosition = (newPosition: { x: number; y: number; z: number }) => {
    setSpatialPosition(newPosition);
    onSpatialUpdate?.(newPosition);
    
    if (spatialAudioRef.current) {
      spatialAudioRef.current.setPosition(newPosition.x, newPosition.y, newPosition.z);
    }
  };

  const getCommandIntensity = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const spatialIndicatorVariants = {
    active: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    inactive: {
      scale: 1,
      rotate: 0
    }
  };

  return (
    <div className={`relative ${className}`} data-testid={testId}>
      {/* Main Control Panel */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              variants={spatialIndicatorVariants}
              animate={isSpatialActive ? 'active' : 'inactive'}
              className="relative"
            >
              <Navigation className="w-5 h-5 text-blue-400" />
              {isSpatialActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400/50"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.3, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </motion.div>
            
            <h3 className="text-lg font-semibold text-white">Spatial Voice Navigation</h3>
            
            <div className="flex gap-2 ml-auto">
              <Button
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className="gap-2"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Stop' : 'Listen'}
              </Button>
              
              <Button
                variant={isSpatialActive ? "default" : "outline"}
                size="sm"
                onClick={toggleSpatialAudio}
                className="gap-2"
              >
                {isSpatialActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                3D Audio
              </Button>
            </div>
          </div>
          
          {/* Current Command Display */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/50 rounded-lg p-3 mb-4 border border-slate-700/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-slate-300">Listening...</span>
                </div>
                
                {currentCommand && (
                  <div className="space-y-1">
                    <p className="text-white font-medium">{currentCommand}</p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getCommandIntensity(confidence)}`}
                    >
                      {Math.round(confidence * 100)}% confidence
                    </Badge>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Spatial Position Display */}
          {isSpatialActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-950/30 rounded-lg p-3 mb-4 border border-blue-500/20"
            >
              <h4 className="text-sm font-medium text-blue-300 mb-2">Spatial Position</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-slate-400">X</div>
                  <div className="text-white font-mono">{spatialPosition.x.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Y</div>
                  <div className="text-white font-mono">{spatialPosition.y.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Z</div>
                  <div className="text-white font-mono">{spatialPosition.z.toFixed(2)}</div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Recent Commands */}
          {recentCommands.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-300">Recent Commands</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {recentCommands.map((cmd, index) => (
                  <motion.div
                    key={cmd.timestamp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1"
                  >
                    <span className="text-slate-300 truncate">{cmd.command}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCommandIntensity(cmd.confidence)}`}
                    >
                      {Math.round(cmd.confidence * 100)}%
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpatialVoiceNav;