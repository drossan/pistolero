---
name: run-integration-tests
version: 1.0.0
author: development-team
description: Comando para ejecutar pruebas de integración en FitPulse Interval Timer, validando(timer precision, background execution, audio background, call interruption, battery efficiency) en dispositivos reales iOS y Android
usage: "run-integration-tests [--target=all|ios|android] [--skip-build] [--coverage]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Run Integration Tests

## Objetivo

Ejecutar la suite completa de pruebas de integración de FitPulse Interval Timer en dispositivos reales, verificando los comportamientos críticos que no pueden validarse en simuladores:

- **Timer Precision**: Validar que el drift del timer es <5s en sesiones de 30 minutos
- **Background Execution**: Verificar que el timer continúa ejecutándose con pantalla bloqueada por 30+ minutos
- **Audio Background**: Confirmar que los sonidos se reproducen correctamente con pantalla bloqueada
- **Call Interruption**: Validar que el timer se reanuda correctamente después de una llamada telefónica
- **Battery Efficiency**: Medir que el consumo de batería es <2% por sesión de 30 minutos

**Este comando es ejecutable y genera reportes de resultados sin modificar código.**

## Contexto Requerido del Usuario

Antes de ejecutar las pruebas de integración, verifica:

- [ ] **Dispositivo real conectado** (iOS iPhone 12+ con iOS 14+ o Android Pixel 5+/Samsung S21+ con Android 10+)
- [ ] **App compilada en modo debug** instalada en el dispositivo
- [ ] **Batería del dispositivo >50%** para pruebas de consumo energético
- [ ] **Dispositivo desbloqueado** con pantalla activa al iniciar las pruebas
- [ ] **Ambiente silencioso** para validar audición de sonidos de retroalimentación
- [ ] **SIM activa** (para pruebas de interrupción por llamada)

Opcional:

- [ ] Especificar plataforma objetivo: `--target=ios`, `--target=android`, o `--target=all` (default)
- [ ] Saltar build si la app ya está instalada: `--skip-build`
- [ ] Generar reporte de cobertura: `--coverage`

## Análisis Inicial (Obligatorio)

### Pre-ejecución: Checklist Obligatorio

El comando debe verificar:

- [ ] ¿Hay dispositivos reales conectados? → Si no, fallar con instrucciones
- [ ] ¿El dispositivo cumple requisitos mínimos (iOS 14+/Android 10+)? → Si no, advertir y continuar
- [ ] ¿La app está compilada o se requiere build? → Ejecutar flutter build si es necesario
- [ ] ¿Hay suficiente batería para pruebas de consumo? → Si <50%, advertir
- [ ] ¿Los archivos de assets de audio están presentes? → Validar existencia de sonidos requeridos

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "connected_devices": [
    {"platform": "ios", "model": "iPhone 14", "os_version": "17.0", "battery": 78},
    {"platform": "android", "model": "Pixel 7", "os_version": "14.0", "battery": 65}
  ],
  "target_platforms": ["ios", "android"],
  "build_required": false,
  "risks": [
    "Battery test requires 60+ minutes",
    "Audio test requires quiet environment",
    "Call interruption test requires active SIM"
  ],
  "estimated_duration_minutes": 90
}
```

## Selección de Agentes y Skills

### Fase 1: Preparación y Validación del Entorno

```yaml
responsible: flutter-orchestrator
accountable: flutter-architect
consulted: [ debug-master, technical-writer ]
informed: [ flutter-developer ]
```

**Justificación**: `flutter-orchestrator` coordina la preparación del entorno de test, validación de dispositivos y configuración inicial. `debug-master` proporciona expertise para verificar que el entorno está correctamente configurado para pruebas de integración. `technical-writer` documenta el estado inicial del entorno.

### Fase 2: Ejecución de Pruebas de Integración

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: [ flutter-testing, timer-drift-compensation, audio-service-setup, background-execution-config ]
informed: [ performance-optimizer, debugger-specialist ]
```

