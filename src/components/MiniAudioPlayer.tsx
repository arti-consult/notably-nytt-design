import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Mic, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptSegment {
  text: string;
  timestamp: number;
  speaker?: string;
}

interface MiniAudioPlayerProps {
  src: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onSkip: (seconds: number) => void;
  onDownload?: () => void;
  isReady: boolean;
  currentTranscript?: string;
  currentSpeaker?: string;
  className?: string;
}

const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 1.75, 2];

export default function MiniAudioPlayer({
  duration,
  currentTime,
  isPlaying,
  volume,
  playbackSpeed,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onPlaybackSpeedChange,
  onSkip,
  onDownload,
  isReady,
  currentTranscript,
  currentSpeaker,
  className
}: MiniAudioPlayerProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !isReady) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    if (Number.isFinite(newTime)) {
      onSeek(newTime);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isReady) return;
    isDraggingRef.current = true;
    handleProgressClick(event);

    const handleMouseMove = (e: MouseEvent) => {
      if (!progressRef.current || !isDraggingRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newTime = Math.max(0, Math.min(percentage * duration, duration));
      if (Number.isFinite(newTime)) {
        onSeek(newTime);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleProgressHover = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !isReady) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;
    setHoverTime(time);
    setHoverX(x);
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
  };

  const cyclePlaybackSpeed = () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    onPlaybackSpeedChange(PLAYBACK_SPEEDS[nextIndex]);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate fake waveform data for visual effect
  const waveformBars = 60;
  const generateWaveform = () => {
    const bars = [];
    for (let i = 0; i < waveformBars; i++) {
      // Create pseudo-random but consistent heights
      const height = 20 + Math.sin(i * 0.5) * 15 + Math.cos(i * 0.3) * 10 + (i % 3) * 5;
      bars.push(Math.max(15, Math.min(100, height)));
    }
    return bars;
  };
  const waveform = generateWaveform();

  return (
    <div className={cn(
      "bg-white border-t border-gray-200",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main player row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button - Larger and more prominent */}
          <button
            onClick={onPlayPause}
            disabled={!isReady}
            className={cn(
              "p-3 rounded-full text-white transition-all flex-shrink-0 shadow-lg",
              isReady
                ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-violet-500/25 hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            )}
            aria-label={isPlaying ? 'Pause' : 'Spill av'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>

          {/* Skip backward */}
          <button
            onClick={() => onSkip(-10)}
            disabled={!isReady}
            className={cn(
              "p-2 rounded-full transition-colors flex-shrink-0 hidden sm:flex",
              isReady
                ? "hover:bg-gray-100 text-gray-600"
                : "text-gray-300 cursor-not-allowed"
            )}
            aria-label="Spol 10 sekunder tilbake"
            title="-10s"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Center section with transcript and progress */}
          <div className="flex-1 min-w-0">
            {/* Live transcript display */}
            <div className="flex items-center gap-2 mb-2 min-h-[24px]">
              {currentSpeaker && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="p-1 bg-violet-100 rounded-full">
                    <Mic className="h-3 w-3 text-violet-600" />
                  </div>
                  <span className="text-xs font-medium text-violet-600">
                    {currentSpeaker}
                  </span>
                </div>
              )}
              {currentTranscript && (
                <p className="text-sm text-gray-700 truncate">
                  "{currentTranscript}"
                </p>
              )}
              {!currentTranscript && !currentSpeaker && (
                <p className="text-sm text-gray-400 italic">
                  Klikk play for å starte avspilling
                </p>
              )}
            </div>

            {/* Waveform-style progress bar */}
            <div
              ref={progressRef}
              className={cn(
                "relative h-8 rounded-lg overflow-hidden group",
                isReady ? "cursor-pointer" : "cursor-not-allowed"
              )}
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleProgressHover}
              onMouseLeave={handleProgressLeave}
            >
              {/* Background waveform */}
              <div className="absolute inset-0 flex items-center justify-between gap-px px-1">
                {waveform.map((height, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-full transition-colors",
                      (i / waveformBars) * 100 <= progress
                        ? "bg-violet-500"
                        : "bg-gray-200"
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Hover time indicator */}
              {hoverTime !== null && (
                <div
                  className="absolute -top-8 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-10"
                  style={{ left: hoverX }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}

              {/* Progress indicator line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Skip forward */}
          <button
            onClick={() => onSkip(10)}
            disabled={!isReady}
            className={cn(
              "p-2 rounded-full transition-colors flex-shrink-0 hidden sm:flex",
              isReady
                ? "hover:bg-gray-100 text-gray-600"
                : "text-gray-300 cursor-not-allowed"
            )}
            aria-label="Spol 10 sekunder fremover"
            title="+10s"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Time display */}
          <div className="flex-shrink-0 text-sm tabular-nums text-gray-600 hidden md:block">
            <span className="font-medium text-gray-900">{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Playback speed button */}
          <button
            onClick={cyclePlaybackSpeed}
            disabled={!isReady}
            className={cn(
              "px-2 py-1 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
              isReady
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
            aria-label="Endre avspillingshastighet"
            title="Klikk for å endre hastighet"
          >
            {playbackSpeed}x
          </button>

          {/* Volume Controls - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
              disabled={!isReady}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isReady
                  ? "hover:bg-gray-100"
                  : "cursor-not-allowed"
              )}
              aria-label={volume > 0 ? 'Demp lyd' : 'Slå på lyd'}
            >
              {volume > 0 ? (
                <Volume2 className="h-4 w-4 text-gray-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              disabled={!isReady}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
              aria-label="Volum"
            />
          </div>

          {/* Download button */}
          {onDownload && (
            <button
              onClick={onDownload}
              disabled={!isReady}
              className={cn(
                "p-2 rounded-full transition-colors flex-shrink-0",
                isReady
                  ? "hover:bg-gray-100 text-gray-600 hover:text-violet-600"
                  : "text-gray-300 cursor-not-allowed"
              )}
              aria-label="Last ned lydklipp"
              title="Last ned lydklipp"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile time display */}
        <div className="flex justify-between text-xs text-gray-500 mt-1 md:hidden">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
