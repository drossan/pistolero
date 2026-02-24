---
name: create-feature-branch
version: 1.0.0
author: development-team
description: Comando para crear una nueva feature branch en FitPulse Interval Timer, asegurando que la rama siga las convenciones del proyecto y esté preparada para desarrollo con TDD
usage: "create-feature-branch [feature-name] [--type=feat|fix|refactor|test|docs] [--ticket-id=JIRA-XXX]"
type: planning
writes_code: false
creates_plan: true
requires_approval: false
dependencies: [git]
---

# Comando: Create Feature Branch

## Objetivo

Crear una nueva feature branch para FitPulse Interval Timer siguiendo las convenciones de branching del proyecto, asegurando que:

- La rama se crea desde `develop` (la base correcta)
- El nombre sigue el formato estándar: `{type}/{short-description}`
- El branch local está configurado para trackear remote
- Se genera un plan técnico inicial si la feature es compleja
- Se validan las dependencias y entorno de desarrollo

**No modifica código**, solo prepara el entorno de desarrollo y genera planificación inicial si es necesario.

## Contexto Requerido del Usuario

- [ ] **Nombre de la feature**: Descripción corta y clara (ej: "timer-precision-fix", "audio-background-support")
- [ ] **Tipo de cambio**: `feat` (nueva funcionalidad), `fix` (bug), `refactor` (reestructuración), `test` (tests), `docs` (documentación)
- [ ] **Ticket ID** (opcional): JIRA, GitHub Issue, o sistema de tracking
- [ ] **Descripción funcional** (opcional pero recomendada): Breve explicación de qué se va a implementar
- [ ] **Complejidad estimada**: Baja, Media, Alta (afecta si se genera plan técnico)

## Análisis Inicial

### Validaciones Pre-ejecución

El command debe verificar:

```json
{
  "validation_passed": true,
  "risks": [
    "Rama 'main' detectada - se debe usar 'develop' como base",
    "Cambios sin commitear en working directory"
  ],
  "required_approvals": [],
  "estimated_complexity": "media",
  "blocking_issues": []
}
```

### Pre-ejecución: Checklist Obligatorio

- [ ] Verificar que existe la rama `develop` local y remota
- [ ] Verificar que el working directory está limpio (no hay cambios sin commit)
- [ ] Verificar que `develop` está actualizado con remoto
- [ ] Validar formato del nombre de la rama
- [ ] Detectar si la feature requiere plan técnico (complejidad media/alta)

## Selección de Agentes y Skills

El command utiliza diferentes agentes según la complejidad de la feature:

### Para Features de Complejidad Baja

```yaml
fase_creacion_branch:
  responsible: flutter-developer
  accountable: flutter-orchestrator
  consulted: [ ]
  informed: [ ]
```

### Para Features de Complejidad Media o Alta

```yaml
fase_analisis:
  responsible: flutter-planning-agent
  accountable: flutter-architect
  consulted: [ technical-writer ]
  informed: [ flutter-orchestrator ]

fase_creacion_branch:
  responsible: flutter-developer
  accountable: flutter-orchestrator
  consulted: [ ]
  informed: [ flutter-planning-agent ]
```

**Criterios de Selección**:

| Complejidad | Agente Responsible | Razón |
|-------------|-------------------|-------|
| Baja | `flutter-developer` | Creación de branch simple, sin plan técnico |
| Media | `flutter-planning-agent` + `flutter-developer` | Requiere análisis y plan técnico inicial |
| Alta | `flutter-architect` + `flutter-planning-agent` + `flutter-developer` | Impacto arquitectónico, requiere diseño detallado |

## Flujo de Trabajo Orquestado

### 1. Validación de Entorno (flutter-developer | Validado por flutter-orchestrator)

**Objetivo**: Verificar que el entorno está listo para crear una nueva branch

**Tareas**:

