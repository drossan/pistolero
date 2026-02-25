# 🤠 EL PISTOLERO

Un juego de duelos del Viejo Oeste con estética de cartel "Wanted" del siglo XIX. Dos pistoleros se enfrentan en un duelo mortal donde la estrategia y los reflejos son clave para la victoria.

---

## 🎯 Características Principales

### 🎮 Modos de Juego

#### **VS Máquina** (100% Funcional)
- Duelo clásico contra IA con tres niveles de dificultad
- Sistema de cuenta atrás animada (¡LISTO! ¡APUNTA! ¡FUEGO!)
- Gana el primero en conseguir 3 victorias
- IA inteligente que aprende de tus patrones

#### **Multijugador Online** (✅ COMPLETADO)
- Sistema de salas con códigos de 5 letras
- Juego en tiempo real con Convex backend
- Autenticación anónima y GitHub (lista)
- Sincronización en tiempo real
- Validación anti-cheat del lado del servidor
- Leaderboard global

#### **PWA** (✅ IMPLEMENTADO)
- Instalable como app nativa
- Soporte offline completo
- Actualizaciones automáticas
- Cache inteligente

---

## ⚔️ Reglas del Duelo

El juego sigue las reglas clásicas de piedra-papel-tijera del oeste:

```
🔫 PISTOLA    gana a  🔄 RECARGA
🛡️  ESCUDO     gana a  🔫 PISTOLA
🔄 RECARGA    gana a  🛡️  ESCUDO
```

### Mecánicas Especiales

- **Balas limitadas**: Máximo 5 balas por jugador
- **Recarga estratégica**: Debes recargar para poder disparar
- **Sin balas = Sin disparos**: No puedes usar pistola sin munición
- **Timer de decisión**: 10 segundos para elegir tu acción

---

## 🎨 Diseño y Estética

### Paleta de Colores
- **Papel envejecido**: `#e8d5a3` - Fondo principal
- **Tinta negra**: `#000000` - Bordes y texto
- **Rojo sangre**: `#8B0000` - Acentos dramáticos
- **Sepia**: `#704214` - Detalles vintage

### Tipografía
- **Rye**: Títulos principales (estilo madera tallada)
- **Special Elite**: Textos secundarios (máquina de escribir antigua)

### Efectos Visuales
- Textura de papel envejecido
- Bordes rasgados y desgastados
- Sombras duras estilo impresión offset
- Animaciones lentas y secas (sin efectos modernos)

---

## 🚀 Características Implementadas

### ✅ Sistema de Juego Completo

#### **IA Avanzada con 3 Niveles**
- **Fácil**: Decisiones aleatorias, predecible
- **Normal**: Estrategia balanceada con algo de memoria
- **Difícil**: Aprende patrones, predice movimientos, juega estratégicamente

#### **Sistema de Estadísticas Persistentes**
- Partidas jugadas, ganadas y perdidas
- Rondas totales
- Tasa de victoria por dificultad
- Racha actual y mejor racha
- Almacenamiento local en el navegador

#### **Tutorial Interactivo**
- Se muestra automáticamente la primera vez
- Explicación completa de reglas y controles
- Animación paso a paso
- Opción de saltar

#### **Timer de Decisión**
- 10 segundos para elegir acción
- Barra de progreso visual (verde → rojo)
- Sonidos de tensión en los últimos 3 segundos
- Penalización: pierdes la ronda si no actúas

---

### 🎬 Animaciones y Efectos

#### **Efectos de Combate**
- ⚡ **Flash de disparo**: Destello blanco al disparar
- 💨 **Humo de pistola**: Efecto de pólvora
- 🎯 **Shake al impacto**: Pantalla tiembla cuando te disparan
- 📊 **Indicadores flotantes**: "+1 bala", "-1 bala", etc.

#### **Animaciones Finales Épicas**
- 🏆 **Victoria**: Confeti dorado, estrellas girando, cartel con ribbon
- ☠️ **Derrota**: Lápida, buitres, polvo cayendo, ambiente oscuro
- ⏱️ **4 segundos de duración** con auto-cierre

#### **Efectos de Audio**
- 🔊 Sonidos de disparos, recarga, escudo
- 🌵 Ambiente del desierto (viento)
- 🔔 Campana de victoria
- ⏰ Countdown y tensión del timer

---

### 📱 Soporte Móvil Completo

- **Vibración háptica**:
    - Ligera al tocar botones
    - Media en countdown
    - Fuerte al disparar/recibir disparo
    - Patrón especial en victoria/derrota

- **Diseño responsive**:
    - Optimizado para móviles (320px+)
    - Tablet (768px+)
    - Desktop (1024px+)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipado estático en todo el stack
