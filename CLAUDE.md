# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Western Pistolero Game is a Western-themed reaction game built with React and Vite. The game implements a rock-paper-scissors style mechanic where players choose between PISTOLA (gun), ESCUDO (shield), or RECARGA (reload) to duel against an AI opponent or another player.

**Key Game Mechanics:**
- Players start with 0 bullets and must reload before shooting
- Reloading adds 1 bullet (maximum 5 bullets)
- PISTOLA beats RECARGA, ESCUDO beats PISTOLA, RECARGA beats ESCUDO
- First to 3 round wins takes the duel
- 10-second timer per round (timeout = automatic loss)

## Development Commands

### Essential Commands
```bash
npm i                    # Install dependencies
npm run dev             # Start development server (Vite)
npm run build           # Build for production
```

**No tests or linting configured** - This project focuses on frontend development without automated testing infrastructure.

## Architecture

### Technology Stack
- **Build Tool**: Vite 6.x with React plugin
- **Styling**: Tailwind CSS 4.x (Vite plugin) + custom CSS for Western theme
- **UI Framework**: Radix UI primitives (dialogs, dropdowns, etc.) + Material-UI icons
- **Routing**: React Router v7
- **State Management**: React hooks (useState, useEffect)
- **Audio**: Web Audio API (procedural sound generation)

### Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main app with RouterProvider
│   ├── routes.ts                  # Route definitions (/, /vs-machine, /multiplayer)
│   ├── components/
│   │   ├── home.tsx               # Landing page with rules & stats
│   │   ├── vs-machine.tsx         # Single-player vs AI (main game logic)
│   │   ├── multiplayer.tsx        # Multiplayer lobby (UI only, needs backend)
│   │   ├── tutorial.tsx           # First-time tutorial overlay
│   │   ├── stats-modal.tsx        # Statistics display
│   │   ├── sounds.ts              # Web Audio API sound manager
│   │   ├── effects.tsx            # Visual effects (shake, confetti, muzzle flash)
│   │   ├── game-over-animation.tsx # End-game overlay
│   │   ├── icons.tsx              # Custom SVG icons (Pistola, Escudo, Recarga, Bala)
│   │   ├── ui/                    # Radix UI components (auto-generated, rarely modify)
│   │   └── figma/                 # Figma-related components
│   └── utils/
│       ├── ai.ts                  # AI opponent logic (3 difficulty levels)
│       ├── stats.ts               # LocalStorage statistics persistence
│       ├── tutorial.ts            # Tutorial completion tracking
│       └── haptics.ts             # Haptic feedback utilities
├── styles/
│   ├── index.css                  # Global styles & animations
│   ├── tailwind.css               # Tailwind base
│   ├── theme.css                  # Theme variables
│   └── fonts.css                  # Custom fonts (Rye, Special Elite)
└── main.tsx                       # React entry point
```

### Key Design Patterns

**Game State Machine** (`vs-machine.tsx:14-54`)
- `GamePhase`: idle → countdown → choose → reveal → gameOver
- Each phase controls UI rendering and available actions
- Timer logic in `choose` phase triggers automatic loss on timeout

**AI Engine** (`utils/ai.ts`)
- Three difficulty levels with distinct strategies:
  - **Easy**: Random moves (respects bullet logic)
  - **Normal**: Weighted randomness (60% shoot, 30% shield, 10% reload)
  - **Hard**: Pattern recognition, bullet counting, adaptive strategy
- Receives game state (bullets, player history, rounds played) and returns optimal move

**Sound System** (`components/sounds.ts`)
- Pure Web Audio API - no external audio files
- Procedural generation for all sounds (gunshots, reload, shield, etc.)
- Single exported `soundManager` instance

**Statistics Persistence** (`utils/stats.ts`)
- LocalStorage-based persistence for wins, losses, streaks
- Tracking per difficulty level
- Functions: `recordWin()`, `recordLoss()`, `recordRound()`, `getStats()`, `resetStats()`

## Key Components

### vs-machine.tsx
The heart of the game. Handles:
- Game loop and phase transitions
- 10-second decision timer with visual countdown
- Action validation (can't shoot with 0 bullets, can't reload at 5 bullets)
- Win/loss determination per round
- Statistics tracking via `utils/stats.ts`
- AI opponent via `aiEngine.getMove()`
- Sound effects via `soundManager`
- Visual effects (shake on hit, confetti on victory)

### home.tsx
Landing page featuring:
- Western "WANTED" poster aesthetic
- Quick stats display (games played, wins, current streak)
- Game rules explanation
- Mode selection (vs-machine, multiplayer)
- Tutorial reset button

### multiplayer.tsx
UI scaffolding for multiplayer (needs backend integration):
- Room creation/joining interface
- 5-character room code generation
- Ready to integrate with Convex, Supabase, or similar backend
- Notes indicate this is prepared for future implementation

## Styling Conventions

**Western Theme**: Heavy use of specific colors:
- Background: `bg-[#e8d5a3]` (parchment)
- Accent: `bg-[#d4c5a0]` (aged paper)
- Borders: `border-black` with `shadow-[4px_4px_0px_rgba(0,0,0,1)]` (hard shadows)

**Typography**:
- Headings: `'Rye', serif` (Western display font)
- Body: `'Special Elite', monospace` (typewriter style)

**Responsive**: Mobile-first with `sm:` breakpoints throughout

**Custom CSS**:
- `.paper-texture`: Parchment texture effect
- `.torn-edge`: Torn paper border effect
- `.animate-zoom-in`, `.animate-flip`: Custom animations in `styles/index.css`

## Important Implementation Details

### Bullet Management
Players and AI both track bullets (0-5). Critical game rules:
- Cannot shoot with 0 bullets (shows error message)
- Cannot reload at 5 bullets (shows error message)
- Shooting decrements bullets, reloading increments them
- Bullet count displayed with visual icons (`BalaIcon`)

### Timer System
10-second countdown in `choose` phase:
- Visual progress bar changes from green to red at 3 seconds
- Audio and haptic feedback at 3, 2, 1 seconds remaining
- Automatic round loss if timer expires
- Timer stops immediately when player selects valid action

### Tutorial System
First-time players see tutorial overlay (`tutorial.tsx`):
- Completion tracked in localStorage
- Can be reset from home screen
- Only shows on first visit or after reset

### Multiplayer Status
Multiplayer is **not functional** - it's a UI shell waiting for backend integration. The interface is complete but state management needs:
- Real-time room synchronization
- Player action broadcasting
- Game state persistence
- Consider Convex, Supabase Realtime, or similar

## File Patterns

When working with this codebase:
- **Game logic changes**: Focus on `vs-machine.tsx` and `utils/ai.ts`
- **UI modifications**: Update component files in `components/`
- **Styling changes**: Modify Tailwind classes or `styles/index.css`
- **New features**: Consider if they belong in game loop (`vs-machine.tsx`) or are separate concerns
- **Backend integration**: Start with `multiplayer.tsx` scaffolding

## Known Limitations

1. No multiplayer backend implementation (UI only)
2. No test suite
3. No linting configuration
4. Limited accessibility (keyboard navigation not fully implemented)
5. Sound plays on every interaction (could be overwhelming for some users)