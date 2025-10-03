const Button = ({ text }: { text: string }) => {
  return (
    <button
      className={`p-2 text-white rounded hover:bg-blue-600 bg-gray-400 cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default Button;
