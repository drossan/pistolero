// Componente de tutorial interactivo

import { useState, useEffect } from "react";
import { PistolaIcon, EscudoIcon, RecargaIcon } from "./icons";

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "BIENVENIDO, FORASTERO",
      content: "Este es un duelo de pistoleros. Aprende las reglas para sobrevivir.",
      icon: null,
    },
    {
      title: "PISTOLA",
      content: "Dispara a tu oponente. Vence a RECARGA. Pero necesitas balas para disparar.",
      icon: <PistolaIcon className="w-20 h-20" />,
    },
    {
      title: "ESCUDO",
      content: "Protégete del disparo. Vence a PISTOLA. Pero es vulnerable a RECARGA.",
      icon: <EscudoIcon className="w-20 h-20" />,
    },
    {
      title: "RECARGA",
      content: "Añade 1 bala a tu revólver (máx. 5). Vence a ESCUDO. Pero es vulnerable a PISTOLA.",
      icon: <RecargaIcon className="w-20 h-20" />,
    },
    {
      title: "EL DUELO",
      content: "Empiezas con 0 balas. Debes recargar antes de poder disparar. El primero en ganar 3 rondas gana el duelo.",
      icon: null,
    },
    {
      title: "¡LISTO!",
      content: "Ahora estás preparado para el duelo. ¡Que gane el más rápido!",
      icon: null,
    },
  ];

  const currentStep = steps[step];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        nextStep();
      } else if (e.key === "Escape") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-zoom-in">
      <div className="max-w-2xl w-full">
        <div className="border-4 sm:border-6 border-black bg-[#e8d5a3] p-6 sm:p-10 shadow-[8px_8px_0px_rgba(0,0,0,1)] paper-texture">
          {/* Header */}
          <div className="border-3 border-black p-3 sm:p-4 mb-6 bg-[#d4c5a0]">
            <h2 
              className="text-center text-2xl sm:text-4xl tracking-wide"
              style={{ fontFamily: "'Rye', serif" }}
            >
              {currentStep.title}
            </h2>
          </div>

          {/* Icono */}
          {currentStep.icon && (
            <div className="flex justify-center mb-6">
              {currentStep.icon}
            </div>
          )}

          {/* Contenido */}
          <div className="mb-8">
            <p 
              className="text-center text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              {currentStep.content}
            </p>
          </div>

          {/* Indicador de paso */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 border-2 border-black ${
                  i === step ? "bg-black" : "bg-[#e8d5a3]"
                }`}
              />
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 border-3 border-black bg-[#d4c5a0] p-3 sm:p-4 text-base sm:text-lg hover:bg-[#c4b590] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              SALTAR
            </button>
            <button
              onClick={nextStep}
              className="flex-1 border-3 border-black bg-[#e8d5a3] p-3 sm:p-4 text-base sm:text-lg hover:bg-[#d4c5a0] active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Rye', serif" }}
            >
              {step === steps.length - 1 ? "¡AL DUELO!" : "SIGUIENTE"}
            </button>
          </div>

          {/* Ayuda de teclado */}
          <div className="mt-4 text-center">
            <p 
              className="text-xs text-gray-600"
              style={{ fontFamily: "'Special Elite', monospace" }}
            >
              Enter para continuar • Esc para saltar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
