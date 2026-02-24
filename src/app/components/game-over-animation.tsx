// Animaciones finales de victoria y derrota

import { useEffect, useState } from "react";
import { EscudoIcon } from "./icons";

interface GameOverAnimationProps {
  type: "victory" | "defeat";
  onComplete?: () => void;
}

export function GameOverAnimation({ type, onComplete }: GameOverAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  if (type === "victory") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-zoom-in">
        {/* Confeti dorado */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${1.5 + Math.random()}s`
              }}
            >
              <div
                className={`w-3 h-3 ${
                  i % 3 === 0 ? "bg-yellow-500" : i % 3 === 1 ? "bg-yellow-600" : "bg-red-800"
                } border border-black`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>

        {/* Estrellas de sheriff girando */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-spin-slow"
              style={{
                left: `${15 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 70}%`,
                animationDuration: "3s",
                animationDelay: `${i * 0.2}s`
              }}
            >
              <EscudoIcon className="w-12 h-12 text-yellow-500 opacity-60" />
            </div>
          ))}
        </div>

        {/* Cartel principal */}
        <div className="relative z-10 max-w-2xl w-full mx-4">
          <div className="border-8 border-yellow-600 bg-[#e8d5a3] p-8 sm:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] paper-texture animate-bounce-slow">
            {/* Ribbon superior */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4">
              <div className="bg-yellow-600 border-4 border-black px-6 py-2 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <p 
                  className="text-sm sm:text-base"
                  style={{ fontFamily: "'Special Elite', monospace" }}
                >
                  ★ CAMPEÓN DEL OESTE ★
                </p>
              </div>
            </div>

            {/* Título principal */}
            <div className="border-4 border-black p-6 mb-6 bg-yellow-100 animate-pulse-slow">
              <h2 
                className="text-center text-5xl sm:text-7xl tracking-wider text-yellow-800"
                style={{ 
                  fontFamily: "'Rye', serif",
                  textShadow: "4px 4px 0px rgba(0,0,0,0.3)"
                }}
              >
                ¡VICTORIA!
              </h2>
            </div>

            {/* Mensaje */}
            <div className="text-center mb-6">
              <p 
                className="text-xl sm:text-2xl mb-3"
                style={{ fontFamily: "'Rye', serif" }}
              >
                HAS GANADO EL DUELO
              </p>
              <p 
                className="text-sm sm:text-base"
                style={{ fontFamily: "'Special Elite', monospace" }}
              >
                Eres el pistolero más rápido del Oeste
              </p>
            </div>

            {/* Estrellas decorativas */}
            <div className="flex justify-center gap-4 text-4xl sm:text-5xl">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>⭐</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>⭐</span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>⭐</span>
            </div>

            {/* Decoración inferior */}
            <div className="mt-6 pt-6 border-t-4 border-black">
              <p 
                className="text-center text-xs tracking-widest"
                style={{ fontFamily: "'Special Elite', monospace" }}
              >
                RECOMPENSA: $1000 • HÉROE LOCAL
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Derrota
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center z-50 animate-fade-in">
      {/* Polvo cayendo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-20px",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-gray-600 rounded-full opacity-40" />
          </div>
        ))}
      </div>

      {/* Sombras de buitres */}
      <div className="absolute top-10 left-0 right-0 flex justify-around opacity-20">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="animate-sway"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Cartel principal */}
      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="border-8 border-gray-800 bg-[#3a3a3a] p-8 sm:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-shake-slow">
          {/* Ribbon superior */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4">
            <div className="bg-red-900 border-4 border-black px-6 py-2 text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <p 
                className="text-sm sm:text-base text-[#e8d5a3]"
                style={{ fontFamily: "'Special Elite', monospace" }}
              >
                ☠ FUERA DE COMBATE ☠
              </p>
            </div>
          </div>

          {/* Lápida */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg 
                className="w-32 h-32 sm:w-40 sm:h-40 text-gray-700 animate-fade-in" 
                viewBox="0 0 100 120"
                fill="currentColor"
              >
                {/* Lápida */}
                <path d="M20 30 Q20 10 50 10 Q80 10 80 30 L80 110 Q80 115 75 115 L25 115 Q20 115 20 110 Z" 
                      stroke="black" 
                      strokeWidth="2" />
                {/* Cruz */}
                <rect x="45" y="40" width="10" height="40" fill="#4a4a4a" stroke="black" strokeWidth="1" />
                <rect x="35" y="50" width="30" height="10" fill="#4a4a4a" stroke="black" strokeWidth="1" />
                {/* RIP */}
                <text x="50" y="95" fontSize="16" fontFamily="'Rye', serif" fill="black" textAnchor="middle">
                  RIP
                </text>
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <div className="border-4 border-gray-700 p-6 mb-6 bg-gray-800">
            <h2 
              className="text-center text-5xl sm:text-7xl tracking-wider text-red-800"
              style={{ 
                fontFamily: "'Rye', serif",
                textShadow: "4px 4px 0px rgba(0,0,0,0.5)"
              }}
            >
              DERROTA
            </h2>
          </div>

          {/* Mensaje */}
          <div className="text-center mb-6">
            <p 
              className="text-xl sm:text-2xl mb-3 text-[#e8d5a3]"
              style={{ fontFamily: "'Rye', serif" }}
            >
              HAS CAÍDO EN EL DUELO
            </p>
            <p 
              className="text-sm sm:text-base text-gray-400"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              La máquina fue más rápida al gatillo
            </p>
          </div>

          {/* Calaveras decorativas */}
          <div className="flex justify-center gap-6 text-3xl sm:text-4xl opacity-50">
            <span>☠️</span>
            <span>☠️</span>
            <span>☠️</span>
          </div>

          {/* Decoración inferior */}
          <div className="mt-6 pt-6 border-t-4 border-gray-700">
            <p 
              className="text-center text-xs tracking-widest text-gray-500"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              AQUÍ YACE UN PISTOLERO • 1800-1899
            </p>
          </div>
        </div>
      </div>

      {/* Vignette oscuro */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)"
           }}
      />
    </div>
  );
}
