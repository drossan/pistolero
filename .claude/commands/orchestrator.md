---
name: flutter-orchestrator
version: 1.0.0
author: fitpulse-dev-team
description: Orquesta tareas de desarrollo Flutter en FitPulse Interval Timer, coordinando múltiples agentes especializados según la naturaleza de la solicitud (desarrollo, arquitectura, testing, debugging, optimización)
usage: "orchestrator [task-description] [--priority=normal|high|critical] [--type=feature|bug|refactor|test|optimization]"
type: meta
writes_code: false
creates_plan: true
requires_approval: true
dependencies: [plan-manager, code-analyzer]
---

# Comando: Flutter Orchestrator

## Objetivo

Analizar solicitudes de desarrollo para el proyecto FitPulse Interval Timer y orquestar la ejecución delegando en los agentes especializados más adecuados según el tipo de tarea:

- **Desarrollo de features**: flutter-developer + flutter-architect
- **Diseño arquitectónico**: flutter-architect + flutter-planning-agent
- **Testing y cobertura**: test-coverage-analyzer
- **Debugging complejo**: debugger-specialist + background-execution-expert/audio-system-specialist
- **Optimización de rendimiento**: performance-optimizer
- **Sistemas críticos** (timer/audio/background): background-execution-expert + audio-system-specialist

El command evalúa la solicitud, selecciona el agente/skill óptimo usando el framework RACI, y genera un plan estructurado cuando hay impacto en código.

**No ejecuta trabajo técnico directamente**, solo coordina y delega.

## Contexto Requerido del Usuario

- [ ] Descripción clara de la tarea o problema
- [ ] Tipo de trabajo: feature, bug, refactor, test, optimization, o architectural-change
- [ ] Contexto técnico actual (archivos afectados, módulos involucrados)
- [ ] Criterios de aceptación o resultado esperado
- [ ] Prioridad: normal, high, o critical
- [ ] Restricciones específicas (plataforma: iOS/Android, componentes críticos como timer/audio)

## Análisis Inicial (Obligatorio)

Antes de delegar en cualquier agente, el command debe evaluar:

- **Naturaleza de la tarea**: ¿Desarrollo? ¿Debugging? ¿Testing? ¿Arquitectura? ¿Optimización?
- **Componentes críticos involucrados**: TimerService, AudioService, BackgroundExecution, TrainingNotifier
- **Impacto en arquitectura**: ¿Modifica capas de Clean Architecture?
- **Riesgos técnicos**: Regresiones en timer/audio, perdida de precisión, memory leaks
- **Plataformas afectadas**: iOS, Android, o ambas
- **Necesidad de planificación**: ¿Requiere plan estructurado o ejecución directa?

### Pre-ejecución: Checklist Obligatorio

El command debe verificar:

- [ ] ¿La tarea afecta componentes críticos (timer/audio/background)? → Priorizar agentes especializados
- [ ] ¿Requiere cambio arquitectónico? → Involucrar flutter-architect
- [ ] ¿Es bug en sistemas críticos? → debugger-specialist + expertise específico
- [ ] ¿Requiere testing? → test-coverage-analyzer para estrategia
- [ ] ¿El contexto es suficiente? → Solicitar aclaraciones si falta información
- [ ] ¿Hay trabajos pendientes en mismos componentes? → Verificar conflictos

**Output esperado**: JSON de análisis y selección de agentes.

```json
{
  "task_type": "feature|bug|refactor|test|optimization|architectural",
  "critical_components": ["timer", "audio", "background"],
  "selected_agents": [
    {
      "agent": "flutter-developer",
      "role": "responsible",
      "justification": "Implementación de feature en capa presentation"
    },
    {
      "agent": "audio-system-specialist",
      "role": "consulted",
      "justification": "Validación de configuración de audio para background"
    }
  ],
  "requires_plan": true,
  "estimated_complexity": "medium|high|critical",
  "risks": ["Possible timer regression", "Audio session configuration needed"],
  "blocking_issues": []
}
```

## Selección de Agentes y Skills (Framework RACI)

El command selecciona agentes dinámicamente según el tipo de tarea:

### Matriz de Selección por Tipo de Tarea

| Tipo de Tarea | Agente Primary (R) | Agente Validator (A) | Skills Consultados (C) |
|---------------|-------------------|---------------------|------------------------|
| **Nueva Feature** | flutter-developer | flutter-architect | riverpod-state-management, drift-orm, dart-code-generation |
| **Bug en Timer** | debugger-specialist | flutter-architect | timer-drift-compensation, debug-master |
| **Bug en Audio** | debugger-specialist | audio-system-specialist | audio-service-setup, background-execution-config |
| **Background Execution** | background-execution-expert | flutter-architect | background-execution-config, debug-master |
| **Arquitectura** | flutter-architect | flutter-planning-agent | technical-writer, code-reviewer |
| **Refactorización** | flutter-developer | flutter-architect | code-reviewer, riverpod-state-management |
| **Testing** | test-coverage-analyzer | flutter-developer | flutter-testing |
| **Optimización** | performance-optimizer | flutter-architect | debug-master, code-reviewer |
| **Code Review** | technical-writer | flutter-architect | code-reviewer |
| **Planificación** | flutter-planning-agent | flutter-orchestrator | technical-writer |

