---
name: test-background-audio
version: 1.0.0
author: team
description: Ejecuta pruebas integrales de audio en segundo plano para validar que el sistema de audio funciona correctamente con la pantalla bloqueada, en background y durante interrupciones del sistema
usage: "test-background-audio [--device=device-id] [--duration=minutes]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Test Background Audio

## Objetivo

Ejecutar pruebas integrales del sistema de audio en segundo plano para verificar que FitPulse Interval Timer cumple con los requisitos críticos de reprodución de audio en todas las condiciones:

- Audio con pantalla bloqueada
- Audio en background (app minimizada)
- Audio durante llamadas entrantes
- Audio con interrupciones del sistema (alarmas, otras apps)
- Precisión de temporización con audio activo

**No modifica código**, solo ejecuta pruebas y genera reportes de validación.

## Contexto Requerido del Usuario

- [ ] Dispositivo físico conectado (iOS o Android)
- [ ] Versión del sistema operativo del dispositivo
- [ ] Duración deseada de la prueba (default: 30 minutos)
- [ ] Tipo de prueba a ejecutar (básica, completa, estrés)

## Análisis Inicial

### Validaciones Pre-ejecución

```json
{
  "validation_passed": true,
  "risks": [
    "Requiere dispositivo físico real",
    "Prueba de larga duración puede afectar batería",
    "Necesita desactivar modo No Molestar"
  ],
  "required_approvals": [],
  "estimated_complexity": "medium",
  "blocking_issues": [
    "No hay dispositivos físicos conectados",
    "El dispositivo está en modo silencio"
  ]
}
```

## Selección de Agentes y Skills

### Fase 1: Configuración de Ambiente

```yaml
responsible: background-execution-expert
accountable: audio-system-specialist
consulted: [ background-execution-config, audio-service-setup ]
informed: [ ]
```

### Fase 2: Ejecución de Pruebas

```yaml
responsible: audio-system-specialist
accountable: background-execution-expert
consulted: [ audio-service-setup, flutter-testing ]
informed: [ ]
```

### Fase 3: Validación de Resultados

```yaml
responsible: debugger-specialist
accountable: flutter-developer
consulted: [ debug-master, flutter-testing ]
informed: [ ]
```

## Flujo de Trabajo Orquestado

### 1. Preparación del Ambiente (background-execution-expert | Validado por audio-system-specialist)

**Objetivo**: Verificar que el dispositivo está listo para ejecutar las pruebas

**Tareas**:

- Verificar que hay un dispositivo físico conectado (no simulador)
- Confirmar que el audio del sistema está activado
- Verificar configuración de background modes en iOS/Android
- Validar que la app tiene permisos necesarios
- Desactivar modo No Molestar si está activo
- Establecer nivel de volumen adecuado (>50%)

**Asignación**:

- **Agente**: background-execution-expert
- **Skills**: `background-execution-config`, `audio-service-setup`
- **Validador**: audio-system-specialist

**Criterios de Salida**:

- [ ] Dispositivo físico detectado y conectado
- [ ] Permisos de audio/background verificados
- [ ] Configuración de UIBackgroundModes (iOS) correcta
- [ ] Foreground service (Android) configurado
- [ ] Nivel de volumen >50%

---

### 2. Ejecución de Pruebas Básicas (audio-system-specialist | Validado por background-execution-expert)

**Objetivo**: Validar funcionalidad básica de audio en condiciones normales

**Tareas**:

- Iniciar sesión de entrenamiento de prueba (5 min)
- Verificar reproducción de todos los tipos de sonidos:
  - `countdown_beep.mp3`
  - `start_exercise.mp3`
  - `end_exercise.mp3`
  - `start_rest.mp3`
  - `end_series.mp3`
  - `training_complete.mp3`
- Confirmar que los sonidos se escuchan claramente
- Validar volumen y claridad de audio
- Verificar sincronización audio-temporizador

**Asignación**:

