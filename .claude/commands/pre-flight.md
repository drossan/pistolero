---
name: pre-flight
version: 1.0.0
author: fitpulse-team
description: Comando de verificación pre-vuelo para FitPulse Interval Timer que valida el estado del proyecto antes de iniciar desarrollo, incluyendo dependencias, configuración de entorno, calidad de código y estado de tests
usage: "pre-flight [--full] [--skip-tests]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Pre-Flight Check

## Objetivo

Ejecutar una validación completa del estado del proyecto FitPulse Interval Timer antes de iniciar cualquier sesión de desarrollo, asegurando que:

- El entorno de desarrollo está correctamente configurado
- Todas las dependencias están instaladas y actualizadas
- El código cumple con los estándares de calidad
- Los tests críticos pasan correctamente
- No hay problemas de configuración que puedan bloquear el desarrollo

**Output**: Reporte detallado del estado del proyecto en `.claude/reports/pre-flight-{timestamp}.md`

**Tipo de comando**: Ejecutable (no modifica código, solo valida y reporta)

---

## Contexto Requerido del Usuario

- [ ] ¿Es una verificación estándar (--flag por defecto) o completa (--full)?
- [ ] ¿Se deben omitir los tests por velocidad? (--skip-tests)
- [ ] ¿Hay áreas específicas de preocupación? (opcional)

---

## Análisis Inicial (Obligatorio)

### Pre-ejecución: Checklist Obligatorio

El command debe verificar:

- [ ] Flutter está instalado y accesible en el PATH
- [ ] El proyecto está en la raíz correcta (existe `pubspec.yaml`)
- [ ] No hay procesos de build corriendo
- [ ] Hay espacio en disco suficiente

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "flutter_version": "3.24.0",
  "dart_version": "3.6.0",
  "project_root_valid": true,
  "blocking_issues": [],
  "warnings": ["Tests omitidos por flag --skip-tests"]
}
```

---

## Selección de Agentes y Skills (Framework RACI)

Este comando orquesta múltiples validaciones usando agentes especializados según el área a verificar.

### Asignación RACI Global

```yaml
pre_flight_coordinator:
  responsible: flutter-orchestrator
  accountable: flutter-architect
  consulted: [debug-master, code-reviewer]
  informed: [technical-writer]
