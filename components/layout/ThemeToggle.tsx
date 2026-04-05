'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Return a placeholder of the exact same size to prevent layout shift
    return <div className="w-[86px] h-[32px]" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className="relative flex items-center w-[86px] h-[32px] rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-[#e4e5e7] dark:bg-[#252836] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_4px_6px_rgba(0,0,0,0.4)]"
    >
      {/* Background Text Container */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none w-full">
        <span 
          className={`text-[8px] font-black leading-tight tracking-widest text-[#666977] transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        >
          DARK<br/>MODE
        </span>
        <span 
          className={`text-[8px] font-black leading-tight tracking-widest text-[#a3a5ae] transition-opacity duration-300 text-right ${isDark ? 'opacity-0' : 'opacity-100'}`}
        >
          LIGHT<br/>MODE
        </span>
      </div>

      {/* Draggable/Animated Knob */}
      <div
        className={`relative flex items-center justify-center w-[24px] h-[24px] rounded-full transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-10
                    ${isDark 
                      ? 'translate-x-[54px] bg-gradient-to-b from-[#4A4D5C] to-[#343746] shadow-[0_4px_6px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'translate-x-0 bg-gradient-to-b from-[#ffffff] to-[#f4f5f7] shadow-[0_4px_6px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,1)]'
                    }
        `}
      >
        {isDark ? (
          <Moon size={12} className="text-[#a8aabc] fill-transparent" strokeWidth={2.5} />
        ) : (
          <Sun size={12} className="text-[#a3a5ae] fill-transparent" strokeWidth={2.5} />
        )}
      </div>
    </button>
  );
}
