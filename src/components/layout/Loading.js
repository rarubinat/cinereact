import React from "react";

// Loading component → shows a full-screen spinner while something is loading
const Loading = () => (
  // This <div> is a fullscreen overlay
  // - "fixed inset-0" → makes it cover the whole screen
  // - "flex items-center justify-center" → centers the content horizontally & vertically
  // - "bg-white text-black" → white background with black elements
  // - "font-sans" → uses a sans-serif font
  // - "z-50" → ensures it stays above all other elements
  <div className="fixed inset-0 flex items-center justify-center bg-white text-black font-sans z-50">

    {/* The spinner is an SVG (scalable vector graphic) */}
    <svg
      // "w-12 h-12" → makes the spinner 48x48 pixels
      // "text-black" → gives it black color
      // "animate-spin" → makes it rotate continuously (Tailwind CSS animation)
      className="w-12 h-12 text-black animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"   // No fill color by default
      viewBox="0 0 24 24" // Viewbox defines the canvas of the SVG
    >

      {/* Background circle of the spinner */}
      <circle
        // "opacity-25" → makes it semi-transparent
        cx="12"  // x-position center
        cy="12"  // y-position center
        r="10"   // radius of 10
        stroke="currentColor" // uses current text color (black)
        strokeWidth="4"       // line thickness
      ></circle>

      {/* Foreground path (the rotating part of the spinner) */}
      <path
        // "opacity-75" → a bit more visible than the background circle
        fill="currentColor" // filled with black
        // "d" attribute defines the shape (arc-like slice of the circle)
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </div>
);

// Export so it can be used in other parts of the app
export default Loading;
