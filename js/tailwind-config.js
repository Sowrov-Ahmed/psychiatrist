/*!
 * js/tailwind-config.js — SHARED CORE (identical for every member; never edit)
 * Design system "CONCRETE SIGNAL": Brutalist + Premium. Hard edges, thick ink borders, solid offset shadows,
 * flat colour blocks, heavy expanded grotesk type, mono labels, scroll-driven parallax, stepped (hard-cut) motion.
 * Tailwind configuration only (tokens, keyframes, animations). It is not custom CSS.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        concrete: { DEFAULT: '#D8D6CF', 100: '#ECEBE6', 300: '#C4C2BA', 500: '#9E9C94' },
        ultra: { DEFAULT: '#2A3BFF', 700: '#1B28C9', 300: '#8F99FF' },
        lime: { DEFAULT: '#CCFF00', 600: '#A8D400' },
        tang: { DEFAULT: '#FF6A13', 300: '#FFB27F' },
        lilac: { DEFAULT: '#BDA6FF', 300: '#DCCFFF' },
        alert: '#E5002B'
      },
      fontFamily: {
        display: ['Archivo', 'Arial Black', 'Impact', 'sans-serif'],
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'Courier New', 'monospace']
      },
      borderRadius: { none: '0px' },
      boxShadow: {
        hard: '8px 8px 0 0 #0A0A0A', 'hard-sm': '4px 4px 0 0 #0A0A0A', 'hard-lg': '14px 14px 0 0 #0A0A0A',
        'hard-lime': '8px 8px 0 0 #CCFF00', 'hard-white': '8px 8px 0 0 #FFFFFF', 'hard-ultra': '8px 8px 0 0 #2A3BFF', 'hard-tang': '8px 8px 0 0 #FF6A13'
      },
      backgroundImage: {
        'grad-dusk': 'linear-gradient(180deg,#2A3BFF 0%,#BDA6FF 58%,#FFB27F 100%)',
        'grad-sunrise': 'linear-gradient(135deg,#CCFF00 0%,#FFB27F 55%,#BDA6FF 100%)',
        'grad-night': 'linear-gradient(180deg,#0A0A0A 0%,#1B28C9 140%)',
        'grad-bands': 'linear-gradient(100deg,#2A3BFF 0 34%,#BDA6FF 34% 62%,#CCFF00 62% 100%)',
        'grad-text': 'linear-gradient(90deg,#2A3BFF,#BDA6FF 50%,#FF6A13)',
        'halftone': 'radial-gradient(#0A0A0A 22%,transparent 24%)',
        'halftone-light': 'radial-gradient(rgba(255,255,255,.55) 22%,transparent 24%)',
        'hatch': 'repeating-linear-gradient(45deg,#0A0A0A 0 2px,transparent 2px 10px)',
        'checker': 'conic-gradient(#0A0A0A 25%,transparent 0 50%,#0A0A0A 0 75%,transparent 0)',
        'grid-ink': 'linear-gradient(#0A0A0A22 1px,transparent 1px),linear-gradient(90deg,#0A0A0A22 1px,transparent 1px)',
        'grid-white': 'linear-gradient(#ffffff22 1px,transparent 1px),linear-gradient(90deg,#ffffff22 1px,transparent 1px)'
      },
      keyframes: {
        slam: { '0%': { opacity: '0', transform: 'translateY(70px)' }, '60%': { opacity: '1', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        wipeRight: { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0 0 0)' } },
        wipeUp: { from: { clipPath: 'inset(100% 0 0 0)' }, to: { clipPath: 'inset(0 0 0 0)' } },
        stamp: { '0%': { opacity: '0', transform: 'scale(1.6) rotate(-6deg)' }, '60%': { opacity: '1', transform: 'scale(.96) rotate(1deg)' }, '100%': { opacity: '1', transform: 'scale(1) rotate(0)' } },
        cut: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(-80px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(80px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        tickerRev: { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        jitter: { '0%,100%': { transform: 'translate(0,0)' }, '25%': { transform: 'translate(-2px,1px)' }, '50%': { transform: 'translate(2px,-1px)' }, '75%': { transform: 'translate(-1px,-2px)' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        spinStep: { to: { transform: 'rotate(360deg)' } },
        hop: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
        draw: { to: { strokeDashoffset: '0' } }
      },
      animation: {
        'slam': 'slam .7s cubic-bezier(.2,.9,.3,1.2) both',
        'wipe-right': 'wipeRight .8s cubic-bezier(.77,0,.18,1) both',
        'wipe-up': 'wipeUp .8s cubic-bezier(.77,0,.18,1) both',
        'stamp': 'stamp .55s cubic-bezier(.2,.9,.3,1.3) both',
        'cut': 'cut .35s steps(3,end) both',
        'slide-left': 'slideLeft .7s cubic-bezier(.2,.9,.3,1) both',
        'slide-right': 'slideRight .7s cubic-bezier(.2,.9,.3,1) both',
        'ticker': 'ticker 32s linear infinite',
        'ticker-fast': 'ticker 16s linear infinite',
        'ticker-rev': 'tickerRev 36s linear infinite',
        'blink': 'blink 1s steps(1,end) infinite',
        'jitter': 'jitter .35s steps(2,end) infinite',
        'gradient-shift': 'gradientShift 9s ease-in-out infinite',
        'spin-step': 'spinStep 12s steps(24,end) infinite',
        'hop': 'hop 2.4s steps(6,end) infinite',
        'draw': 'draw 2s ease-out forwards'
      }
    }
  }
};
