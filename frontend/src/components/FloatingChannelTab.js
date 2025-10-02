import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const FloatingChannelTab = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleChannelClick = () => {
    window.open('https://t.me/SS_5xn', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Channel Button */}
      <div className={`transition-all duration-300 ${isMinimized ? 'scale-75' : 'scale-100'}`}>
        <button
          onClick={handleChannelClick}
          className="group bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse-slow"
          data-testid="floating-channel-tab"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            {!isMinimized && (
              <span className="font-bold text-sm whitespace-nowrap">قناتنا الرسمية 📢</span>
            )}
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
            انضم لقناة التلغرام الرسمية
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      </div>

      {/* Minimization Toggle */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-all duration-300 transform hover:scale-110"
      >
        {isMinimized ? '📢' : <X className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default FloatingChannelTab;