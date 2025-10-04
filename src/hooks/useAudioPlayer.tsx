import { useRef, useState } from "react";

export const useAudioPlayer = (audioTrack: string | null) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const AudioPlayer = audioTrack ? (
    <audio
      ref={audioRef}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onEnded={() => setIsPlaying(false)}
      src={audioTrack}
      preload="metadata"
    />
  ) : null;

  return { isPlaying, togglePlayPause, AudioPlayer };
};
