const Spinner = () => {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
      <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
      <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce" />
    </div>
  );
};

export default Spinner;
