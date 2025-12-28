const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium flex items-center gap-2">
        <span className="animate-pulse-slow">🤖</span>
        AI is thinking...
      </p>
      <p className="text-sm text-gray-400 mt-1">Finding the best products for you</p>
    </div>
  );
};

export default Loader;
  