- **React Router v7** - Navegación entre páginas
- **Vite 6** - Build tool ultra-rápido
- **Tailwind CSS v4** - Estilos utility-first
- **Radix UI** - Componentes UI accesibles

### Backend
- **Convex** - Backend-as-a-Service con:
  - Base de datos en tiempo real
  - Mutaciones y queries con TypeScript
  - Sincronización automática
  - Validación anti-cheat del lado del servidor
- **Convex Auth** - Autenticación (anónima + GitHub OAuth)

### PWA
- **Service Workers** - Cache y offline support
- **Workbox** - Estrategias de cache via Vite PWA plugin
- **Manifest.json** - Instalación como app nativa

### Testing
- **Vitest** - Testing framework (72 tests con 70%+ cobertura)
- **Testing Library** - Pruebas de componentes React
- **Playwright** - Tests E2E cross-browser
- **Lighthouse CI** - Validación de performance PWA

### Almacenamiento Local
- **LocalStorage** - Estadísticas y progreso local
- **SessionStorage** - Estado de tutorial
- **Convex Cloud** - Almacenamiento persistente en la nube

### Audio
- **Web Audio API** - Efectos de sonido generados proceduralmente

---

## 📁 Estructura del Proyecto

```
el-pistolero/
├── convex/                              # Backend Convex
│   ├── _generated/                      # Archivos generados por Convex
│   ├── auth/                            # Configuración de autenticación
│   ├── games/                           # Lógica de juego (mutations, queries)
│   ├── players/                         # Gestión de jugadores
│   ├── rooms/                           # Gestión de salas
│   ├── schema.ts                        # Esquema de base de datos
│   └── types.ts                         # Tipos compartidos
├── public/
│   ├── offline.html                     # Página offline para PWA
│   └── manifest.json                    # Manifiesto PWA
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── effects.tsx              # Efectos visuales (shake, flash, confeti)
│   │   │   ├── game-over-animation.tsx  # Animaciones victoria/derrota
│   │   │   ├── home.tsx                 # Pantalla principal
│   │   │   ├── icons.tsx                # Iconos personalizados
│   │   │   ├── leaderboard.tsx          # Tabla de clasificación global
│   │   │   ├── login-modal.tsx          # Modal de autenticación
│   │   │   ├── multiplayer-game-phases.tsx # Componentes de fases del juego
│   │   │   ├── multiplayer.tsx          # Modo multijugador completo
│   │   │   ├── sounds.ts                # Sistema de sonidos
│   │   │   ├── stats-modal.tsx          # Modal de estadísticas
│   │   │   ├── tutorial.tsx             # Tutorial interactivo
│   │   │   ├── update-banner.tsx        # Banner de actualización PWA
│   │   │   ├── vs-machine.tsx           # Modo VS Máquina
│   │   │   └── ui/                      # Componentes UI reutilizables (Radix)
│   │   ├── hooks/
│   │   │   └── use-multiplayer-game.ts  # Hook personalizado para lógica multijugador
│   │   ├── utils/
│   │   │   ├── ai.ts                    # Motor de IA
│   │   │   ├── haptics.ts               # Vibración móvil
│   │   │   ├── stats.ts                 # Sistema de estadísticas
│   │   │   └── tutorial.ts              # Gestión de tutorial
│   │   ├── App.tsx                      # Componente raíz
│   │   └── routes.ts                    # Configuración de rutas
│   └── styles/
│       ├── fonts.css                    # Importación de fuentes
│       ├── theme.css                    # Variables y animaciones
│       ├── tailwind.css                 # Configuración Tailwind
│       └── index.css                    # Estilos globales
├── tests/
│   ├── e2e/                             # Pruebas E2E con Playwright
│   │   ├── multiplayer.spec.ts          # Tests de flujo multijugador
│   │   └── setup.spec.ts                # Tests de configuración básica
│   ├── pwa/                              # Tests PWA
│   │   ├── performance.test.ts          # Tests de rendimiento
│   │   └── pwa.test.ts                  # Tests PWA (service worker, manifest)
│   ├── setup.ts                         # Configuración de tests
│   └── unit/
│       └── game-logic.test.ts           # Tests de lógica de juego
├── .env.local                           # Variables de entorno (local)
├── convex.config.ts                     # Configuración de Convex
├── DEPLOYMENT.md                        # Guía de despliegue
├── package.json
├── playwright.config.ts                 # Configuración de Playwright
├── vite.config.ts
├── vitest.config.ts                     # Configuración de Vitest
└── README.md
```

---

## 🎮 Cómo Jugar

### Inicio del Juego
1. Selecciona **VS Máquina** o **Multijugador Online**
2. Elige la dificultad (Fácil, Normal, Difícil)
3. Haz clic en **INICIAR RONDA**

