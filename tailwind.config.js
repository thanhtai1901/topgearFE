// @type {import('tailwindcss').Config}
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green": "#3B82F6",
      },
      fontFamily: {
        "primary": ["Inter", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: ["light"], 
    darkTheme: "light",
  },
  plugins: [daisyui],  // Changed require to import
};