```

### Selección por Fase

#### Fase 1: Validación de Entorno
- **Agente**: flutter-developer - especializado en desarrollo Flutter y configuración de entorno
- **Skills**:
  - `dart-code-generation`: valida configuración de build_runner y codegen
  - `debug-master`: diagnostic problemas de configuración Flutter/Dart

#### Fase 2: Calidad de Código
- **Agente**: flutter-architect - especializado en arquitectura y estándares de calidad
- **Skills**:
  - `code-reviewer`: analiza calidad del código y cumplimiento de patrones
  - `riverpod-state-management`: valida correcta implementación de providers

#### Fase 3: Testing (opcional)
- **Agente**: test-coverage-analyzer - especializado en cobertura y calidad de tests
- **Skills**:
  - `flutter-testing`: ejecuta y valida tests unitarios y widget

#### Fase 4: Configuraciones Críticas
- **Agente**: background-execution-expert - especializado en configuraciones de background
- **Skills**:
  - `background-execution-config`: valida configuración iOS/Android para background
  - `audio-service-setup`: valida configuración de audio y assets

#### Fase 5: Generación de Reporte
- **Agente**: technical-writer - especializado en documentación técnica
- **Skills**:
  - `technical-writer`: genera reporte estructurado y claro

---

## Flujo de Trabajo Orquestado

### 1. Validación de Entorno Flutter (flutter-developer | Validado por flutter-architect)

**Objetivo**: Verificar que el entorno de desarrollo está correctamente configurado

**Tareas**:

- Ejecutar `flutter doctor` y verificar que no haya errores críticos
- Validar versión de Flutter y Dart contra requisitos del proyecto
- Verificar que dispositivos/simuladores están disponibles
- Comprobar espacio en disco disponible
- Validar que todas las herramientas CLI necesarias están instaladas

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `dart-code-generation`, `debug-master`
- **MCPs**: Ninguno
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] `flutter doctor` sin errores críticos (warnings permitidos)
- [ ] Versión de Flutter ≥ 3.24.0
- [ ] Versión de Dart ≥ 3.6.0
- [ ] Al menos un dispositivo disponible
- [ ] Espacio en disco > 5GB

**Output esperado**:

```json
{
  "phase": "environment",
  "status": "passed",
  "flutter_version": "3.24.5",
  "dart_version": "3.6.1",
  "devices_available": 2,
  "disk_space": "45GB",
  "issues": []
}
```

---

### 2. Validación de Dependencias (flutter-developer | Validado por flutter-architect)

**Objetivo**: Asegurar que todas las dependencias están instaladas y sincronizadas

**Tareas**:

- Ejecutar `flutter pub get` y verificar que no haya errores
- Validar que no hay dependencias desactualizadas críticas
- Verificar que `build_runner` está configurado correctamente
- Comprobar que no hay conflictos de versión
- Validar que los assets de audio existen en las rutas correctas

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `dart-code-generation`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] `flutter pub get` ejecutado sin errores
- [ ] Todas las dependencias resueltas
- [ ] Assets de audio presentes (`assets/sounds/`)
- [ ] No hay conflictos de versión

**Output esperado**:

```json
{
  "phase": "dependencies",
  "status": "passed",
  "dependencies_count": 42,
  "outdated_packages": [],
  "assets_verified": true,
  "issues": []
}
```

---

### 3. Análisis de Calidad de Código (flutter-architect | Validado por flutter-architect)

**Objetivo**: Verificar que el código cumple con los estándares de calidad del proyecto

**Tareas**:

- Ejecutar `flutter analyze` y verificar cero warnings
- Verificar formato del código con `dart format --output=none --set-exit-if-changed .`
- Validar que no hay problemas de linting críticos
- Revisar cumplimiento de Clean Architecture en archivos nuevos/modificados
- Verificar uso correcto de Riverpod (no llamadas directas a providers)

**Asignación**:

- **Agente**: flutter-architect
- **Skills**: `code-reviewer`, `riverpod-state-management`
- **Dependencias**: Fase 2 completada
- **Validador**: flutter-architect (auto-validación)

**Criterios de Salida**:

- [ ] `flutter analyze` con 0 issues
- [ ] Código correctamente formateado
- [ ] Sin violaciones de Clean Architecture
- [ ] Uso correcto de Riverpod (ref.watch/ref.read)
- [ ] No hay imports relativos prohibidos

**Output esperado**:

```json
{
  "phase": "code_quality",
  "status": "passed",
  "analyze_issues": 0,
  "format_issues": 0,
  "architecture_violations": 0,
  "riverpod_issues": 0,
  "issues": []
}
```

---

### 4. Validación de Tests (test-coverage-analyzer | Validado por flutter-architect) **[OPCIONAL]**

**Objetivo**: Verificar que los tests críticos pasan y la cobertura es aceptable

**Tareas**:

- Ejecutar tests unitarios con `flutter test --coverage`
- Verificar que tests de servicios críticos pasan (TimerService, AudioService, RoutineRepository)
- Validar cobertura mínima del 70% en módulos críticos
- Identificar tests que están fallando o skippeados
- Verificar tests de precisión del timer (drift compensation)

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `flutter-testing`, `timer-drift-compensation`
- **Dependencias**: Fase 3 completada
- **Validador**: flutter-architect
- **Skip condition**: Flag `--skip-tests` presente

**Criterios de Salida**:

- [ ] Todos los tests unitarios pasan
- [ ] Cobertura > 70% en servicios críticos
- [ ] Tests de TimerService verifican precisión <5s drift
- [ ] Tests de AudioService validan precarga de sonidos
- [ ] No tests con `@Skip` sin explicación

**Output esperado**:

```json
{
  "phase": "testing",
  "status": "passed",
  "tests_run": 127,
  "tests_passed": 127,
  "tests_failed": 0,
  "coverage_percentage": 73.5,
  "critical_modules_covered": ["TimerService", "AudioService", "RoutineRepository"],
  "issues": []
}
```

---

### 5. Validación de Configuraciones Críticas (background-execution-expert | Validado por flutter-architect)

**Objetivo**: Asegurar que las configuraciones de platform para background execution son correctas

**Tareas**:

- **iOS**: Verificar `Info.plist` tiene `UIBackgroundModes` con `audio`
- **Android**: Verificar `AndroidManifest.xml` tiene `FOREGROUND_SERVICE` permission
- **Android**: Validar configuración de foreground service en código
- **Audio**: Verificar que todos los archivos de audio existen
- **Assets**: Validar que `pubspec.yaml` declara correctamente los assets

**Asignación**:

- **Agente**: background-execution-expert
- **Skills**: `background-execution-config`, `audio-service-setup`
- **Dependencias**: Fase 4 completada (o Fase 3 si tests omitidos)
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] iOS `Info.plist` configura `UIBackgroundModes` → `audio`
- [ ] Android `AndroidManifest.xml` tiene `FOREGROUND_SERVICE`
- [ ] Todos los archivos de audio existen en `assets/sounds/`
- [ ] `pubspec.yaml` declara assets correctamente
- [ ] Configuración de AudioSession está presente en el código

**Output esperado**:

```json
{
  "phase": "platform_config",
  "status": "passed",
  "ios_background_audio": true,
  "android_foreground_service": true,
  "audio_assets_count": 6,
  "audio_assets_valid": [
    "countdown_beep.mp3",
    "start_exercise.mp3",
    "end_exercise.mp3",
    "start_rest.mp3",
    "end_series.mp3",
    "training_complete.mp3"
  ],
  "issues": []
}
```

---

### 6. Generación de Reporte (technical-writer | Validado por flutter-orchestrator)

**Objetivo**: Generar un reporte comprensible del estado del proyecto

**Tareas**:

- Compilar resultados de todas las fases
- Generar reporte en Markdown con secciones claras
- Incluir recomendaciones accionables si hay problemas
- Calificar estado general: `✅ Passed`, `⚠️ Warnings`, `❌ Failed`
- Guardar reporte en `.claude/reports/pre-flight-{timestamp}.md`

**Asignación**:

- **Agente**: technical-writer
- **Skills**: `technical-writer`
- **Dependencias**: Todas las fases anteriores completadas
- **Validador**: flutter-orchestrator

**Criterios de Salida**:

- [ ] Reporte generado en ubicación correcta
- [ ] Todas las fases documentadas
- [ ] Recomendaciones claras si aplica
- [ ] Formato Markdown válido
- [ ] Timestamp incluido en nombre de archivo

**Output esperado**:

Archivo: `.claude/reports/pre-flight-20250120-143022.md`

```markdown
# Pre-Flight Check Report

