interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-white rounded hover:bg-blue-600 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed hover:bg-gray-300"
          : "bg-blue-500"
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