- Verificar estado de git: `git status` (debe estar clean)
- Verificar branch actual: `git branch --show-current`
- Verificar que existe rama `develop`: `git branch -a | grep develop`
- Obtener última versión de develop: `git fetch origin develop`
- Validar que develop está actualizado: `git rev-list --left-right --count origin/develop...develop`

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer` (para validar convenciones)
- **MCPs**: Ninguno
- **Validador**: flutter-orchestrator

**Criterios de Salida**:

- [ ] Working directory limpio (sin cambios pendientes)
- [ ] Rama `develop` existe local y remoto
- [ ] `develop` está sincronizada con `origin/develop`
- [ ] Usuario tiene permisos de escritura en el repo

---

### 2. Análisis de Complejidad (flutter-planning-agent | Validado por flutter-architect)

**Objetivo**: Determinar si la feature requiere plan técnico inicial

**Tareas**:

- Analizar la descripción de la feature
- Evaluar impacto en arquitectura (¿modifica servicios críticos como TimerService, AudioService?)
- Evaluar riesgo (¿afecta timer precision, background execution?)
- Determinar si requiere plan técnico

**Asignación**:

- **Agente**: flutter-planning-agent
- **Skills**: `technical-writer` (para documentar análisis)
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Nivel de complejidad determinado (Baja/Media/Alta)
- [ ] Si es Media/Alta: areas críticas identificadas
- [ ] Si es Media/Alta: se genera plan técnico inicial

---

### 3. Creación de Branch (flutter-developer | Validado por flutter-orchestrator)

**Objetivo**: Crear la nueva feature branch con el nombre correcto

**Tareas**:

- Cambiar a rama develop: `git checkout develop`
- Crear nueva branch: `git checkout -b {type}/{short-description}`
- Configurar trackeo remoto: `git push -u origin {type}/{short-description}`
- Verificar branch creada: `git branch -vv`

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: Ninguna específica requerida
- **Dependencias**: Fase 1 y 2 completadas
- **Validador**: flutter-orchestrator

**Criterios de Salida**:

- [ ] Nueva branch creada desde `develop`
- [ ] Nombre sigue formato `{type}/{short-description}`
- [ ] Branch hace trackeo a `origin/{branch-name}`
- [ ] Usuario está en la nueva branch

---

### 4. Generación de Plan Inicial (Opcional, solo si complejidad Media/Alta) (flutter-planning-agent | Validado por flutter-architect)

**Objetivo**: Crear un plan técnico inicial para la feature

**Tareas**:

- Analizar requerimientos de la feature
- Identificar componentes afectados (servicios, UI, database, tests)
- Definir estrategia de implementación TDD
- Generar plan en `.claude/plans/{timestamp}-{feature-name}.md`

**Asignación**:

- **Agente**: flutter-planning-agent
- **Skills**: `technical-writer`, `code-reviewer`
- **Dependencias**: Fase 3 completada, complejidad Media/Alta
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Plan técnico generado en `.claude/plans/`
- [ ] Areas críticas identificadas (timer, audio, background, etc.)
- [ ] Estrategia de tests definida
- [ ] Dependencias listadas

## Uso de otros Commands y MCPs

Este command no invoca otros commands directamente, pero puede generar outputs que serán utilizados por:

- **plan-manager**: Si se genera un plan técnico, `plan-manager` podrá gestionarlo
- **test-coverage-analyzer**: El plan inicial incluirá estrategia de testing
- **code-analyzer**: Para validar calidad antes de crear la branch

```yaml
commands_que_pueden_consumir_output:
  - name: plan-manager
    trigger: post-fase-4 (si se generó plan)
    input: .claude/plans/{timestamp}-{feature-name}.md

mcps_utilizados:
  - name: git-validator
    purpose: Validar estado del repo antes de crear branch

contexto_compartido:
  location: .claude/context/branch-creation.json
  format: JSON
  consumers: [ plan-manager, test-coverage-analyzer ]
```

## Output y Artefactos

| Artefacto | Ubicación | Formato | Validador | Obligatorio |
|-----------|-----------|---------|-----------|-------------|
| Feature branch | `git repo` | git branch | flutter-orchestrator | Sí |
| Plan técnico inicial | `.claude/plans/{timestamp}-{feature-name}.md` | Markdown | flutter-architect | Solo si complejidad Media/Alta |
| Log de creación | `.claude/logs/branch-creation-{date}.log` | Plain text | - | Sí |
| Análisis de complejidad | `.claude/reports/complexity-analysis-{feature}.json` | JSON | - | No |

### Formato del Plan Técnico Inicial (si aplica)

```markdown
# Plan Técnico: {Feature Name}

## Resumen
{Descripción breve de la feature}

## Complejidad
{Media/Alta}

## Componentes Afectados
- [ ] Services: {AudioService, TimerService, etc.}
- [ ] Data: {Database, repositories}
- [ ] Presentation: {Screens, widgets}
- [ ] Tests: {Unit, widget, integration}