- **Agente**: audio-system-specialist
- **Skills**: `audio-service-setup`, `flutter-testing`
- **Dependencias**: Fase 1 completada
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Todos los tipos de sonidos reproducidos exitosamente
- [ ] Volumen audible y claro
- [ ] Sincronización audio-timer correcta
- [ ] Sin lag o distorsión en audio

---

### 3. Prueba de Audio con Pantalla Bloqueada (audio-system-specialist | Validado por background-execution-expert)

**Objetivo**: Validar que el audio continúa reproduciéndose con la pantalla bloqueada

**Tareas**:

- Iniciar sesión de entrenamiento de prueba (10 min)
- Bloquear pantalla después de 1 minuto
- Mantener pantalla bloqueada por 5 minutos
- Verificar que los sonidos continúan reproduciéndose
- Desbloquear y verificar que la app sigue activa
- Confirmar que el timer no se ha detenido ni driftado

**Asignación**:

- **Agente**: audio-system-specialist
- **Skills**: `audio-service-setup`, `background-execution-config`
- **Dependencias**: Fase 2 completada
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Audio reproduce correctamente con pantalla bloqueada
- [ ] Timer continúa ejecutándose en background
- [ ] No hay drift de temporización (>5s)
- [ ] App retoma estado correcto al desbloquear

---

### 4. Prueba de Audio en Background (audio-system-specialist | Validado por background-execution-expert)

**Objetivo**: Validar que el audio funciona cuando la app está en background

**Tareas**:

- Iniciar sesión de entrenamiento de prueba (10 min)
- Minimizar la app (presionar home) después de 1 minuto
- Mantener app en background por 5 minutos
- Verificar que los sonidos continúan reproduciéndose
- Reabrir la app y verificar estado
- Confirmar que el timer sigue funcionando correctamente

**Asignación**:

- **Agente**: audio-system-specialist
- **Skills**: `audio-service-setup`, `background-execution-config`
- **Dependencias**: Fase 3 completada
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Audio reproduce correctamente en background
- [ ] Timer continúa ejecutándose
- [ ] App restaura estado correcto al reabrir
- [ ] Notificación de foreground service visible (Android)

---

### 5. Prueba de Interrupciones del Sistema (audio-system-specialist | Validado por background-execution-expert)

**Objetivo**: Validar comportamiento del audio durante interrupciones externas

**Tareas**:

- Iniciar sesión de entrenamiento de prueba
- Simular llamada entrante (usar otro dispositivo)
- Verificar que el audio se pausa correctamente
- Rechazar llamada
- Verificar que el audio se reanuda automáticamente
- Repetir con alarma/recordatorio del sistema
- Verificar recuperación correcta en todos los casos

**Asignación**:

- **Agente**: audio-system-specialist
- **Skills**: `audio-service-setup`, `background-execution-config`
- **Dependencias**: Fase 4 completada
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Audio se pausa al recibir llamada
- [ ] Audio se reanuda al finalizar llamada
- [ ] Timer no pierde precisión durante interrupción
- [ ] Estado de la app se mantiene consistente
- [ ] No hay crashes ni comportamientos inesperados

---

### 6. Prueba de Estrés de Larga Duración (audio-system-specialist | Validado por background-execution-expert)

**Objetivo**: Validar estabilidad del sistema de audio en sesiones prolongadas

**Tareas**:

- Iniciar sesión de entrenamiento de 30 minutos (o duración especificada)
- Monitorear consumo de batería
- Verificar que no hay memory leaks
- Alternar entre pantalla bloqueada/desbloqueada
- Minimizar y reabrir la app múltiples veces
- Verificar estabilidad del audio durante toda la sesión

**Asignación**:

- **Agente**: audio-system-specialist
- **Skills**: `audio-service-setup`, `background-execution-config`, `flutter-testing`
- **Dependencias**: Fase 5 completada
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Audio estable durante 30+ minutos
- [ ] Consumo de batería <3% por 30 minutos
- [ ] Sin incrementos significativos de memoria
- [ ] Timer mantiene precisión (<5s drift total)
- [ ] Sin crashes ni freeze de la app