### Durante el Duelo
1. Espera el countdown: **¡LISTO! ¡APUNTA! ¡FUEGO!**
2. Tienes **10 segundos** para elegir tu acción:
    - 🔫 **PISTOLA**: Dispara (requiere balas)
    - 🛡️ **ESCUDO**: Bloquea disparos
    - 🔄 **RECARGA**: Añade 1 bala (máx. 5)
3. Repite hasta que alguien gane 3 rondas

### Consejos Estratégicos
- 💡 Recarga cuando tu oponente use escudo
- 💡 Usa escudo si crees que te van a disparar
- 💡 En dificultad Alta, la IA detecta patrones
- 💡 No dejes que se acabe el tiempo

---

## 📊 Sistema de Estadísticas

El juego registra automáticamente:
- **Partidas totales**, ganadas y perdidas
- **Rondas totales** jugadas
- **Tasa de victoria** global
- **Estadísticas por dificultad**
- **Rachas** actual y mejor

Accede a tus estadísticas desde el botón 📊 en la pantalla principal.

---

## 🔧 Instalación y Desarrollo

### Requisitos
- Node.js 18+
- npm o pnpm

### Instalación
```bash
# Instalar dependencias
npm install

# Modo desarrollo (frontend + backend)
npm run dev

# Desarrollo con backend Convex
npx convex dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Ejecutar tests
npm test              # Unit tests con Vitest
npm run test:e2e      # Tests E2E con Playwright
```

### Variables de Entorno
Para el modo multijugador, necesitas configurar las variables de entorno de Convex:

```env
# Convex (se genera automáticamente con `npx convex dev` o `npx convex deploy`)
CONVEX_DEPLOYMENT_URL=https://western-pistolero-game.convex.cloud
VITE_CONVEX_URL=https://western-pistolero-game.convex.cloud
```

**Nota**: Las URLs de Convex se obtienen al ejecutar:
```bash
npx convex dev      # Desarrollo
npx convex deploy   # Producción
```

---

## 🚧 Mejoras Futuras (Opcionales)

### 🟡 Mejoras de Juego
- [ ] Música de fondo opcional
- [ ] Modos de juego adicionales (mejor de 5, etc.)
- [ ] Sistema de logros y medallas
- [ ] Más efectos de sonido y animaciones

### 🟢 Características Adicionales
- [ ] Chat en partidas multijugador
- [ ] Avatar personalizable
- [ ] Replay de partidas
- [ ] Compartir en redes sociales
- [ ] Temas alternativos
- [ ] Internacionalización (i18n)

---

## 📝 Notas del Desarrollador

### Decisiones de Diseño

**¿Por qué Convex en lugar de Supabase?**
Convex ofrece varias ventajas para este proyecto:
- TypeScript nativo en todo el stack (frontend y backend)
- Sincronización en tiempo real más simple con queries reactivas
- Validación anti-cheat del lado del servidor más sencilla
- Menor boilerplate y mejor DX (Developer Experience)
- Deploy integrado sin necesidad de configurar funciones edge separadas

**¿Por qué PWA?**
Permite que el juego se instale como app nativa en móviles y desktop:
- Funciona offline con service workers
- Notificaciones de actualizaciones
- Mejor performance con cache estratégico
- Experiencia más inmersiva (full screen)

**¿Por qué Tailwind v4?**
Ofrece mejor performance y DX que v3, con CSS variables nativas y mejor tree-shaking.

**¿Por qué las animaciones son "lentas"?**
Para mantener la estética vintage del Viejo Oeste. Los efectos modernos (smooth, fluidos) no encajan con la estética de cartel impreso.

---

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas:

1. Abre un Issue describiendo tu idea
2. Fork el proyecto
3. Crea una rama con tu feature
4. Haz Pull Request

---

## 📜 Licencia

Este proyecto es de código abierto bajo licencia MIT.

---

## 🎩 Créditos

### Fuentes
- **Rye** - Google Fonts
- **Special Elite** - Google Fonts

### Inspiración
- Carteles "Wanted" del Viejo Oeste (1850-1900)
- Diseño de impresión vintage
- Películas western clásicas

### Audio
- Sonidos generados mediante Web Audio API
- Efectos procesados para sonar "vintage"

---

## 🐛 Problemas Conocidos

- En algunos navegadores antiguos, los sonidos pueden no funcionar
- La vibración háptica solo funciona en móviles compatibles
- El modo multijugador requiere conexión a internet para sincronizarse con Convex
- Las estadísticas del modo multijugador solo se guardan en la nube (requieren backend activo)

---

## 📞 Contacto

¿Preguntas, bugs o sugerencias?
Abre un Issue en el repositorio.

---

<div align="center">

**🤠 ¡Que gane el pistolero más rápido! 🔫**

*Made with ❤️ and ☕ in the Wild West*

</div>
