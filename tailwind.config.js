module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'bg-red-700', 'bg-blue-600', 'bg-gray-400', 
    'hover:bg-blue-400', 'w-6', 'h-6', 
    'sm:w-7', 'sm:h-7', 'md:w-8', 'md:h-8'
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
