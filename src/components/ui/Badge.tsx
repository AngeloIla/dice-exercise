const Badge = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={`p-2 text-white rounded bg-blue-600 ${className}`}>
      {text}
    </span>
  );
};

export default Badge;
