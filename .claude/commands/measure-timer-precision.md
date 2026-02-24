---
name: measure-timer-precision
version: 1.0.0
author: fitpulse-development-team
description: Comando para medir y validar la precisión del timer en FitPulse Interval Timer, ejecutando pruebas de precisión en dispositivos reales y generando reportes de drift
usage: "measure-timer-precision [--duration=30] [--device=<device_id>] [--iterations=3]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Measure Timer Precision

## Objetivo

Ejecutar pruebas integrales de precisión del timer en el proyecto FitPulse Interval Timer para validar que el sistema de temporización cumple con los requisitos de drift máximo de 5 segundos en sesiones de 30 minutos.

**Este comando es de tipo executable**: realiza mediciones, análisis y reportes sin modificar código.

**Contexto crítico del proyecto**:
- Timer debe usar compensación de drift basada en DateTime (NO Timer.periodic counting)
- Testing DEBE realizarse en dispositivos reales (simuladores no son precisos)
- Drift máximo aceptable: <5s en 30 minutos
- El timer debe continuar ejecutándose con pantalla bloqueada

## Contexto Requerido del Usuario

- [ ] Dispositivo real conectado (iOS o Android)
- [ ] Duración de la prueba (por defecto: 30 minutos)
- [ ] Número de iteraciones (por defecto: 3)
- [ ] Tipo de prueba (completa, rápida, estrés)

## Análisis Inicial (Obligatorio)

### Validaciones Pre-ejecución

```json
{
  "validation_passed": true,
  "risks": [
    "Requiere dispositivo real conectado",
    "Prueba de larga duración puede afectar batería",
    "La pantalla debe permanecer encendida para medición completa"
  ],
  "required_approvals": [],
  "estimated_complexity": "medium",
  "blocking_issues": [
    "No hay dispositivo real conectado",
    "Batería del dispositivo < 50%"
  ]
}
```

### Checklist Pre-ejecución

Antes de iniciar las mediciones, el comando debe verificar:

- [ ] Dispositivo real conectado (no simulador)
- [ ] Nivel de batería > 50%
- [ ] App compilada en modo Debug o Release
- [ ] Tests de precisión disponibles en `integration_test/`
- [ ] Marco de prueba de timer implementado
- [ ] Sistema de logging de drift activo

## Selección de Agentes y Skills

Este comando utiliza el framework RACI para asignar responsabilidades:

```yaml
fase_1_preparacion:
  responsible: flutter-orchestrator
  accountable: flutter-architect
  consulted: [ background-execution-config, timer-drift-compensation ]
  informed: [ flutter-developer ]

fase_2_ejecucion_pruebas:
  responsible: performance-optimizer
  accountable: flutter-architect
  consulted: [ timer-drift-compensation, flutter-testing ]
  informed: [ debugger-specialist ]

fase_3_analisis_resultados:
  responsible: performance-optimizer
  accountable: flutter-developer
  consulted: [ debug-master ]
  informed: [ technical-writer ]
```

### Justificación de Selección

**Fase 1 - Preparación**:
- **flutter-orchestrator**: Coordinación de múltiples recursos y verificación de entorno
- **background-execution-config**: Verifica configuración de background para pruebas largas
- **timer-drift-compensation**: Valida que el sistema usa compensación de drift correcta

**Fase 2 - Ejecución**:
- **performance-optimizer**: Especialista en medición y análisis de rendimiento
- **timer-drift-compensation**: Valida implementación de DateTime-based drift compensation
- **flutter-testing**: Ejecuta tests de integración en dispositivo real

**Fase 3 - Análisis**:
- **performance-optimizer**: Analiza métricas de precisión y rendimiento
- **debug-master**: Investiga cualquier anomalía en los resultados
- **technical-writer**: Genera reporte ejecutivo de hallazgos

## Flujo de Trabajo Orquestado

### 1. Preparación del Entorno de Pruebas (flutter-orchestrator | Validado por flutter-architect)

**Objetivo**: Configurar el dispositivo y entorno para ejecutar pruebas de precisión confiables

**Tareas**:

- Verificar dispositivo real conectado con `flutter devices`
- Validar nivel de batería > 50%
- Compilar app para testing si es necesario
- Verificar que tests de integración existen en `integration_test/timer_precision_test.dart`
- Confirmar que el sistema de logging de drift está activo
- Verificar configuración de background execution (iOS UIBackgroundModes, Android foreground service)

**Asignación**:

- **Agente**: flutter-orchestrator
- **Skills**: `background-execution-config`, `timer-drift-compensation`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Dispositivo real identificado y conectado
- [ ] Tests de precisión disponibles y listos para ejecutar
- [ ] Nivel de batería suficiente
- [ ] Configuración de background validada

---

### 2. Ejecución de Pruebas de Precisión (performance-optimizer | Validado por flutter-architect)