### Ejemplos de Asignación RACI por Escenario

#### Escenario 1: Bug en Timer que pierde precisión

```yaml
fase_1_diagnostico:
  responsible: debugger-specialist
  accountable: flutter-architect
  consulted: [ timer-drift-compensation, debug-master ]
  informed: [ flutter-developer ]

fase_2_correccion:
  responsible: flutter-developer
  accountable: flutter-architect
  consulted: [ timer-drift-compensation, riverpod-state-management ]
  informed: [ test-coverage-analyzer ]

fase_3_validacion:
  responsible: test-coverage-analyzer
  accountable: flutter-architect
  consulted: [ flutter-testing, timer-drift-compensation ]
  informed: [ ]
```

#### Escenario 2: Nueva Feature - Modificación en TrainingScreen

```yaml
fase_1_disenio:
  responsible: flutter-architect
  accountable: flutter-planning-agent
  consulted: [ riverpod-state-management, technical-writer ]
  informed: [ flutter-developer ]

fase_2_implementacion:
  responsible: flutter-developer
  accountable: flutter-architect
  consulted: [ riverpod-state-management, dart-code-generation, code-reviewer ]
  informed: [ test-coverage-analyzer ]

fase_3_testing:
  responsible: test-coverage-analyzer
  accountable: flutter-developer
  consulted: [ flutter-testing ]
  informed: [ ]
```

#### Escenario 3: Audio no funciona en background (iOS)

```yaml
fase_1_diagnostico:
  responsible: debugger-specialist
  accountable: background-execution-expert
  consulted: [ debug-master, background-execution-config ]
  informed: [ audio-system-specialist ]

fase_2_correccion:
  responsible: background-execution-expert
  accountable: audio-system-specialist
  consulted: [ audio-service-setup, background-execution-config ]
  informed: [ flutter-developer ]

fase_3_validacion:
  responsible: audio-system-specialist
  accountable: flutter-architect
  consulted: [ audio-service-setup, flutter-testing ]
  informed: [ ]
```

## Flujo de Trabajo Orquestado

### 1. Análisis y Clasificación (flutter-orchestrator | Auto-validación)

**Objetivo**: Determinar el tipo de tarea y seleccionar los agentes óptimos

**Tareas**:

- Analizar la descripción de la tarea proporcionada por el usuario
- Identificar componentes críticos involucrados (timer, audio, background)
- Clasificar la tarea: feature, bug, refactor, test, optimization, architectural
- Seleccionar agentes según la matriz RACI correspondiente
- Evaluar si requiere plan estructurado o ejecución directa
- Generar JSON de análisis con agentes seleccionados

**Asignación**:

- **Agente**: flutter-orchestrator
- **Skills**: `code-reviewer` (para clasificación)
- **Validador**: Auto-validación mediante checklist

**Criterios de Salida**:

- [ ] Tipo de tarea identificado y documentado
- [ ] Agentes seleccionados con roles RACI definidos
- [ ] JSON de análisis generado
- [ ] Decision sobre necesidad de plan tomada

---

### 2. Generación de Plan (si aplica) (flutter-planning-agent | Validado por flutter-architect)

**Objetivo**: Crear plan estructurado en `.claude/plans/` cuando hay impacto en código

**Tareas**:

- Desglosar la tarea en fases técnicas claras
- Asignar cada fase a un agente específico con responsibilities RACI
- Definir criterios de aceptación por fase
- Identificar dependencias entre fases
- Documentar riesgos y mitigaciones
- Generar archivo Markdown en `.claude/plans/{timestamp}-flutter-orchestrator-{task-type}.md`

**Asignación**:

- **Agente**: flutter-planning-agent
- **Skills**: `technical-writer`, `code-reviewer`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Plan generado en ubicación correcta
- [ ] Fases numeradas con agentes RACI asignados
- [ ] Criterios de aceptación medibles
- [ ] Riesgos documentados con mitigaciones

---

### 3. Ejecución Coordinada (Agentes Específicos | Validado por flutter-architect)

**Objetivo**: Delegar ejecución técnica a los agentes especializados seleccionados

**Tareas**:

- **Para features**: Delegar en flutter-developer con skills de Riverpod, Drift, code-generation
- **Para bugs críticos**: Delegar en debugger-specialist + expert específico (audio/background/timer)
- **Para arquitectura**: Delegar en flutter-architect para diseño estructural
- **Para testing**: Delegar en test-coverage-analyzer para estrategia y validación
- **Para optimización**: Delegar en performance-optimizer para análisis mejoras
- Coordinar la ejecución secuencial o paralela según dependencias
- Monitorear progreso y validar resultados intermedios

**Asignación**:

- **Agente**: Variable según matriz de selección (ver sección anterior)
- **Skills**: Variable según naturaleza de la tarea (ver matriz de selección)
- **Dependencias**: Plan aprobado por usuario (si aplica)
- **Validador**: flutter-architect (siempre valida cambios arquitectónicos o críticos)

**Criterios de Salida**:

- [ ] Tarea técnica completada por agente especializado
- [ ] Código generado/modificado según Clean Architecture
- [ ] Tests creados/actualizados si aplica
- [ ] Validación técnica aprobada por agente validador

---

### 4. Validación de Calidad (technical-writer | Validado por flutter-architect)

**Objetivo**: Asegurar que el trabajo cumple estándares del proyecto FitPulse

**Tareas**:

- Revisar código contra principios Clean Architecture + Riverpod
- Verificar que no se han violado restricciones críticas (timer drift, audio background)
- Validar que tests cubren caminos críticos
- Verificar documentación actualizada
- Ejecutar `flutter analyze` y validar zero warnings
- Revisar cobertura de tests (>70% en paths críticos)

**Asignación**:

- **Agente**: technical-writer
- **Skills**: `code-reviewer`, `technical-writer`
- **Dependencias**: Fase 3 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Código sigue Clean Architecture + Riverpod
- [ ] Zero warnings en `flutter analyze`
- [ ] Tests críticos cubiertos
- [ ] Documentación técnica actualizada
- [ ] Componentes críticos validados (timer/audio/background)

---

### 5. Reporte Final (flutter-orchestrator | Auto-validación)

**Objetivo**: Generar reporte consolidado del trabajo completado

**Tareas**:

- Compilar resultados de todas las fases
- Documentar cambios realizados con archivos afectados
- Reportar métricas de calidad (coverage, warnings, performance)
- Identificar next steps o trabajo pendiente
- Generar reporte en `.claude/reports/flutter-orchestrator-{timestamp}.md`

**Asignación**:

- **Agente**: flutter-orchestrator
- **Skills**: `technical-writer`
- **Dependencias**: Fase 4 completada
- **Validador**: Auto-validación

**Criterios de Salida**:

- [ ] Reporte generado en ubicación correcta
- [ ] Cambios documentados con archivos listados
- [ ] Métricas de calidad reportadas
- [ ] Next steps identificados

## Uso de otros Commands y MCPs

```yaml
commands_invocados:
  - name: plan-manager
    trigger: cuando se requiere aprobar/ejecutar plan generado
    output_required: plan_status.json

mcps_utilizados:
  - name: chrome-devtools
    purpose: Validación de UI en navegador cuando aplica
    config: default
  
  - name: web-reader
    purpose: Consulta de documentación Flutter/Dart oficial
    config: default

contexto_compartido:
  location: .claude/context/fitpulse-state.json
  format: JSON
  consumers: [ all-agents ]
  content:
    project_status: "development|testing|release"
    pending_work: []
    known_issues: []
    critical_components_status:
      timer: "stable|unstable"
      audio: "stable|unstable"
      background: "stable|unstable"
```

## Output y Artefactos

| Artefacto | Ubicación | Formato | Validador | Obligatorio |
|-----------|-----------|---------|-----------|-------------|
| Plan técnico | `.claude/plans/{timestamp}-flutter-orchestrator-{task-type}.md` | Markdown | `flutter-architect` | Sí (si hay impacto en código) |
| Reporte final | `.claude/reports/flutter-orchestrator-{timestamp}.md` | Markdown | Auto | Sí |
| Análisis de agentes | `.claude/context/agent-selection-{timestamp}.json` | JSON | Auto | Sí |
| Log de ejecución | `.claude/logs/flutter-orchestrator-{date}.log` | Plain text | - | Sí |
| Diagnóstico de bugs | `.claude/reports/bug-diagnosis-{timestamp}.md` | Markdown | `debugger-specialist` | No (solo para bugs) |
| Estrategia de testing | `.claude/reports/test-coverage-analysis-{timestamp}.md` | Markdown | `test-coverage-analyzer` | No (solo para testing) |

## Rollback y Cancelación

Si el command falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener agentes en curso**: Enviar señal de cancelación a todos los agentes activos
2. **Eliminar artefactos parciales**:
   - Borrar planes incompletos en `.claude/plans/`
   - Eliminar reportes parciales en `.claude/reports/`
   - Limpiar JSONs de análisis en `.claude/context/`