**Justificación**: `flutter-developer` ejecuta las pruebas de integración en dispositivos reales. Las skills especializadas (`flutter-testing`, `timer-drift-compensation`, `audio-service-setup`, `background-execution-config`) proporcionan conocimiento técnico específico para cada tipo de prueba. `performance-optimizer` analiza métricas de consumo de batería. `debugger-specialist` está informado para diagnosticar fallos.

### Fase 3: Análisis de Resultados y Generación de Reportes

```yaml
responsible: test-coverage-analyzer
accountable: flutter-architect
consulted: [ debug-master, technical-writer ]
informed: [ flutter-developer, performance-optimizer ]
```

**Justificación**: `test-coverage-analyzer` analiza los resultados de las pruebas, verifica que cumplan los criterios de aceptación y genera reportes detallados. `debug-master` ayuda a analizar fallos si los hay. `technical-writer` estructura la documentación de resultados.

## Flujo de Trabajo Orquestado

### 1. Preparación del Entorno de Test (flutter-orchestrator | Validado por flutter-architect)

**Objetivo**: Validar dispositivos conectados, compilar la app si es necesario y verificar configuración

**Tareas**:

- Ejecutar `flutter devices` para listar dispositivos conectados
- Verificar que los dispositivos cumplan requisitos mínimos (iOS 14+/Android 10+)
- Compilar la app en modo debug si no está instalada: `flutter build apk --debug` o `flutter build ios --debug`
- Instalar la app en los dispositivos conectados
- Verificar que los assets de audio estén presentes en la compilación
- Documentar estado inicial: modelos, versiones de OS, nivel de batería

**Asignación**:

- **Agente**: flutter-orchestrator
- **Skills**: `debug-master`, `technical-writer`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Al menos un dispositivo real conectado y validado
- [ ] App instalada y ejecutándose en el dispositivo
- [ ] Assets de audio validados (6 sonidos requeridos presentes)
- [ ] Estado inicial documentado en `.claude/logs/integration-test-setup-{timestamp}.json`

---

### 2. Prueba de Precisión del Timer (flutter-developer | Validado por flutter-architect)

**Objetivo**: Validar que el drift del timer es <5s en una sesión de 30 minutos

**Tareas**:

- Crear una rutina de prueba con 5 ejercicios de 6 minutos cada uno (total 30 min)
- Iniciar el entrenamiento y registrar el timestamp de inicio exacto
- Dejar que el entrenamiento se ejecute sin interrupciones
- Al finalizar, calcular el drift total: |timestamp_final - timestamp_inicio - 30 minutos|
- Repetir la prueba 3 veces para obtener promedio de drift
- Validar que el drift promedio sea <5 segundos

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`, `timer-drift-compensation`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] 3 ejecuciones completadas de 30 minutos cada una
- [ ] Drift promedio calculado y documentado
- [ ] Drift <5s (pasa) o drift ≥5s (falla con análisis del problema)

**Output esperado**:

```json
{
  "test_name": "timer_precision_30min",
  "runs": [
    {"run": 1, "duration_target_sec": 1800, "actual_duration_sec": 1803, "drift_sec": 3},
    {"run": 2, "duration_target_sec": 1800, "actual_duration_sec": 1802, "drift_sec": 2},
    {"run": 3, "duration_target_sec": 1800, "actual_duration_sec": 1804, "drift_sec": 4}
  ],
  "average_drift_sec": 3,
  "passed": true,
  "criterion": "average_drift < 5s"
}
```

---

### 3. Prueba de Ejecución en Background (flutter-developer | Validado por flutter-architect)

**Objetivo**: Verificar que el timer continúa ejecutándose correctamente con la pantalla bloqueada por 30+ minutos

**Tareas**:

- Crear una rutina de prueba de 30 minutos
- Iniciar el entrenamiento con pantalla desbloqueada
- Esperar 2 minutos y bloquear la pantalla del dispositivo
- Dejar el dispositivo bloqueado por 28 minutos adicionales
- Desbloquear la pantalla y verificar que el timer continúe ejecutándose
- Validar que el tiempo restante mostrado sea correcto (drift <5s)
- Verificar que no haya crash ni reinicio del timer

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`, `background-execution-config`, `timer-drift-compensation`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Timer se ejecutó durante 30 minutos con pantalla bloqueada
- [ ] Al desbloquear, el timer muestra el tiempo correcto (drift <5s)
- [ ] No hubo crashes ni reinicios del timer
- [ ] Foreground service (Android) o background audio (iOS) se mantuvo activo

