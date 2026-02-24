---
name: battery-optimization-check
version: 1.0.0
author: platform-team
description: Comando para analizar y validar el consumo de batería de FitPulse Interval Timer, verificando que la app cumpla con el estándar de <2% consumo por sesión de 30 minutos según especificaciones del proyecto
usage: "battery-optimization-check [--duration=30] [--real-device]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Battery Optimization Check

## Objetivo

Analizar y validar el consumo de batería de FitPulse Interval Timer para asegurar que la aplicación cumpla con el estándar de calidad **no negocialbe de <2% de consumo por sesión de 30 minutos** establecido en las especificaciones del proyecto.

Este comando:

- Ejecuta pruebas de consumo de batería en dispositivos reales
- Analiza servicios que afectan el consumo (timer, audio, background execution)
- Identifica fugas de energía o patrones ineficientes
- Genera reporte detallado con métricas y recomendaciones
- Verifica que el audio en background, timer preciso y notificaciones no impacten excesivamente la batería

**No modifica código**, solo ejecuta análisis y reporta resultados.

## Contexto Requerido del Usuario

- [ ] Dispositivo real conectado (iOS o Android) - **simuladores NO son válidos**
- [ ] Duración deseada de la prueba (default: 30 minutos)
- [ ] Nivel de batería inicial del dispositivo (>50% recomendado)
- [ ] Tipo de prueba a ejecutar:
  - Timer con audio activado (escenario real de entrenamiento)
  - Timer con pantalla bloqueada (background execution)
  - Timer en modo suspensión (pausa)
  - Todas las anteriores (prueba completa)

## Análisis Inicial (Obligatorio)

Antes de cualquier acción, el command debe evaluar:

- Disponibilidad de dispositivo real conectado
- Nivel de batería suficiente para prueba prolongada
- Estado de los servicios críticos (AudioService, TimerService, BackgroundService)
- Existencia de implementación de timer con DateTime (no Timer.periodic simple)
- Configuración de background modes en iOS/Android
- Condiciones del entorno (brillo de pantalla, network, GPS)

### Pre-ejecución: Checklist Obligatorio

El command debe verificar:

- [ ] ¿Hay dispositivo real conectado? → Abortar si es solo simulador
- [ ] ¿Batería del dispositivo >50%? → Solicitar carga si es menor
- [ ] ¿Timer implementado con DateTime differences? → Reportar warning si usa countdown simple
- [ ] ¿Audio preload configurado? → Verificar carga de sonidos al inicio
- [ ] ¿Background modes configurados en Info.plist y AndroidManifest? → Reportar missing config
- [ ] ¿Permisos de notificaciones concedidos? → Solicitar si no están concedidos

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "device_info": {
    "platform": "android",
    "model": "Pixel 5",
    "battery_level": 87,
    "is_real_device": true
  },
  "risks": [
    "Pantalla con brillo al 100% puede afectar mediciones",
    "Conexión WiFi activa durante prueba"
  ],
  "recommendations": [
    "Reducir brillo de pantalla al 50%",
    "Activar modo avión para aislar consumo de la app"
  ],
  "blocking_issues": []
}
```

## Selección de Agentes y Skills (Framework RACI)

El comando debe **elegir explícitamente** los agentes y skills más adecuados utilizando el modelo RACI:

- **R** (Responsible): Agente que ejecuta la tarea
- **A** (Accountable): Agente que valida y aprueba
- **C** (Consulted): Skills/MCPs necesarios como soporte
- **I** (Informed): Commands que deben ser notificados

### Criterios de Selección

| Criterio                          | Peso  | Agentes Candidatos                          |
|-----------------------------------|-------|---------------------------------------------|
| Análisis de rendimiento móvil     | Alta  | `performance-optimizer`                     |
| Ejecución de background y audio   | Alta  | `background-execution-expert`               |
| Servicios críticos (timer/audio)  | Alta  | `audio-system-specialist`                   |
| Validación de arquitectura        | Media | `flutter-architect`                         |
| Análisis sistemático              | Alta  | `debugger-specialist`                       |

### Ejemplo de Asignación RACI

```yaml
fase_1_validacion:
  responsible: performance-optimizer
  accountable: flutter-architect
  consulted: [debug-master, code-reviewer]
  informed: [flutter-orchestrator]