## Areas Críticas
{Timer precision, Background execution, Audio in background}

## Estrategia de Implementación
1. {Paso 1 con TDD}
2. {Paso 2 con TDD}
3. {Paso 3 con TDD}

## Estrategia de Testing
- Unit tests: { qué probar }
- Widget tests: { qué probar }
- Integration tests: { qué probar en dispositivo real }

## Dependencias
- {Librerías o componentes necesarios}

## Criterios de Aceptación
- [ ] {Criterio 1}
- [ ] {Criterio 2}
```

## Rollback y Cancelación

Si el command falla o el usuario cancela:

### Procedimiento de Rollback

1. **Eliminar branch local** si fue creada:
   ```bash
   git checkout develop
   git branch -D {feature-branch}
   ```

2. **Eliminar branch remota** si fue pushada:
   ```bash
   git push origin --delete {feature-branch}
   ```

3. **Eliminar plan técnico parcial** (si aplica):
   ```bash
   rm .claude/plans/{timestamp}-{feature-name}.md
   ```

4. **Restaurar working directory**:
   - Si había staging, hacer `git reset`
   - Si había cambios, hacer `git checkout -- .`

5. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-branch-creation-{timestamp}.log
   ```

### Estados Finales Posibles

- `completed`: Branch creada exitosamente
- `completed-with-plan`: Branch creada + plan técnico generado
- `failed`: Error irrecuperable (ej: sin permisos, develop no existe)
- `cancelled`: Cancelado por usuario
- `validation-failed`: Falló validación de entorno

## Reglas Críticas

- **No modifica código**: Este command solo crea branches y planificación inicial
- **Base obligatoria**: Siempre crear branches desde `develop`, nunca desde `main`
- **Nombre estandarizado**: Formato `{type}/{short-description}` es obligatorio
- **Working directory limpio**: No crear branch si hay cambios pendientes
- **Análisis de complejidad**: Siempre evaluar si se requiere plan técnico
- **Plan técnico para críticas**: Features que tocan TimerService, AudioService, BackgroundExecution requieren plan
- **Trackeo remoto**: Branch debe hacer trackeo a `origin` desde el inicio
- **TDD mindset**: El plan inicial debe enfatizar tests primero

## Convenciones de Nomenclatura de Branches

### Formato

```
{type}/{short-description}
```

### Tipos Soportados

- `feat/`: Nueva funcionalidad (ej: `feat/audio-background-support`)
- `fix/`: Corrección de bug (ej: `fix/timer-drift-compensation`)
- `refactor/`: Reestructuración (ej: `refactor/riverpod-migration`)
- `test/`: Agregar o mejorar tests (ej: `test/timer-precision-coverage`)
- `docs/`: Documentación (ej: `docs/architecture-diagrams`)

### Ejemplos Válidos

```
feat/timer-background-execution
fix/audio-not-playing-lock-screen
refactor/clean-architecture-restructure
test/integration-tests-timer-precision
docs/api-documentation
```

### Ejemplos Inválidos

```
feature (sin tipo)
feature/new-timer (demasiado genérico)
bugfix/audio (usar 'fix/' en lugar de 'bugfix/')
hotfix/timer (hotfixes van desde main, no develop)
```

## Acción del Usuario

Para crear una nueva feature branch, proporciona:

1. **Nombre de la feature**: Descripción corta en kebab-case (ej: "audio-background-support", "timer-drift-fix")
2. **Tipo de cambio**: Uno de `feat`, `fix`, `refactor`, `test`, `docs`
3. **Ticket ID** (opcional): JIRA-XXX o GitHub issue number
4. **Descripción funcional** (opcional pero recomendada): Qué vas a implementar

**Ejemplos de uso**:

```bash
# Feature simple de audio
/create-feature-branch feat/audio-background-support

# Bug fix crítico de timer
/create-feature-branch fix/timer-precision-drift --ticket-id=FIT-123

# Refactor complejo
/create-feature-branch refactor/riverpod-state-management --complexity=high
```

**Ejemplo de solicitud completa**:
> "Necesito crear una branch para implementar soporte de audio en background. La feature se llamará 'audio-background-support', es tipo 'feat', ticket JIRA-145. La descripción es: Implementar audio playback cuando la pantalla está bloqueada usando foreground service en Android y UIBackgroundModes en iOS."