**Objetivo**: Ejecutar pruebas de precisión del timer en sesiones de larga duración

**Tareas**:

- Ejecutar tests de precisión en dispositivo real
- Monitorear drift acumulado durante la prueba
- Registrar timestamps de inicio/fin de cada fase
- Medir precisión en diferentes escenarios:
  - Timer continuo (30 min)
  - Timer con pause/resume (10 ciclos)
  - Timer con pantalla bloqueada (15 min)
  - Timer con interrupciones (simuladas)
- Capturar logs de rendimiento (CPU, memoria)

**Asignación**:

- **Agente**: performance-optimizer
- **Skills**: `timer-drift-compensation`, `flutter-testing`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Pruebas ejecutadas en dispositivo real (no simulador)
- [ ] Drift medido y registrado para cada escenario
- [ ] Logs de rendimiento capturados
- [ ] Resultados brutos guardados en `.claude/reports/timer-precision-{timestamp}.json`

---

### 3. Análisis de Resultados y Generación de Reporte (performance-optimizer | Validado por flutter-developer)

**Objetivo**: Analizar las mediciones de precisión y generar reporte ejecutivo

**Tareas**:

- Calcular drift promedio, máximo y mínimo
- Comparar contra umbrales de aceptación (<5s en 30min)
- Identificar patrones de drift (lineal, exponencial, por fases)
- Detectar correlaciones con uso de CPU o memoria
- Generar visualizaciones de drift acumulado
- Validar que el sistema usa DateTime differences (no Timer counting)
- Documentar hallazgos y recomendaciones

**Asignación**:

- **Agente**: performance-optimizer
- **Skills**: `debug-master`
- **Dependencias**: Fase 2 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Métricas de precisión calculadas
- [ ] Comparación contra umbrales de aceptación
- [ ] Reporte ejecutivo generado en `.claude/reports/timer-precision-{timestamp}.md`
- [ ] Veredicto: PASA/FALLA según criterios del proyecto

---

### 4. Validación de Aceptación (flutter-developer | Validado por flutter-architect)

**Objetivo**: Confirmar que el timer cumple con los requisitos no negociables del proyecto

**Tareas**:

- Verificar drift máximo <5s en 30 minutos
- Confirmar que TimerService usa DateTime differences
- Validar que el timer funciona con pantalla bloqueada
- Verificar que no hay memory leaks durante sesión larga
- Confirmar que el audio funciona en background durante prueba
- Aprobar o rechazar la implementación del timer

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `timer-drift-compensation`, `debug-master`
- **Dependencias**: Fase 3 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Drift dentro de límites aceptables (<5s/30min)
- [ ] Implementación de DateTime-based drift compensation verificada
- [ ] Veredicto final de aceptación: APROBADO/RECHAZADO

## Output y Artefactos

| Artefacto | Ubicación | Formato | Descripción | Obligatorio |
|-----------|-----------|---------|-------------|-------------|
| Resultados brutos | `.claude/reports/timer-precision-{timestamp}-raw.json` | JSON | Mediciones de drift por fase | Sí |
| Reporte ejecutivo | `.claude/reports/timer-precision-{timestamp}.md` | Markdown | Análisis y veredicto | Sí |
| Gráficas de drift | `.claude/reports/timer-precision-{timestamp}-charts.png` | PNG | Visualización de drift acumulado | No |
| Log de ejecución | `.claude/logs/timer-precision-{date}.log` | Plain text | Registro de ejecución | Sí |
| Veredicto final | `.claude/reports/timer-precision-latest.json` | JSON | Estado actual: PASA/FALLA | Sí |

## Criterios de Aceptación

El timer se considera APROBADO si cumple:

### Requisitos Críticos (Obligatorios)

- [ ] **Drift máximo < 5 segundos** en sesión de 30 minutos
- [ ] **Drift promedio < 1 segundo** por cada 10 minutos
- [ ] **Implementación usa DateTime differences** (NO Timer.periodic counting)
- [ ] **Timer funciona con pantalla bloqueada** (15+ minutos)
- [ ] **No memory leaks** detectados en sesión larga
- [ ] **Pruebas ejecutadas en dispositivo REAL** (no simulador)

### Requisitos Importantes

- [ ] **Drift lineal o inferior** (no exponencial)
- [ ] **Pausa/Resume no aumenta drift** significativamente
- [ ] **Consumo de batería < 2%** por sesión de 30 minutos
- [ ] **Interrupciones no degradan precisión**

### Umbral de Fallo

El timer RECHAZA si:
- Drift > 10 segundos en 30 minutos (crítico)
- Usa Timer.periodic counting sin compensación (crítico)
- Falla con pantalla bloqueada (crítico)
- Memory leak detectado (crítico)
- Drift > 5s pero < 10s (requiere refactorización)

