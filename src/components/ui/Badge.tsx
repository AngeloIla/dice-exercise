const Badge = ({ text, className }: { text: string; className?: string }) => {
  return (
    <button
      className={`p-2 text-white rounded bg-blue-600 cursor-not-allowed ${className}`}
    >
      {text}
    </button>
  );
};

export default Badge;
