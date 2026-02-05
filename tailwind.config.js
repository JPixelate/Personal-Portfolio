/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // Standard path for modern React projects (Vite, etc.)
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Custom font class for Hanken Grotesk
        hanken: ['"Hanken Grotesk"', 'sans-serif'],
        // Custom font class for Inter
        inter: ['"Inter"', 'sans-serif'],
      },
      // 1. Define the Animation Utilities
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        drop: "drop 2s infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-down": "fade-in-down 0.8s ease-out forwards",
        "fade-in-left": "fade-in-left 0.8s ease-out forwards",
        "fade-in-right": "fade-in-right 0.8s ease-out forwards",
        "scale-in": "scale-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.7s ease-out forwards",
        // Micro-movement floating animations (different speeds for irregularity)
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 5s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "float-x": "float-x 8s ease-in-out infinite",
        "float-diagonal": "float-diagonal 10s ease-in-out infinite",
        // Bounce and elastic effects
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        // Glow and pulse effects
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glow-pulse-slow": "glow-pulse 4s ease-in-out infinite",
        // Rotation effects
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 20s linear infinite",
        "rotate-slow": "rotate-slow 10s linear infinite",
        // Reveal animations
        "reveal-up": "reveal-up 0.8s ease-out forwards",
        "reveal-down": "reveal-down 0.8s ease-out forwards",
        // Stagger delays (use with animation-delay)
        "stagger-1": "fade-in-up 0.8s ease-out 0.1s forwards",
        "stagger-2": "fade-in-up 0.8s ease-out 0.2s forwards",
        "stagger-3": "fade-in-up 0.8s ease-out 0.3s forwards",
        "stagger-4": "fade-in-up 0.8s ease-out 0.4s forwards",
        // Award-winning effects
        "gradient-shift": "gradient-shift 8s ease infinite",
        "border-flow": "border-flow 3s linear infinite",
        "text-shimmer": "text-shimmer 3s linear infinite",
        "morph": "morph 8s ease-in-out infinite",
        "float-3d": "float-3d 6s ease-in-out infinite",
      },
      // 2. Define the Keyframes
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        drop: {
          "0%": { top: "-50%" },
          "100%": { top: "100%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-x": {
          "0%, 100%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(10px)" },
        },
        "float-diagonal": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "25%": { transform: "translate(10px, -10px)" },
          "50%": { transform: "translate(0px, -20px)" },
          "75%": { transform: "translate(-10px, -10px)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            opacity: "1",
            filter: "drop-shadow(0 0 8px currentColor)"
          },
          "50%": { 
            opacity: "0.8",
            filter: "drop-shadow(0 0 20px currentColor)"
          },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "reveal-up": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(40px)",
            clipPath: "inset(100% 0 0 0)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)",
            clipPath: "inset(0 0 0 0)"
          },
        },
        "reveal-down": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(-40px)",
            clipPath: "inset(0 0 100% 0)"
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)",
            clipPath: "inset(0 0 0 0)"
          },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
        "float-3d": {
          "0%, 100%": { 
            transform: "translateY(0px) rotateX(0deg) rotateY(0deg)" 
          },
          "33%": { 
            transform: "translateY(-10px) rotateX(5deg) rotateY(5deg)" 
          },
          "66%": { 
            transform: "translateY(-5px) rotateX(-5deg) rotateY(-5deg)" 
          },
        },
      },
      // Add custom utilities
      backgroundSize: {
        '200': '200%',
        '300': '300%',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
};