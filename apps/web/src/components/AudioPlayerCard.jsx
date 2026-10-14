
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import WaveformVisualization from '@/components/WaveformVisualization.jsx';
import pb from '@/lib/pocketbaseClient';

const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayerCard = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const waveformRef = useRef(null);

  const handlePlayPause = () => {
    if (waveformRef.current) {
      waveformRef.current.togglePlay();
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (waveformRef.current) {
      waveformRef.current.setVolume(newVolume / 100);
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (waveformRef.current) waveformRef.current.setVolume(volume / 100);
    } else {
      setIsMuted(true);
      if (waveformRef.current) waveformRef.current.setVolume(0);
    }
  };

  // Resolve the correct audio URL. 
  // If the sound has an uploaded audioFile, use PocketBase's getUrl method.
  // Otherwise, fall back to the legacy audioUrl text field.
  const resolvedAudioUrl = sound.audioFile 
    ? pb.files.getUrl(sound, sound.audioFile) 
    : sound.audioUrl;

  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              {sound.category && (
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 rounded-full mb-2 shadow-[0_0_10px_hsl(var(--primary)/0.1)]">
                  {sound.category}
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {sound.title}
              </h3>
              {sound.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {sound.description}
                </p>
              )}
            </div>
          </div>

          {/* Waveform Area */}
          <div className="py-2">
            <WaveformVisualization
              ref={waveformRef}
              audioUrl={resolvedAudioUrl}
              onReady={(dur) => setDuration(dur)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(time) => setCurrentTime(time)}
              onFinish={() => setIsPlaying(false)}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-1" />
                )}
              </Button>
              
              <div className="text-xs font-medium font-mono text-muted-foreground w-20">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3 w-32">
              <button onClick={toggleMute} className="text-muted-foreground hover:text-primary transition-colors">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayerCard;
