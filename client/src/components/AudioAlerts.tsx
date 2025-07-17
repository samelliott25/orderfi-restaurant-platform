import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioAlertsProps {
  onNewOrder?: () => void;
  onOrderUpdate?: () => void;
  enabled?: boolean;
  volume?: number;
}

export const AudioAlerts: React.FC<AudioAlertsProps> = ({
  onNewOrder,
  onOrderUpdate,
  enabled = true,
  volume = 0.7
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [audioVolume, setAudioVolume] = useState(volume);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = audioVolume;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = audioVolume;
    }
  }, [audioVolume]);

  const playNewOrderAlert = () => {
    if (!isEnabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current!);
      
      // New order sound: Two ascending beeps
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime + 0.1);
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
      
      onNewOrder?.();
    } catch (error) {
      console.error('Error playing new order alert:', error);
    }
  };

  const playOrderUpdateAlert = () => {
    if (!isEnabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current!);
      
      // Order update sound: Single gentle beep
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.2, audioContextRef.current.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.15);
      
      onOrderUpdate?.();
    } catch (error) {
      console.error('Error playing order update alert:', error);
    }
  };

  // Audio methods are directly callable from the component

  return (
    <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isEnabled 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
        }`}
        title={isEnabled ? 'Disable audio alerts' : 'Enable audio alerts'}
      >
        {isEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
      
      {isEnabled && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/80">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioVolume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="w-20 accent-orange-500"
          />
          <span className="text-xs text-white/60">{Math.round(audioVolume * 100)}%</span>
        </div>
      )}
      
      <button
        onClick={playNewOrderAlert}
        className="px-3 py-1 text-xs bg-orange-500/20 text-orange-200 rounded hover:bg-orange-500/30 transition-colors"
        title="Test new order alert"
      >
        Test
      </button>
    </div>
  );
};

// Hook for using audio alerts in components
export const useAudioAlerts = () => {
  const audioAlertsRef = useRef<{ playNewOrderAlert: () => void; playOrderUpdateAlert: () => void } | null>(null);

  const playNewOrderAlert = () => {
    audioAlertsRef.current?.playNewOrderAlert();
  };

  const playOrderUpdateAlert = () => {
    audioAlertsRef.current?.playOrderUpdateAlert();
  };

  return {
    audioAlertsRef,
    playNewOrderAlert,
    playOrderUpdateAlert
  };
};