3. **Restaurar código**: Si algún agente modificó código, usar git para revertir:
   ```bash
   git status
   git checkout -- <affected_files>
   ```
4. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-flutter-orchestrator-{timestamp}.log
   ```
5. **Notificar dependientes**: Informar a plan-manager y otros commands que esperaban output

### Estados Finales Posibles

- `completed`: Ejecución exitosa, tarea completada y validada
- `failed`: Error irrecuperable en agente especializado
- `cancelled`: Cancelado por usuario durante ejecución
- `partial`: Completado parcialmente (solo análisis, sin implementación)
- `awaiting_approval`: Plan generado y pendiente de aprobación del usuario

## Reglas Críticas

- **No modificación directa de código**: El command orquesta, no implementa. Delega en flutter-developer u otros agentes.
- **Selección dinámica de agentes**: Debe elegir el agente óptimo según tipo de tarea usando la matriz RACI
- **Protección de componentes críticos**: Cualquier cambio a TimerService, AudioService, BackgroundExecution requiere validación por agentes especializados
- **Planificación obligatoria**: Si hay impacto en código, debe generarse plan en `.claude/plans/`
- **Separación de responsabilidades**: flutter-orchestrator coordina, agentes especializados ejecutan
- **Validación arquitectónica**: flutter-architect debe validar siempre cambios arquitectónicos o en componentes críticos
- **Análisis previo obligatorio**: Ninguna delegación sin análisis y clasificación previa
- **Versionado semántico**: Cambios en el command requieren actualizar la versión
- **Idempotencia**: Ejecutar el command múltiples veces con mismos parámetros debe producir mismo análisis

## Casos de Uso Específicos

### Caso 1: "El timer pierde 5 segundos después de 30 minutos"

**Flujo**:
1. Clasificar como "bug" en componente crítico "timer"
2. Seleccionar: debugger-specialist (R) + flutter-architect (A) + timer-drift-compensation (C)
3. Generar plan de diagnóstico y corrección
4. Delegar diagnóstico a debugger-specialist con skill timer-drift-compensation
5. Validar corrección con flutter-architect
6. Asegurar tests de precisión actualizados

### Caso 2: "Nueva pantalla de configuración de usuario"

**Flujo**:
1. Clasificar como "feature" de UI
2. Seleccionar: flutter-developer (R) + flutter-architect (A) + riverpod-state-management (C)
3. Generar plan de implementación con diseño arquitectónico
4. Delegar implementación a flutter-developer con skills Riverpod, code-generation
5. Validar arquitectura con flutter-architect
6. Revisar calidad con technical-writer

### Caso 3: "El audio no se escucha cuando bloqueo la pantalla en iOS"

**Flujo**:
1. Clasificar como "bug" crítico en audio + background
2. Seleccionar: debugger-specialist (R) + background-execution-expert (A) + audio-service-setup + background-execution-config (C)
3. Generar plan de diagnóstico de audio session y background modes
4. Delegar diagnóstico a debugger-specialist con skills especializados
5. Delegar corrección a background-execution-expert con skill audio-service-setup
6. Validar con audio-system-specialist
7. Verificar en dispositivo real (no simulador)

### Caso 4: "Aumentar cobertura de tests del TimerService al 90%"

**Flujo**:
1. Clasificar como "test" en componente crítico
2. Seleccionar: test-coverage-analyzer (R) + flutter-developer (A) + flutter-testing (C)
3. Generar plan de estrategia de testing
4. Delegar análisis de cobertura actual a test-coverage-analyzer
5. Delegar implementación de tests faltantes a flutter-developer
6. Validar cobertura target alcanzada

## Acción del Usuario

Describe la tarea que deseas realizar en el proyecto FitPulse, incluyendo:

1. **Descripción detallada**: ¿Qué necesitas hacer? (ej: "El timer pierde precisión", "Nueva pantalla de settings", "Audio no funciona en background")
2. **Tipo de trabajo**: ¿Feature, bug, refactor, test, optimization, o cambio arquitectónico?
3. **Componentes afectados**: ¿Timer, audio, background, UI, base de datos, servicios?
4. **Contexto actual**: ¿Archivos o módulos específicos involucrados?
5. **Criterios de aceptación**: ¿Cómo sabrás que la tarea está completa?
6. **Prioridad**: ¿Normal, high, o critical?
7. **Restricciones**: ¿Plataforma específica (iOS/Android)? ¿Dispositivo real requerido?

**Ejemplo de solicitud válida**:
> "El timer empieza a desincronizarse después de 20 minutos de entrenamiento. Noté que en mi iPhone 12 con iOS 17, el countdown muestra 5 segundos menos de los reales. Esto arruina las sesiones de mis clientes. Es CRÍTICO porque afecta la funcionalidad principal. Necesito que el timer mantenga precisión de <1 segundo en sesiones de 60 minutos."