## Uso de MCPs y Commands

```yaml
commands_invocados:
  - name: run-tests
    trigger: fase-2
    purpose: Ejecutar tests de integración de timer
    filter: "integration_test/timer_precision_test.dart"

mcps_utilizados:
  - name: chrome-devtools
    purpose: Monitorear rendimiento en tiempo real durante pruebas
    config: 
      enabled: true
      metrics: [cpu, memory, timeline]
```

## Rollback y Cancelación

Si el comando es cancelado o falla:

1. **Detener pruebas en curso**: Matar proceso de `flutter test integration_test`
2. **Guardar resultados parciales**: Mantener datos capturados hasta el punto de cancelación
3. **Registrar cancelación**: Escribir en `.claude/logs/cancelled-timer-precision-{timestamp}.log`
4. **Liberar dispositivo**: Desconectar sesión de testing
5. **Generar reporte parcial**: Si hay datos suficientes, crear análisis con lo capturado

## Reglas Críticas

- **Dispositivo real obligatorio**: Simuladores NO son aceptables para pruebas de precisión
- **No modificación de código**: Este comando solo mide y reporta
- **Validación de implementación**: Verifica que se usa DateTime differences, no Timer counting
- **Pruebas de larga duración**: Mínimo 30 minutos para detectar drift acumulado
- **Background execution**: Debe probarse con pantalla bloqueada
- **Aceptación binaria**: Resultado es PASA o FALLA (sin terminos medios)
- **Repetibilidad**: Ejecutar mínimo 3 iteraciones para validar consistencia
- **Logging detallado**: Todos los timestamps y drifts deben registrarse

## Ejemplo de Ejecución Exitosa

```bash
# Ejecutar prueba completa de 30 minutos
measure-timer-precision --duration=30 --device=iPhone15Pro --iterations=3

# Salida esperada:
[flutter-orchestrator] Verificando dispositivo real...
✓ iPhone 15 Pro conectado (iOS 17.2, batería: 78%)
✓ Tests de precisión disponibles
✓ Configuración de background validada

[performance-optimizer] Iniciando pruebas de precisión...
Iteración 1/3: Ejecutando timer de 30 minutos...
  ✓ Drift máximo: 2.3s (< 5s umbral)
  ✓ Drift promedio: 0.8s/10min
  ✓ Memoria estable: 45MB
  ✓ Batería consumida: 1.2%
  
Iteración 2/3: Ejecutando timer de 30 minutos...
  ✓ Drift máximo: 1.9s (< 5s umbral)
  ✓ Drift promedio: 0.6s/10min
  ✓ Memoria estable: 44MB
  ✓ Batería consumida: 1.1%

Iteración 3/3: Ejecutando timer con pantalla bloqueada (15 min)...
  ✓ Drift máximo: 1.1s (< 2.5s umbral proporcional)
  ✓ Timer continuó ejecutándose en background
  ✓ Audio funcionó correctamente

[performance-optimizer] Analizando resultados...
  ✓ Drift promedio global: 2.1s/30min (PASA)
  ✓ Implementación usa DateTime differences ✓
  ✓ No memory leaks detectados ✓
  ✓ Background execution funcionando ✓

[flutter-developer] Validación de aceptación...
  ✅ TODOS los criterios críticos cumplidos
  ✅ VEREDICTO: APROBADO

📊 Reporte generado: .claude/reports/timer-precision-20250120-143022.md
```

## Ejemplo de Ejecución con Fallo

```bash
measure-timer-precision --duration=30 --device=Pixel7

[performance-optimizer] Ejecutando pruebas...
Iteración 1/3: Ejecutando timer de 30 minutos...
  ❌ Drift máximo: 7.3s (> 5s umbral)
  ❌ Drift acumulado detectado: exponencial
  ⚠️  Implementación detectada: Timer.periodic counting
  
[flutter-developer] Validación de aceptación...
  ❌ CRÍTICO: Drift excede umbral máximo (7.3s > 5s)
  ❌ CRÍTICO: Implementación incorrecta (usa Timer counting)
  ❌ VEREDICTO: RECHAZADO

📋 Recomendaciones:
  1. Refactorizar TimerService para usar DateTime differences
  2. Reimplementar con compensación de drift
  3. Re-ejecutar pruebas después de refactorización
  
📊 Reporte generado: .claude/reports/timer-precision-20250120-150332.md
```

## Métricas de Éxito del Comando

- **Tiempo de ejecución**: 30-45 minutos por iteración (según duración configurada)
- **Consumo de batería**: <2% del dispositivo durante prueba completa
- **Repetibilidad**: Diferencia <1s entre iteraciones del mismo escenario
- **Cobertura de escenarios**: 100% de casos críticos probados (continuo, pause/resume, background, interrupciones)