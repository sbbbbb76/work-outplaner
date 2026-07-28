import React, { useState, useRef } from 'react';
import { formatVideoUrl } from '../utils/videoUtils';
import { Maximize2, Minimize2, Play, Volume2, VolumeX, AlertCircle, Video } from 'lucide-react';

interface InlineVideoPlayerProps {
  videoUrl?: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
  showExpandButton?: boolean;
}

export const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({
  videoUrl,
  title,
  className = '',
  aspectRatio = 'aspect-video',
  showExpandButton = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const formattedUrl = formatVideoUrl(videoUrl);

  const handleToggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!formattedUrl || hasError) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center p-4 text-center text-slate-400 ${aspectRatio} ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-2 text-slate-500">
          <Video className="w-6 h-6" />
        </div>
        <p className="text-xs font-medium text-slate-300">{title || '無示範影片'}</p>
        {formattedUrl && hasError && (
          <span className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> 影片連結無法播放 (網址或格式限制)
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Inline Container */}
      <div
        onClick={() => showExpandButton && handleToggleExpand()}
        className={`group relative overflow-hidden rounded-xl bg-black border border-slate-800 shadow-md transition-all duration-200 cursor-pointer ${aspectRatio} ${className}`}
      >
        <video
          ref={videoRef}
          src={formattedUrl}
          playsInline
          autoPlay
          loop
          muted={isMuted}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />

        {/* Overlay Controls Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-90 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            {title && (
              <span className="text-xs font-semibold text-white/90 truncate max-w-[80%] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                {title}
              </span>
            )}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-1.5 rounded-lg bg-black/50 text-white/90 hover:bg-black/70 hover:text-emerald-400 backdrop-blur-md transition-colors"
                title={isMuted ? '取消靜音' : '靜音'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pointer-events-auto">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              無縫循環示範
            </span>

            {showExpandButton && (
              <button
                type="button"
                onClick={handleToggleExpand}
                className="p-1.5 rounded-lg bg-emerald-600/90 text-white hover:bg-emerald-500 shadow-lg backdrop-blur-md transition-transform group-hover:scale-105 flex items-center gap-1 text-[11px] font-medium"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">全螢幕</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Seamless Modal View */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsExpanded(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[85vh] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-base font-bold text-white truncate">{title || '動作影片示範'}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-amber-400" />
                      開啟聲音
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      靜音
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-xl bg-slate-800/90 hover:bg-rose-600 text-slate-200 hover:text-white transition-colors"
                  title="關閉"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Large Video Display */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
              <video
                src={formattedUrl}
                playsInline
                autoPlay
                loop
                muted={isMuted}
                controls
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-[80%] font-mono text-[11px] text-slate-500">
                來源: {formattedUrl}
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
              >
                完成預覽
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
