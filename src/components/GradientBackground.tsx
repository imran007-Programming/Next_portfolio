"use client";

import { useColor } from "@/context/ColorContext";

export function GradientBackground() {
  const { theme } = useColor();

  return (
    <div className="gradient-bg">
      {/* Gradient layers */}
      <div 
        className="gradient-layer-dynamic" 
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at 50% -20%, 
              ${theme.gradient.primary} 0%, 
              transparent 50%
            ),
            radial-gradient(
              ellipse 60% 50% at 0% 50%, 
              ${theme.gradient.secondary} 0%, 
              transparent 50%
            ),
            radial-gradient(
              ellipse 60% 50% at 100% 50%, 
              ${theme.gradient.secondary} 0%, 
              transparent 50%
            ),
            radial-gradient(
              ellipse 100% 80% at 50% 100%, 
              ${theme.gradient.tertiary} 0%, 
              transparent 60%
            )
          `
        }}
      />
      
      {/* Grain texture overlay */}
      <div 
        aria-hidden="true" 
        className="grain-overlay"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
              numOctaves={4} 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05"/>
        </svg>
      </div>
    </div>
  );
}