fase_2_analisis_consumo:
  responsible: performance-optimizer
  accountable: background-execution-expert
  consulted: [audio-service-setup, background-execution-config]
  informed: [test-coverage-analyzer]

fase_3_reporte:
  responsible: technical-writer
  accountable: performance-optimizer
  consulted: [code-reviewer]
  informed: [flutter-orchestrator]
```

## Flujo de Trabajo Orquestado

### 1. Validación de Entorno de Prueba (performance-optimizer | Validado por flutter-architect)

**Objetivo**: Verificar que el dispositivo y configuración son adecuados para medición precisa

**Tareas**:

- Verificar que se use dispositivo real (no simulador)
- Medir nivel de batería inicial
- Verificar configuración de background modes (iOS Info.plist, Android AndroidManifest.xml)
- Confirmar que AudioSession está configurado correctamente
- Validar que TimerService usa DateTime differences para compensación de drift
- Verificar precarga de sonidos en AudioService

**Asignación**:

- **Agente**: performance-optimizer
- **Skills**: `debug-master` (para diagnóstico de configuración), `code-reviewer` (para validar patrones de código)
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Dispositivo real detectado y conectado
- [ ] Nivel de batería >50%
- [ ] Background modes configurados correctamente
- [ ] Timer usa compensación de drift con DateTime
- [ ] Sonidos precargados correctamente

---

### 2. Análisis de Consumo por Servicios (performance-optimizer | Validado por background-execution-expert)

**Objetivo**: Medir consumo de batería por cada servicio crítico durante sesión de entrenamiento

**Tareas**:

- Iniciar sesión de entrenamiento de 30 minutos con audio activado
- Monitorear consumo durante:
  - Fase de trabajo con audio (countdown, start_exercise, end_exercise)
  - Fase de descanso con audio (start_rest, end_series)
  - Pantalla bloqueada con audio en background
  - Modo suspensión (pausa)
- Medir consumo de:
  - TimerService (frecuencia de actualizaciones, drift compensation overhead)
  - AudioService (preload vs streaming, volumen de salida)
  - BackgroundService (foreground service cost en Android)
- Identificar picos de consumo y correlacionar con eventos

**Asignación**:

- **Agente**: performance-optimizer
- **Skills**: 
  - `audio-service-setup` (para validar configuración óptima de audio)
  - `background-execution-config` (para verificar uso eficiente de foreground service)
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Medición de consumo completa (30 minutos)
- [ ] Desglose de consumo por servicio
- [ ] Identificación de patrones ineficientes
- [ ] Correlación de picos con eventos específicos

---

### 3. Detección de Fugas de Energía (performance-optimizer | Validado por debugger-specialist)

**Objetivo**: Identificar fugas de energía, memory leaks o patrones que causen consumo excesivo

**Tareas**:

- Analizar uso de memoria durante la sesión
- Detectar timers no liberados o listeners no removidos
- Verificar que AudioPlayer se libere correctamente
- Buscar actualizaciones de UI innecesarias (setState excesivo)
- Revisar que Streams y Subscriptions se cancelen apropiadamente
- Identificar uso excesivo de CPU por operaciones síncronas en main thread

**Asignación**:

- **Agente**: performance-optimizer
- **Skills**: 
  - `debug-master` (para análisis sistemático de fugas)
  - `code-reviewer` (para identificar patrones problemáticos en código)
- **Validador**: debugger-specialist

**Criterios de Salida**:

- [ ] Análisis de memoria completado
- [ ] Fugas identificadas (si existen)
- [ ] Patrones problemáticos documentados
- [ ] Recomendaciones específicas de corrección

---

### 4. Validación Contra Especificaciones del Proyecto (flutter-architect | Validado por background-execution-expert)

**Objetivo**: Verificar que el consumo cumpla con el estándar de <2% por 30 minutos

**Tareas**:

- Calcular porcentaje de batería consumida
- Comparar contra límite de 2% (6.67% por hora)
- Validar que el timer mantenga precisión (<5s drift en 30 min)
- Verificar que audio funcione correctamente en background
- Confirmar que foreground service no cause penalización excesiva
- Validar que la suspensión (pausa) reduzca consumo significativamente

**Asignación**:

- **Agente**: flutter-architect
- **Skills**: 
  - `timer-drift-compensation` (para validar precisión del timer)
  - `audio-service-setup` (para verificar que audio no impacte batería)
  - `background-execution-config` (para validar overhead de background execution)
- **Validador**: background-execution-expert

**Criterios de Salida**:

- [ ] Consumo total <2% por 30 minutos ✅ o ❌
- [ ] Drift del timer <5 segundos ✅ o ❌
- [ ] Audio funciona en background ✅ o ❌
- [ ] Suspensión reduce consumo >50% ✅ o ❌

---

### 5. Generación de Reporte (technical-writer | Validado por performance-optimizer)

**Objetivo**: Generar reporte detallado con métricas, análisis y recomendaciones

**Tareas**:

- Documentar métricas de consumo (inicial vs final, porcentaje, tasa por hora)
- Incluir desglose por servicio (TimerService, AudioService, BackgroundService)
- Listar fugas o problemas detectados
- Proporcionar recomendaciones específicas de optimización
- Incluir gráficos de consumo a lo largo del tiempo
- Comparar con estándares de la industria
- Generar checklist de validación futura

**Asignación**:

- **Agente**: technical-writer
- **Skills**: `code-reviewer` (para validar que recomendaciones sean técnicas y accionables)
- **Validador**: performance-optimizer

**Criterios de Salida**:

- [ ] Reporte en Markdown en `.claude/reports/battery-optimization-{timestamp}.md`
- [ ] Métricas claras y comparables
- [ ] Recomendaciones priorizadas (críticas, altas, medias, bajas)
- [ ] Checklists para validaciones futuras

## Uso de otros Commands y MCPs

Este comando no invoca otros commands ni utiliza MCPs externos. Todo el análisis se realiza mediante:

- Lectura de archivos de configuración (pubspec.yaml, Info.plist, AndroidManifest.xml)
- Análisis estático de código (TimerService, AudioService, BackgroundService)
- Ejecución de pruebas en dispositivo real conectado
- Generación de reporte basado en métricas recolectadas

**Contexto requerido**:

```yaml
archivos_leidos:
  - lib/services/timer_service.dart
  - lib/services/audio_service.dart
  - lib/services/background_service.dart
  - ios/Runner/Info.plist
  - android/app/src/main/AndroidManifest.xml
  - pubspec.yaml

