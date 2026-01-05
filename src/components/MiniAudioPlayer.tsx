import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Mic } from 'lucide-react';
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

  return (
    <div className={cn(
      "bg-white border-t border-gray-200",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main player row */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button - Larger and more prominent */}
          <button
            onClick={onPlayPause}
            disabled={!isReady}
            className={cn(
              "p-3 rounded-full text-white transition-all flex-shrink-0 shadow-lg",
              isReady
                ? "bg-gradient-to-br from-[#2C64E3] to-[#5A8DF8] hover:from-[#1F49C6] hover:to-[#4A81EB] hover:shadow-[#2C64E3]/25 hover:scale-105"
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

          {/* Center section with transcript and progress */}
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
            {/* Progress bar with playhead */}
            <div
              ref={progressRef}
              className={cn(
                "relative h-8 flex items-center group w-full max-w-3xl",
                isReady ? "cursor-pointer" : "cursor-not-allowed"
              )}
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleProgressHover}
              onMouseLeave={handleProgressLeave}
            >
              {/* Background track */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  {/* Progress line */}
                  <div
                    className="h-full bg-[#2C64E3] transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
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

              {/* Playhead */}
              <div
                className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-100"
                style={{ left: `${progress}%` }}
              >
                <div className="w-3 h-3 bg-white border-2 border-[#2C64E3] rounded-full shadow-lg -ml-1.5 group-hover:scale-125 transition-transform" />
              </div>
            </div>
          </div>

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
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2C64E3]"
              aria-label="Volum"
            />
          </div>
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