---

### 7. Análisis y Reporte de Resultados (debugger-specialist | Validado por flutter-developer)

**Objetivo**: Compilar resultados de todas las pruebas y generar reporte detallado

**Tareas**:

- Recopilar resultados de todas las fases
- Calcular cobertura de escenarios validados
- Identificar problemas encontrados (si los hay)
- Medir métricas de rendimiento:
  - Precisión del timer
  - Consumo de batería
  - Uso de memoria
  - Latencia de audio
- Generar reporte en formato Markdown
- Crear checklist de validación
- Recomendar correcciones si se encontraron problemas

**Asignación**:

- **Agente**: debugger-specialist
- **Skills**: `debug-master`, `flutter-testing`
- **Dependencias**: Fase 6 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Reporte detallado generado en `.claude/reports/`
- [ ] Métricas de rendimiento documentadas
- [ ] Lista de problemas encontrados (si aplica)
- [ ] Recomendaciones de corrección (si aplica)
- [ ] Checklist de validación en `.claude/checklists/`

## Uso de otros Commands y MCPs

Este command no invoca otros commands ni utiliza MCPs externos. Trabaja directamente con el sistema de archivos del proyecto y el dispositivo conectado.

## Output y Artefactos

| Artefacto                | Ubicación                                      | Formato    | Validador        | Obligatorio |
|--------------------------|------------------------------------------------|------------|------------------|-------------|
| Reporte de pruebas       | `.claude/reports/audio-background-{timestamp}.md` | Markdown   | -                | Sí          |
| Checklist de validación  | `.claude/checklists/audio-background-{id}.json`  | JSON       | `schema-validator` | Sí          |
| Log de ejecución         | `.claude/logs/test-background-audio-{date}.log` | Plain text | -                | Sí          |
| Métricas de rendimiento  | `.claude/reports/audio-metrics-{timestamp}.json` | JSON       | `schema-validator` | No          |

## Rollback y Cancelación

Si el command falla o el usuario cancela durante la ejecución:

1. Detener sesión de entrenamiento en el dispositivo
2. Desconectar el dispositivo si es necesario
3. Eliminar reportes parciales en `.claude/reports/`
4. Registrar cancelación en `.claude/logs/cancelled-{timestamp}.log`
5. Retornar al estado inicial del proyecto (sin modificaciones)

## Reglas Críticas

- **No modificación de código**: Este command solo ejecuta pruebas y genera reportes
- **Dispositivo físico obligatorio**: Las pruebas no pueden ejecutarse en simuladores
- **Prueba de larga duración**: Las pruebas completas pueden tomar 30+ minutos
- **Validación manual**: Algunos pasos requieren verificación manual en el dispositivo
- **Reporte obligatorio**: Siempre se debe generar un reporte, aunque las pruebas fallen
- **Batería del dispositivo**: Asegurar que el dispositivo tenga suficiente batería (>50%)
- **Ambiente controlado**: Ejecutar pruebas en un lugar silencioso para verificar audio correctamente

---

## Acción del Usuario

Para ejecutar las pruebas de audio en background, especifica:

1. **Duración de la prueba** (opcional, default: 30 minutos)
   - Ejemplo: `--duration=20` para 20 minutos

2. **Dispositivo específico** (opcional, si hay varios conectados)
   - Ejemplo: `--device=iPhone-14-Pro`

3. **Tipo de prueba** (opcional, default: completa)
   - `--type=basic`: Solo pruebas básicas (5 min)
   - `--type=complete`: Todas las pruebas (30 min)
   - `--type=stress`: Solo prueba de estrés (duración especificada)

**Ejemplo de uso**:
```bash
test-background-audio --duration=45 --type=complete
```

**Requisitos previos**:
- Dispositivo físico iOS (iPhone 12+) o Android (Pixel 5+ o Samsung S21+) conectado
- Nivel de volumen del dispositivo >50%
- Modo No Molestar desactivado
- Batería del dispositivo >50%
- Ambiente silencioso para verificar audio correctamente