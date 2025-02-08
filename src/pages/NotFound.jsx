import React from "react";
import { useState, useEffect } from "react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div className={`transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}>
        {/* Animated SVG Icon */}
        <div className="animate-bounce">
          <svg 
            className="w-20 h-20 mx-auto text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3.055 11H5c.512 0 .919-.448.919-1s-.407-1-.919-1H3.055A9.004 9.004 0 0111 2.065V4c0 .552.448 1 1 1s1-.448 1-1V2.065A9.004 9.004 0 0120.945 11H19c-.512 0-.919.448-.919 1s.407 1 .919 1h1.945A9.004 9.004 0 0113 20.935V19c0-.552-.448-1-1-1s-1 .448-1 1v1.935A9.004 9.004 0 013.055 13H5c.512 0 .919-.448.919-1s-.407-1-.919-1H3.055z" />
          </svg>
        </div>

        {/* Animated 404 Text */}
        <h1 className={`mt-10 text-8xl mb-8 text-blue-500 font-bold
          ${isVisible ? 'animate-pulse' : ''}`}>
          Error 404
        </h1>

        {/* Message with fade-in animation */}
        <h2 className={`mt-10 text-3xl md:text-4xl mb-8 text-blue-500
          transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          transition-all duration-1000 delay-500`}>
          It looks like something went wrong
        </h2>

        {/* Animated Button */}
        <button
          onClick={() => window.history.back()}
          className={`bg-blue-500 text-white px-8 py-3 rounded-lg
            transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            transition-all duration-1000 delay-1000
            hover:bg-blue-600 hover:scale-105 active:scale-95
            hover:shadow-lg`}
        >
          Back Home
        </button>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 w-2 h-2 bg-blue-200 rounded-full animate-ping" />
          <div className="absolute right-1/3 bottom-1/3 w-3 h-3 bg-blue-300 rounded-full animate-ping delay-1000" />
          <div className="absolute left-2/3 top-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;