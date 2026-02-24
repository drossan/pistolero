// Pistola estilo revólver western
export function PistolaIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cañón */}
      <rect x="15" y="42" width="45" height="8" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
      {/* Tambor */}
      <circle cx="50" cy="46" r="12" fill="#2d2d2d" stroke="#000" strokeWidth="2"/>
      <circle cx="50" cy="46" r="8" fill="#1a1a1a" stroke="#000" strokeWidth="1.5"/>
      {/* Agujeros del tambor */}
      <circle cx="47" cy="42" r="2" fill="#000"/>
      <circle cx="53" cy="42" r="2" fill="#000"/>
      <circle cx="50" cy="50" r="2" fill="#000"/>
      {/* Empuñadura */}
      <path d="M 50 52 L 48 58 L 46 65 L 48 72 L 52 72 L 56 68 L 58 60 L 54 52 Z" 
            fill="#8B4513" stroke="#000" strokeWidth="2"/>
      {/* Detalles empuñadura */}
      <line x1="49" y1="60" x2="51" y2="60" stroke="#654321" strokeWidth="1"/>
      <line x1="49" y1="64" x2="51" y2="64" stroke="#654321" strokeWidth="1"/>
      <line x1="49" y1="68" x2="51" y2="68" stroke="#654321" strokeWidth="1"/>
      {/* Gatillo */}
      <path d="M 54 52 L 56 54 L 54 56 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1.5"/>
      {/* Martillo */}
      <rect x="44" y="38" width="4" height="6" fill="#1a1a1a" stroke="#000" strokeWidth="1.5"/>
      <rect x="44" y="36" width="4" height="3" fill="#2d2d2d" stroke="#000" strokeWidth="1.5"/>
    </svg>
  );
}

// Escudo estilo badge de sheriff
export function EscudoIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Estrella de sheriff */}
      <path d="M 50 20 L 55 40 L 75 40 L 60 52 L 65 72 L 50 60 L 35 72 L 40 52 L 25 40 L 45 40 Z" 
            fill="#C0C0C0" stroke="#000" strokeWidth="3"/>
      {/* Brillo metálico */}
      <path d="M 50 20 L 53 35 L 68 35 L 56 44 Z" 
            fill="#E8E8E8" opacity="0.5"/>
      {/* Círculo central */}
      <circle cx="50" cy="50" r="15" fill="#DAA520" stroke="#000" strokeWidth="2.5"/>
      {/* Texto SHERIFF */}
      <text x="50" y="53" 
            fontSize="10" 
            fontFamily="serif" 
            fontWeight="bold"
            textAnchor="middle" 
            fill="#000">
        SHERIFF
      </text>
    </svg>
  );
}

// Balas para recargar
export function RecargaIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bala 1 */}
      <g transform="translate(20, 30)">
        <rect x="0" y="10" width="12" height="25" fill="#8B4513" stroke="#000" strokeWidth="2"/>
        <ellipse cx="6" cy="10" rx="6" ry="4" fill="#DAA520" stroke="#000" strokeWidth="2"/>
        <line x1="4" y1="15" x2="4" y2="30" stroke="#654321" strokeWidth="1"/>
        <line x1="8" y1="15" x2="8" y2="30" stroke="#654321" strokeWidth="1"/>
      </g>
      
      {/* Bala 2 */}
      <g transform="translate(38, 25)">
        <rect x="0" y="10" width="12" height="25" fill="#8B4513" stroke="#000" strokeWidth="2"/>
        <ellipse cx="6" cy="10" rx="6" ry="4" fill="#DAA520" stroke="#000" strokeWidth="2"/>
        <line x1="4" y1="15" x2="4" y2="30" stroke="#654321" strokeWidth="1"/>
        <line x1="8" y1="15" x2="8" y2="30" stroke="#654321" strokeWidth="1"/>
      </g>
      
      {/* Bala 3 */}
      <g transform="translate(56, 30)">
        <rect x="0" y="10" width="12" height="25" fill="#8B4513" stroke="#000" strokeWidth="2"/>
        <ellipse cx="6" cy="10" rx="6" ry="4" fill="#DAA520" stroke="#000" strokeWidth="2"/>
        <line x1="4" y1="15" x2="4" y2="30" stroke="#654321" strokeWidth="1"/>
        <line x1="8" y1="15" x2="8" y2="30" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Flechas circulares de recarga */}
      <path d="M 75 45 A 10 10 0 1 1 75 55" 
            stroke="#000" 
            strokeWidth="3" 
            fill="none"
            markerEnd="url(#arrowhead)"/>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <polygon points="0 0, 10 5, 0 10" fill="#000"/>
        </marker>
      </defs>
    </svg>
  );
}

// Icono de bala individual para el contador
export function BalaIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 40" className="w-3 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect 
        x="4" 
        y="10" 
        width="12" 
        height="25" 
        fill={filled ? "#8B4513" : "#e8d5a3"} 
        stroke="#000" 
        strokeWidth="2"
      />
      <ellipse 
        cx="10" 
        cy="10" 
        rx="6" 
        ry="4" 
        fill={filled ? "#DAA520" : "#d4c5a0"} 
        stroke="#000" 
        strokeWidth="2"
      />
      {filled && (
        <>
          <line x1="8" y1="15" x2="8" y2="30" stroke="#654321" strokeWidth="1"/>
          <line x1="12" y1="15" x2="12" y2="30" stroke="#654321" strokeWidth="1"/>
        </>
      )}
      {!filled && (
        <line x1="6" y1="12" x2="14" y2="33" stroke="#000" strokeWidth="2"/>
      )}
    </svg>
  );
}
