module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'bg-red-700', 'bg-blue-600', 'bg-gray-400', 
    'hover:bg-blue-400', 'w-6', 'h-6', 'sm:w-7', 'sm:h-7', 'md:w-8', 'md:h-8'
  ],
  theme: { extend: {} },
  plugins: [],
};
