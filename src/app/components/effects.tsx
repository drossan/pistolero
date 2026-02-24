// Componente de indicador flotante para feedback visual

import { useEffect, useState } from "react";

interface FloatingIndicatorProps {
  text: string;
  type: "bullet-add" | "bullet-remove" | "hit" | "miss";
  show: boolean;
  onComplete: () => void;
}

export function FloatingIndicator({ text, type, show, onComplete }: FloatingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 300);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getColor = () => {
    switch (type) {
      case "bullet-add": return "text-green-800";
      case "bullet-remove": return "text-red-800";
      case "hit": return "text-red-900";
      case "miss": return "text-gray-600";
      default: return "";
    }
  };

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  pointer-events-none z-50 animate-float ${getColor()}`}
      style={{
        fontFamily: "'Rye', serif",
        fontSize: "2rem",
        textShadow: "2px 2px 0px rgba(0,0,0,0.3)",
        animation: "float 0.8s ease-out forwards"
      }}
    >
      {text}
    </div>
  );
}

// Componente de efecto de temblor (shake)
export function ShakeWrapper({ 
  children, 
  shake 
}: { 
  children: React.ReactNode; 
  shake: boolean;
}) {
  return (
    <div className={shake ? "animate-shake" : ""}>
      {children}
    </div>
  );
}

// Componente de flash de disparo
export function MuzzleFlash({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 animate-flash">
      <div className="absolute inset-0 bg-orange-300 opacity-30" />
      {/* Humo SVG */}
      <svg 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-40"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="#888" className="animate-smoke" />
        <circle cx="45" cy="45" r="30" fill="#999" className="animate-smoke" style={{ animationDelay: "0.1s" }} />
        <circle cx="55" cy="55" r="25" fill="#aaa" className="animate-smoke" style={{ animationDelay: "0.2s" }} />
      </svg>
    </div>
  );
}

// Componente de confeti vintage
export function VintageConfetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        >
          <div
            className="w-2 h-4 bg-red-800 border border-black"
            style={{
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        </div>
      ))}
    </div>
  );
}