artefactos_generados:
  - location: .claude/reports/battery-optimization-{timestamp}.md
    format: Markdown
    contains: [métricas, desglose por servicio, recomendaciones, gráficos]
```

## Output y Artefactos

| Artefacto                | Ubicación                                     | Formato    | Validador          | Obligatorio |
|--------------------------|-----------------------------------------------|------------|--------------------|-------------|
| Reporte de optimización  | `.claude/reports/battery-optimization-{timestamp}.md` | Markdown   | -                  | Sí          |
| Métricas JSON            | `.claude/reports/battery-metrics-{timestamp}.json` | JSON       | `schema-validator` | Sí          |
| Log de ejecución         | `.claude/logs/battery-check-{date}.log`       | Plain text | -                  | Sí          |

### Estructura del Reporte

```markdown
# Battery Optimization Report - FitPulse Interval Timer

## Resumen Ejecutivo
- Consumo total: X% (Y% por hora)
- Estado: ✅ PASA / ❌ FALLA estándar de <2% por 30 min
- Dispositivo: [Modelo, Plataforma, Versión OS]
- Duración de prueba: 30 minutos

## Métricas Detalladas

### Consumo por Servicio
| Servicio      | Consumo | % del Total | Estado |
|---------------|---------|-------------|--------|
| TimerService  | 0.8%    | 40%         | ✅     |
| AudioService  | 0.6%    | 30%         | ✅     |
| Background    | 0.4%    | 20%         | ✅     |
| UI/Rendering  | 0.2%    | 10%         | ✅     |
| **TOTAL**     | **2.0%**| **100%**    | **⚠️** |

### Desglose por Fase
- Fase de trabajo con audio: 0.9%
- Fase de descanso con audio: 0.7%
- Pantalla bloqueada: 0.3%
- Modo suspensión: 0.1%