**Timestamp**: 2025-01-20 14:30:22  
**Project**: FitPulse Interval Timer  
**Overall Status**: ✅ PASSED

## Executive Summary

All critical checks passed. The project is ready for development.

---

## 1. Environment Validation

✅ **PASSED**

- Flutter Version: 3.24.5
- Dart Version: 3.6.1
- Devices Available: 2 (iPhone 15 Pro, Pixel 7)
- Disk Space: 45GB

---

## 2. Dependencies

✅ **PASSED**

- All dependencies installed
- No outdated packages
- Audio assets verified

---

## 3. Code Quality

✅ **PASSED**

- `flutter analyze`: 0 issues
- Code formatted: Yes
- Architecture violations: 0
- Riverpod issues: 0

---

## 4. Testing

✅ **PASSED**

- Tests run: 127
- Tests passed: 127
- Coverage: 73.5%
- Critical modules: TimerService ✅, AudioService ✅, RoutineRepository ✅

---

## 5. Platform Configuration

✅ **PASSED**

- iOS Background Audio: ✅ Configured
- Android Foreground Service: ✅ Configured
- Audio Assets: 6/6 present

---

## Recommendations

No critical issues found. You can proceed with development.

---

## Next Steps

1. Start your feature branch from `develop`
2. Follow TDD workflow
3. Test on REAL devices (iOS + Android)
4. Ensure background audio works before committing
```

---

## Uso de otros Commands y MCPs

Este comando es autocontenido y no invoca otros commands ni MCPs externos.

**MCPs del proyecto utilizados**:
- Ninguno (solo herramientas CLI de Flutter/Dart)

---

## Output y Artefactos

| Artefacto               | Ubicación                                    | Formato  | Validador        | Obligatorio |
|-------------------------|----------------------------------------------|----------|------------------|-------------|
| Reporte Pre-Flight      | `.claude/reports/pre-flight-{timestamp}.md`  | Markdown | technical-writer | Sí          |
| Log de Validación       | `.claude/logs/pre-flight-{date}.log`         | Text     | -                | Sí          |
| JSON de Resultados      | `.claude/reports/pre-flight-{timestamp}.json`| JSON     | -                | No          |

---

## Rollback y Cancelación

Si el comando falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener fase actual**: Abortar la validación en curso
2. **Limpiar artefactos parciales**:
   - Borrar reporte incompleto en `.claude/reports/`
   - Eliminar logs parciales en `.claude/logs/`
3. **Reportar estado actual**: Mostrar qué fases completaron exitosamente
4. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-pre-flight-{timestamp}.log
   ```

