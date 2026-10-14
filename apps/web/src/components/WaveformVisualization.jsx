
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveformVisualization = forwardRef(({ audioUrl, onReady, onPlay, onPause, onTimeUpdate, onFinish }, ref) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => wavesurferRef.current?.play(),
    pause: () => wavesurferRef.current?.pause(),
    togglePlay: () => wavesurferRef.current?.playPause(),
    setVolume: (val) => wavesurferRef.current?.setVolume(val),
    seekTo: (progress) => wavesurferRef.current?.seekTo(progress),
    getDuration: () => wavesurferRef.current?.getDuration() || 0,
    getCurrentTime: () => wavesurferRef.current?.getCurrentTime() || 0,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(0, 217, 255, 0.2)', // Cyan with opacity
      progressColor: 'rgba(0, 217, 255, 1)', // Solid Cyan
      cursorColor: 'rgba(255, 255, 255, 0.8)',
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      height: 60,
      normalize: true,
      url: audioUrl,
      cursorWidth: 2,
    });

    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setIsReady(true);
      if (onReady) onReady(ws.getDuration());
    });

    ws.on('play', () => {
      if (onPlay) onPlay();
    });

    ws.on('pause', () => {
      if (onPause) onPause();
    });

    ws.on('timeupdate', (currentTime) => {
      if (onTimeUpdate) onTimeUpdate(currentTime);
    });

    ws.on('finish', () => {
      if (onFinish) onFinish();
    });

    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  return (
    <div className="w-full relative">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-md">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full cursor-pointer" />
    </div>
  );
});

WaveformVisualization.displayName = 'WaveformVisualization';

export default WaveformVisualization;