## Problemas Detectados

### Críticos
- [ ] Timer usa Timer.periodic simple (causa drift y wakeups innecesarios)
  - Impacto: +0.5% consumo extra
  - Recomendación: Migrar a DateTime-based drift compensation

### Altos
- [ ] AudioService no preload todos los sonidos al inicio
  - Impacto: +0.3% consumo por carga lazy
  - Recomendación: Implementar preload completo en initialize()

## Recomendaciones

1. **Implementar DateTime-based timer** (Crítica)
   - Reemplazar `Timer.periodic` simple por DateTime differences
   - Reducción estimada: -0.5% consumo

2. **Preload completo de sonidos** (Alta)
   - Cargar todos los AudioSource en AudioService.initialize()
   - Reducción estimada: -0.3% consumo

3. **Optimizar frecuencia de actualizaciones UI** (Media)
   - Reducir setState de 100ms a 500ms para display del timer
   - Reducción estimada: -0.1% consumo

## Validación de Precisión

- Drift del timer: 3.2 segundos en 30 min (✅ <5s requerido)
- Audio en background: Funciona correctamente (✅)
- Suspensión reduce consumo: 75% (✅ >50% requerido)

## Checklist para Próximas Validaciones

- [ ] Ejecutar en dispositivo iOS (actual solo Android)
- [ ] Probar con duración de 60 minutos
- [ ] Medir impacto de diferentes niveles de volumen
- [ ] Validar con múltiples rutinas de ejercicios
```

## Rollback y Cancelación

Si el command falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener pruebas en curso**: Enviar señal de cancelación a dispositivo
2. **Eliminar reportes parciales**: Borrar archivos incompletos en `.claude/reports/`
3. **Limpiar logs temporales**: Eliminar logs de ejecución parcial
4. **Desconectar dispositivo de prueba**: Liberar recursos
5. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-battery-check-{timestamp}.log
   ```
6. **Restaurar estado previo**: No hay cambios en código, por lo que no es necesario revertir

### Estados Finales Posibles

- `completed`: Prueba completada, reporte generado
- `failed`: Error durante ejecución (dispositivo desconectado, batería insuficiente)
- `cancelled`: Cancelado por usuario durante prueba
- `invalid`: Validación inicial falló (no hay dispositivo real, batería <50%)

## Reglas Críticas

- **Solo dispositivo real**: Simuladores NO son válidos para pruebas de batería
- **No modificación de código**: Este command solo analiza y reporta
- **Batería suficiente**: Requiere >50% para pruebas de 30 minutos
- **Timer DateTime-based**: Reportar warning si usa countdown simple (causa drift y wakeups)
- **Audio preload obligatorio**: Verificar que sonidos se cargan al inicio
- **Background modes configurados**: Validar Info.plist y AndroidManifest.xml
- **Estándar <2%**: Este requisito es NO NEGOCIABLE según especificaciones del proyecto
- **Reporte obligatorio**: Siempre generar reporte detallado con métricas

---

## Acción del Usuario

Para ejecutar la prueba de optimización de batería, conecta un dispositivo real (iOS o Android) y proporciona:

1. **Duración de la prueba**: (default: 30 minutos)
   - 15 minutos (prueba rápida)
   - 30 minutos (estándar del proyecto)
   - 60 minutos (prueba extendida)

2. **Tipo de prueba**:
   - `complete`: Incluye todas las fases (trabajo, descanso, background, suspensión)
   - `background-only`: Solo prueba con pantalla bloqueada
   - `suspension-test`: Valida reducción de consumo en pausa

3. **Condiciones del entorno** (opcional):
   - Brillo de pantalla (recomendado: 50%)
   - Modo avión (recomendado: sí, para aislar consumo de la app)
   - Nivel de batería inicial (requerido: >50%)

**Ejemplo de solicitud válida**:
> "Ejecuta battery-optimization-check con duración de 30 minutos, prueba completa, en mi Pixel 5 conectado. Brillo al 50%, modo avión activado. Nivel de batería actual: 87%."

**Ejemplo con flags**:
> `battery-optimization-check --duration=30 --type=complete --brightness=50 --airplane-mode=true`