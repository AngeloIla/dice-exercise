import { IoIosPlay, IoIosPause } from "react-icons/io";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

export function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-gray-300/50 text-white focus:outline-none z-20 h-12 w-12 flex items-center justify-center absolute bottom-0 left-0"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? <IoIosPause size={24} /> : <IoIosPlay size={24} />}
    </button>
  );
}

export default PlayButton;
