import React, { useState, useRef, useEffect } from 'react';
import { useThemeClasses } from '../themeUtils';

interface VoiceMessage {
  id: string;
  url: string;
  duration: number;
  waveform: number[];
}

interface VoiceRecorderProps {
  onSend: (message: VoiceMessage) => void;
  onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const tc = useThemeClasses();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [waveform, setWaveform] = useState<number[]>(Array(50).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        // Simulate waveform
        setWaveform((prev) => {
          const newWaveform = [...prev.slice(1), Math.random() * 100];
          return newWaveform;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        onSend({
          id: Date.now().toString(),
          url,
          duration: recordingTime,
          waveform: waveform,
        });

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${tc.bgCard} rounded-xl p-4 border ${tc.border}`}>
      <div className="flex items-center gap-3">
        {/* Waveform visualization */}
        <div className="flex-1 flex items-center gap-0.5 h-12">
          {waveform.map((amplitude, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all duration-100 ${
                isRecording ? 'bg-red-500' : tc.bgTertiary
              }`}
              style={{
                height: `${Math.max(4, amplitude)}%`,
              }}
            />
          ))}
        </div>

        {/* Timer */}
        <div className={`text-lg font-mono font-bold ${isRecording ? 'text-red-500' : tc.text}`}>
          {formatTime(recordingTime)}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
          ) : (
            <>
              <button
                onClick={stopRecording}
                className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </button>
              <button
                onClick={onCancel}
                className={`w-12 h-12 rounded-full ${tc.bgTertiary} hover:bg-gray-500/20 flex items-center justify-center ${tc.text}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {isRecording && (
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className={`text-xs ${tc.textSecondary}`}>Recording...</span>
        </div>
      )}
    </div>
  );
}

// Voice Message Player Component
interface VoicePlayerProps {
  message: VoiceMessage;
}

export function VoicePlayer({ message }: VoicePlayerProps) {
  const tc = useThemeClasses();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / message.duration) * 100;

  return (
    <div className={`${tc.bgCard} rounded-xl p-3 border ${tc.border} max-w-xs`}>
      <audio ref={audioRef} src={message.url} />
      
      <div className="flex items-center gap-3">
        {/* Play button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div className="flex-1 flex items-center gap-0.5 h-8">
          {message.waveform.map((amplitude, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all ${
                index < (progress / 100) * message.waveform.length
                  ? 'bg-blue-500'
                  : tc.bgTertiary
              }`}
              style={{
                height: `${Math.max(4, amplitude)}%`,
              }}
            />
          ))}
        </div>

        {/* Duration */}
        <div className={`text-xs font-mono ${tc.textSecondary} flex-shrink-0`}>
          {formatTime(currentTime)} / {formatTime(message.duration)}
        </div>
      </div>
    </div>
  );
}