### Estados Finales Posibles

- `✅ passed`: Todas las validaciones exitosas
- `⚠️ warnings`: Validaciones pasaron con advertencias no críticas
- `❌ failed`: Una o más validaciones críticas fallaron
- `🚫 cancelled`: Cancelado por usuario durante ejecución

---

## Reglas Críticas

- **No modificación de código**: Este comando solo valida, nunca modifica archivos
- **Ejecución no destructiva**: Todas las validaciones son read-only
- **Tests opcionales**: Respetar flag `--skip-tests` para ejecución rápida
- **Reporte obligatorio**: Siempre generar reporte, incluso si falla
- **Cero warnings en analyze**: El estándar del proyecto es `flutter analyze` sin issues
- **Validación de assets críticos**: Los archivos de audio son obligatorios para el funcionamiento
- **Idempotencia**: Ejecutar múltiples veces produce el mismo resultado
- **Fail-fast**: Detener ejecución si una fase crítica falla

---

## Flags y Opciones

### `--full`
Ejecuta validación completa incluyendo:
- Tests de integración (requieren dispositivo real conectado)
- Verificación de builds en debug mode
- Análisis de rendimiento del código
- Validación de tamaño de APK/IPA

### `--skip-tests`
Omite la ejecución de tests para validación rápida.
Útil para pre-flight antes de commits pequeños o durante desarrollo activo.

**Advertencia**: No usar `--skip-tests` antes de merges a `develop` o releases.

---

## Ejemplos de Uso

### Pre-flight estándar (antes de empezar a trabajar)
```bash
/pre-flight
```
Ejecuta validaciones de entorno, dependencias, calidad y config crítica.
Duración estimada: ~2 minutos.

### Pre-flight rápido (skip tests)
```bash
/pre-flight --skip-tests
```
Omite tests para validación más rápida.
Duración estimada: ~30 segundos.

### Pre-flight completo (antes de release)
```bash
/pre-flight --full
```
Validación exhaustiva incluyendo tests de integración en dispositivos reales.
Duración estimada: ~10 minutos.

---

## Métricas de Éxito

| Métrica                       | Umbral                     |
|-------------------------------|----------------------------|
| Tiempo de ejecución estándar  | < 3 minutos                |
| Tiempo de ejecución rápido    | < 45 segundos              |
| Falsos positivos              | < 5%                       |
- Tiempo de ejecución completo | < 15 minutos               |
| Detección de problemas reales | > 95%                      |

---

## Troubleshooting Común

### Flutter doctor falla
**Problema**: `flutter doctor` muestra errores críticos  
**Solución**: Seguir instrucciones de `flutter doctor` para instalar dependencias faltantes

### Tests fallan
**Problema**: Tests de TimerService o AudioService fallan  
**Solución**: Ejecutar tests individualmente para ver stack traces:
```bash
flutter test test/services/timer_service_test.dart
```

### Audio assets no encontrados
**Problema**: Validación de assets falla  
**Solución**: Verificar que `assets/sounds/` contiene los 6 archivos MP3 requeridos y que están declarados en `pubspec.yaml`

### Code formatting issues
**Problema**: `dart format` reporta archivos mal formateados  
**Solución**: Ejecutar `dart format .` para formatear todo el código automáticamente

---

## Acción del Usuario

Ejecuta `/pre-flight` para validar el estado del proyecto antes de iniciar desarrollo.

**Opciones**:

- Sin flags: Validación estándar (recomendado antes de cada sesión)
- `--skip-tests`: Validación rápida (omite tests)
- `--full`: Validación completa (incluye integración en dispositivos)

**Ejemplo**:
```
/pre-flight
```

El comando generará un reporte detallado en `.claude/reports/pre-flight-{timestamp}.md` con el estado actual del proyecto y recomendaciones si aplica.