**Output esperado**:

```json
{
  "test_name": "background_execution_30min",
  "platform": "ios",
  "screen_locked_duration_sec": 1680,
  "timer_continued": true,
  "final_drift_sec": 2,
  "crash_detected": false,
  "background_service_active": true,
  "passed": true
}
```

---

### 4. Prueba de Audio en Background (flutter-developer | Validado por flutter-architect)

**Objetivo**: Confirmar que los sonidos se reproducen correctamente con la pantalla bloqueada

**Tareas**:

- Crear una rutina de prueba de 10 minutos con transiciones frecuentes (30s work / 10s rest)
- Iniciar el entrenamiento
- Bloquear la pantalla después de 1 minuto
- Verificar auditivamente que los sonidos se reproduzcan (cada 40s aproximadamente)
- Desbloquear después de 9 minutos
- Validar que todos los tipos de sonidos se reprodujeron:
  - countdown_beep.mp3 (cuenta regresiva)
  - start_exercise.mp3 (inicio ejercicio)
  - end_exercise.mp3 (fin ejercicio)
  - start_rest.mp3 (inicio descanso)
  - end_series.mp3 (fin serie)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`, `audio-service-setup`, `background-execution-config`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Todos los sonidos se escucharon con pantalla bloqueada
- [ ] No hubo lag ni retrasos en la reproducción
- [ ] El volumen fue consistente throughout la prueba
- [ ] Audio session se mantuvo activa en iOS
- [ ] Foreground service con mediaPlayback se mantuvo activo en Android

**Output esperado**:

```json
{
  "test_name": "audio_background",
  "platform": "android",
  "screen_locked": true,
  "sounds_tested": {
    "countdown_beep": {"played": true, "times": 15, "quality": "clear"},
    "start_exercise": {"played": true, "times": 10, "quality": "clear"},
    "end_exercise": {"played": true, "times": 10, "quality": "clear"},
    "start_rest": {"played": true, "times": 9, "quality": "clear"},
    "end_series": {"played": true, "times": 2, "quality": "clear"}
  },
  "audio_session_active": true,
  "foreground_service_active": true,
  "passed": true
}
```

---

### 5. Prueba de Interrupción por Llamada (flutter-developer | Validado por flutter-architect)

**Objetivo**: Validar que el timer se reanuda correctamente después de una llamada telefónica

**Tareas**:

- Crear una rutina de prueba de 15 minutos
- Iniciar el entrenamiento
- Después de 3 minutos, simular una llamada entrante (usar otro dispositivo)
- Dejar que la llamada suene por 10 segundos
- Rechazar la llamada
- Verificar que el timer se reanude automáticamente
- Validar que el tiempo restante sea correcto (considerando el tiempo de la llamada)
- Repetir 2 veces más (llamada a los 6 min y a los 9 min)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`, `background-execution-config`, `audio-service-setup`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Timer se pausó durante la llamada
- [ ] Timer se reanudó automáticamente al terminar la llamada
- [ ] El tiempo se ajustó correctamente (no hubo drift significativo)
- [ ] No hubo crashes ni estado corrupto
- [ ] Los sonidos se reanudaron correctamente después de la llamada

**Output esperado**:

```json
{
  "test_name": "call_interruption",
  "calls_simulated": 3,
  "interruptions": [
    {"at_second": 180, "duration_sec": 10, "resumed": true, "drift_sec": 0},
    {"at_second": 360, "duration_sec": 10, "resumed": true, "drift_sec": 1},
    {"at_second": 540, "duration_sec": 10, "resumed": true, "drift_sec": 0}
  ],
  "timer_resumed_automatically": true,
  "audio_resumed": true,
  "crash_detected": false,
  "passed": true
}
```

---

### 6. Prueba de Consumo de Batería (flutter-developer | Validado por performance-optimizer)

**Objetivo**: Medir que el consumo de batería es <3% en una sesión de 60 minutos

**Tareas**:

- Registrar nivel de batería inicial del dispositivo
- Crear una rutina de prueba de 60 minutos
- Iniciar el entrenamiento con pantalla encendida
- Configurar el brillo de pantalla al 50%
- Dejar que el entrenamiento se ejecute sin interrupciones
- Al finalizar, registrar el nivel de batería final
- Calcular consumo de batería: (batería_inicial - batería_final)
- Validar que el consumo sea <3%

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`, `background-execution-config`
- **Validador**: performance-optimizer

**Criterios de Salida**:

- [ ] Entrenamiento de 60 minutos completado
- [ ] Consumo de batería calculado
- [ ] Consumo <3% (pasa) o ≥3% (falla con análisis de optimización)

**Output esperado**:

```json
{
  "test_name": "battery_efficiency_60min",
  "device_model": "iPhone 14",
  "screen_brightness": "50%",
  "battery_initial_percent": 85,
  "battery_final_percent": 83,
  "consumption_percent": 2,
  "duration_min": 60,
  "consumption_per_30min": 1.0,
  "passed": true,
  "criterion": "consumption < 3% per 60min"
}
```

---

### 7. Análisis de Resultados y Generación de Reportes (test-coverage-analyzer | Validado por flutter-architect)

**Objetivo**: Analizar todos los resultados, validar criterios de aceptación y generar reporte consolidado

**Tareas**:

- Recopilar todos los JSONs de resultados de las pruebas
- Validar que cada prueba cumpla sus criterios de aceptación
- Calcular tasa de éxito global (pruebas pasadas / total pruebas)
- Identificar pruebas fallidas y analizar patrones de fallo
- Generar reporte consolidado en Markdown con:
  - Resumen ejecutivo
  - Resultados por prueba
  - Métricas clave (drift promedio, consumo batería, etc.)
  - Análisis de fallos (si los hay)
  - Recomendaciones de mejora
- Guardar reporte en `.claude/reports/integration-test-{timestamp}.md`

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `debug-master`, `technical-writer`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Todas las pruebas ejecutadas y analizadas
- [ ] Tasa de éxito global calculada
- [ ] Reporte consolidado generado en `.claude/reports/`
- [ ] Fallos documentados con diagnóstico (si los hay)
- [ ] Recomendaciones de mejora propuestas

**Output esperado**: Reporte Markdown con estructura:

```markdown
# Integration Test Report - FitPulse Interval Timer

**Fecha**: 2025-01-20 15:30:00
**Dispositivos**: iPhone 14 (iOS 17.0), Pixel 7 (Android 14.0)
**Duración total**: 90 minutos

## Resumen Ejecutivo

| Métrica | iOS | Android |
|---------|-----|---------|
| Timer Precision (drift) | 3s ✅ | 2s ✅ |
| Background Execution | ✅ | ✅ |
| Audio Background | ✅ | ✅ |
| Call Interruption | ✅ | ✅ |
| Battery Efficiency | 1.8% ✅ | 2.1% ✅ |
| **Tasa de Éxito** | **100% (5/5)** | **100% (5/5)** |

## Resultados Detallados

