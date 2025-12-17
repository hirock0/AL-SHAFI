export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white/70 backdrop-blur-sm fixed inset-0 z-50">
      <div className="relative flex items-center justify-center">
        {/* Background ring (less visible) */}
        <div className="h-20 w-20 rounded-full border-4 border-gray-200"></div>

        {/* Animated ring (smooth, primary color) */}
        <div
          className="absolute h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin 
                   shadow-xl shadow-accent/20 transition-all duration-300"
        ></div>

        {/* Optional: Central icon or message */}
        <svg
          className="absolute animate-spin w-8 h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    </div>
  );
}