### 1. Timer Precision (30 min)
...
```

---

## Uso de otros Commands y MCPs

Este comando no invoca otros commands ni utiliza MCPs específicos. Es autocontenido y ejecuta todas las validaciones necesarias de forma directa.

## Output y Artefactos

| Artefacto | Ubicación | Formato | Validador | Obligatorio |
|-----------|-----------|---------|-----------|-------------|
| Log de setup del entorno | `.claude/logs/integration-test-setup-{timestamp}.json` | JSON | - | Sí |
| Resultados de Timer Precision | `.claude/test-results/timer-precision-{timestamp}.json` | JSON | - | Sí |
| Resultados de Background Execution | `.claude/test-results/background-execution-{timestamp}.json` | JSON | - | Sí |
| Resultados de Audio Background | `.claude/test-results/audio-background-{timestamp}.json` | JSON | - | Sí |
| Resultados de Call Interruption | `.claude/test-results/call-interruption-{timestamp}.json` | JSON | - | Sí |
| Resultados de Battery Efficiency | `.claude/test-results/battery-efficiency-{timestamp}.json` | JSON | - | Sí |
| Reporte consolidado | `.claude/reports/integration-test-{timestamp}.md` | Markdown | `report-validator` | Sí |
| Log de ejecución completo | `.claude/logs/integration-test-{date}.log` | Plain text | - | Sí |

## Rollback y Cancelación

Si el command falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener ejecución actual**: Si hay una prueba en curso, cancelar el test en el dispositivo
2. **Desconectar dispositivo de test**: Cerrar la app en el dispositivo si está ejecutándose
3. **Preservar resultados parciales**: Mantener los JSONs de pruebas completadas antes de la cancelación
4. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-integration-test-{timestamp}.log
   ```
5. **Generar reporte parcial**: Documentar qué pruebas se completaron y cuáles quedaron pendientes

### Estados Finales Posibles

- `completed`: Todas las pruebas ejecutadas exitosamente
- `partial`: Algunas pruebas completadas, otras fallaron o canceladas
- `failed`: Error crítico en infraestructura de test (dispositivo desconectado, crash de app)
- `cancelled`: Cancelación por usuario

## Reglas Críticas

- **No modificación de código**: Este comando solo ejecuta pruebas y genera reportes
- **Dispositivos reales obligatorios**: NO ejecutar en simuladores (timing y background son inaccurate)
- **Validación de entorno previa**: Verificar dispositivos, batería, y conectividad antes de iniciar
- **Ejecución secuencial**: Las pruebas deben ejecutarse en orden para evitar interferencias
- **Documentación obligatoria**: Cada prueba debe generar su JSON de resultados
- **Criterios de aceptación estrictos**: Timer drift <5s, Battery <3%, etc. NO son negociables
- **Repetición de pruebas**: Timer precision y call interruption deben ejecutarse 3 veces cada uno
- **Ambiente controlado**: Las pruebas de audio requieren ambiente silencioso para validación auditiva
- **Tiempo estimado real**: El conjunto completo de pruebas toma 90+ minutos
- **Análisis post-test**: Si una prueba falla, analizar root cause antes de continuar

---

## Acción del Usuario

Para ejecutar las pruebas de integración de FitPulse Interval Timer, asegúrate de:

1. **Dispositivo real conectado** (iPhone 12+ con iOS 14+ o Android Pixel 5+/Samsung S21+ con Android 10+)
2. **Batería del dispositivo >50%**
3. **Ambiente silencioso** para validar audición de sonidos
4. **SIM activa** en el dispositivo (para pruebas de llamada)

Opciones de ejecución:

- `--target=all`: Ejecutar pruebas en iOS y Android (default)
- `--target=ios`: Ejecutar solo en dispositivo iOS
- `--target=android`: Ejecutar solo en dispositivo Android
- `--skip-build`: Saltar compilación si la app ya está instalada
- `--coverage`: Generar reporte de cobertura de código adicional

**Ejemplo de solicitud válida**:
> "Ejecuta las pruebas de integración completas en mi iPhone 14 conectado. Incluye todas las pruebas: timer precision, background execution, audio background, call interruption y battery efficiency. Toma el tiempo que sea necesario."

**Nota**: Las pruebas de integración requieren 90+ minutos para completarse. Asegúrate de tener tiempo suficiente y el dispositivo conectado a carga si es necesario.