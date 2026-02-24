---
name: build-release
version: 1.0.0
author: team
description: Comando para ejecutar el build de release de FitPulse Interval Timer para iOS y Android, validando que se cumplan todos los requisitos de calidad antes de generar los artefactos finales
usage: "build-release [--platform=ios|android|both] [--skip-tests]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Build Release

## Objetivo

Ejecutar el proceso completo de build de release para FitPulse Interval Timer, garantizando que:

- Todos los tests pasen (unit, widget, integration)
- El código cumpla con los estándares de calidad (`flutter analyze`)
- La cobertura de tests sea >70%
- Los builds se generen correctamente para las plataformas especificadas
- Los artefactos sean validados y estén listos para distribución

Este comando **NO modifica código**, solo ejecuta el pipeline de build y valida resultados.

## Contexto Requerido del Usuario

- [ ] Plataforma objetivo: `ios`, `android` o `both` (default: `both`)
- [ ] Si se debe omitir la ejecución de tests: `--skip-tests` (default: false, se recomienda NO omitir)
- [ ] Número de versión a release (opcional, se usa del pubspec.yaml si no se proporciona)
- [ ] Notas del release (opcional, para documentación)

## Análisis Inicial (Obligatorio)

Antes de iniciar el build, el comando debe evaluar:

- Estado actual del repositorio (git status)
- Disponibilidad de dispositivos reales conectados (para integration tests)
- Espacio en disco suficiente para los artefactos
- Dependencias actualizadas
- Entorno de Flutter correctamente configurado

### Pre-ejecución: Checklist Obligatorio

El comando debe verificar:

- [ ] ¿Hay cambios sin commit en el working directory? → Advertir y recomendar commit
- [ ] ¿Están las dependencias instaladas? (`flutter pub get`)
- [ ] ¿Pasó `flutter analyze` sin warnings? → Fallar si hay warnings
- [ ] ¿Hay dispositivos conectados para integration tests? → Advertir si no los hay
- [ ] ¿El código está generado con build_runner? → Ejecutar si es necesario

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "risks": [
    "Cambios sin commit en working directory",
    "No hay dispositivo físico conectado para integration tests"
  ],
  "required_approvals": [],
  "estimated_complexity": "medium",
  "blocking_issues": [],
  "environment": {
    "flutter_version": "3.24.0",
    "dart_version": "3.4.0",
    "platform": "macos",
    "connected_devices": ["iPhone 15 Pro", "Pixel 7"]
  }
}
```

## Selección de Agentes y Skills (Framework RACI)

### Fase 1: Preparación del Entorno

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: [ dart-code-generation ]
informed: []
```

**Justificación**: `flutter-developer` tiene expertise en arquitectura Clean Architecture + Riverpod y conoce los requisitos de build del proyecto. `flutter-architect` valida que la configuración sea correcta.

### Fase 2: Ejecución de Tests y Cobertura

```yaml
responsible: flutter-developer
accountable: test-coverage-analyzer
consulted: [ flutter-testing ]
informed: []
```

**Justificación**: `flutter-developer` ejecuta los tests, `test-coverage-analyzer` valida que la cobertura sea >70%, y `flutter-testing` proporciona expertise en testing Flutter.

### Fase 3: Validación de Calidad de Código

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: [ code-reviewer ]
informed: []
```

**Justificación**: `flutter-developer` ejecuta `flutter analyze`, `flutter-architect` valida que cumpla los estándares del proyecto, y `code-reviewer` proporciona criterios de calidad.

### Fase 4: Build de Release

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: []
informed: []
```

**Justificación**: `flutter-developer` ejecuta los comandos de build para iOS y Android, `flutter-architect` valida que los artefactos se generen correctamente.

## Flujo de Trabajo Orquestado

### 1. Preparación del Entorno (flutter-developer | Validado por flutter-architect)

**Objetivo**: Verificar que el entorno esté listo para el build de release

**Tareas**:

- Ejecutar `flutter pub get` para asegurar dependencias actualizadas
- Ejecutar `flutter pub run build_runner build --delete-conflicting-outputs` si hay cambios en código generado
- Verificar espacio en disco disponible (mínimo 5GB libres)
- Validar que `flutter doctor` no reporte errores críticos
- Verificar estado de git (opcionalmente crear tag de versión)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `dart-code-generation`
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Dependencias instaladas correctamente
- [ ] Código generado actualizado (build_runner ejecutado si necesario)
- [ ] Flutter doctor sin errores críticos
- [ ] Espacio en disco suficiente

---

### 2. Ejecución de Tests y Cobertura (flutter-developer | Validado por test-coverage-analyzer)

**Objetivo**: Validar que todos los tests pasen y la cobertura sea >70%

**Tareas**:

- Ejecutar `flutter test --coverage` para todos los tests
- Ejecutar `flutter analyze` para verificar cero warnings
- Generar reporte de cobertura en HTML si está disponible
- Validar que cobertura total >70% (requisito del proyecto)
- Ejecutar integration tests si hay dispositivo real conectado

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `flutter-testing`
- **Validador**: test-coverage-analyzer
- **Dependencias**: Fase 1 completada

**Criterios de Salida**:

- [ ] Todos los tests pasan (0 fallas)
- [ ] `flutter analyze` sin warnings
- [ ] Cobertura de tests >70%
- [ ] Integration tests pasan (si dispositivo disponible)

**Acción si falla**: Abortar build y reportar tests que fallan

---

### 3. Validación de Calidad de Código (flutter-developer | Validado por flutter-architect)

**Objetivo**: Verificar que el código cumpla con los estándares de calidad del proyecto

**Tareas**:

- Ejecutar `dart format . --output=none --set-exit-if-changed` para verificar formato
- Ejecutar `dart analyze --fatal-infos` para validar infos
- Verificar que no haya líneas con `// TODO` o `// FIXME` críticas
- Validar que todos los archivos tengan licencia/cabecera apropiada (si aplica)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer`
- **Validador**: flutter-architect
- **Dependencias**: Fase 2 completada

**Criterios de Salida**:

- [ ] Código formateado correctamente
- [ ] Cero infos de dart analyze
- [ ] No hay TODOs/FIXMEs críticos
- [ ] Licencias de archivo presentes (si aplica)

**Acción si falla**: Abortar build y reportar problemas de calidad

---

### 4. Build de Release iOS (flutter-developer | Validado por flutter-architect)

**Objetivo**: Generar el artefacto de release para iOS

**Tareas**:

- Ejecutar `cd ios && pod install` para actualizar CocoaPods
- Ejecutar `flutter build ios --release`
- Verificar que se genere el .app o .ipa en `build/ios/`
- Validar que el build tenga el número de versión correcto
- Obtener tamaño del artefacto generado

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: N/A
- **Validador**: flutter-architect
- **Dependencias**: Fase 3 completada

**Criterios de Salida**:

- [ ] Build exitoso sin errores
- [ ] Artefacto .app/.ipa generado
- [ ] Versión correcta en el artefacto
- [ ] Tamaño de build razonable (<100MB sin assets de debug)

**Acción si falla**: Reportar error de build y logs de compilación

---

### 5. Build de Release Android (flutter-developer | Validado por flutter-architect)

**Objetivo**: Generar el artefacto de release para Android

**Tareas**:

- Ejecutar `flutter build apk --release` o `flutter build appbundle --release`
- Verificar que se genere el APK/AAB en `build/app/outputs/flutter-apk/`
- Validar que el build tenga el número de versión correcto
- Obtener tamaño del artefacto generado
- Verificar que el APK esté firmado correctamente (release mode)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: N/A
- **Validador**: flutter-architect
- **Dependencias**: Fase 3 completada

**Criterios de Salida**:

- [ ] Build exitoso sin errores
- [ ] Artefacto APK/AAB generado
- [ ] Versión correcta en el artefacto
- [ ] APK firmado con release keystore
- [ ] Tamaño de build razonable (<50MB sin assets de debug)

**Acción si falla**: Reportar error de build y logs de compilación

---

### 6. Validación y Reporte Final (flutter-developer | Validado por flutter-architect)

**Objetivo**: Generar reporte final con resultados del build

**Tareas**:

- Compilar resultados de todas las fases
- Generar resumen de artefactos creados (iOS y Android)
- Documentar tamaño de cada artefacto
- Crear reporte en `.claude/reports/build-release-{timestamp}.md`
- Recomendar pasos siguientes (subida a stores, distribución, etc.)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `technical-writer`
- **Validador**: flutter-architect
- **Dependencias**: Fases 4 y 5 completadas

**Criterios de Salida**:

- [ ] Reporte generado en `.claude/reports/`
- [ ] Información de artefactos completa (rutas, tamaños, versiones)
- [ ] Recomendaciones documentadas
- [ ] Logs de build guardados en `.claude/logs/build-release-{timestamp}.log`

## Uso de otros Commands y MCPs

Este comando no invoca otros commands ni utiliza MCPs específicos del proyecto.

## Output y Artefactos

| Artefacto                      | Ubicación                                              | Formato    | Validador           | Obligatorio |
|--------------------------------|--------------------------------------------------------|------------|---------------------|-------------|
| Reporte de build              | `.claude/reports/build-release-{timestamp}.md`         | Markdown   | -                   | Sí          |
| Log de ejecución              | `.claude/logs/build-release-{timestamp}.log`           | Plain text | -                   | Sí          |
| Artefacto iOS (.app/.ipa)     | `build/ios/`                                           | Binary     | flutter-architect   | Sí (si iOS) |
| Artefacto Android (APK/AAB)   | `build/app/outputs/flutter-apk/` o `appbundle/`        | Binary     | flutter-architect   | Sí (si Android) |
| Reporte de cobertura          | `coverage/html/index.html`                             | HTML       | test-coverage-analyzer | No         |

## Rollback y Cancelación

Si el comando falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener build en curso**: Ejecutar `Ctrl+C` o cancelar proceso de Flutter
2. **Limpiar build parcial**: Ejecutar `flutter clean`
3. **Eliminar artefactos parciales**: Borrar archivos en `build/ios/` y `build/app/outputs/`
4. **Registrar cancelación**: 
   ```
   .claude/logs/build-release-cancelled-{timestamp}.log
   ```
5. **Restaurar estado previo**: Git status para verificar qué cambió

### Estados Finales Posibles

- `completed`: Build exitoso para todas las plataformas solicitadas
- `partial`: Build exitoso para algunas plataformas pero falló en otras
- `failed`: Error en validaciones o en proceso de build
- `cancelled`: Cancelado por usuario
- `skipped_tests`: Build completado pero tests fueron omitidos (no recomendado)

## Reglas Críticas

- **No modificación de código**: Este comando solo ejecuta builds y validaciones
- **Tests obligatorios**: No se debe omitir tests salvo explícitamente con `--skip-tests`
- **Cero warnings tolerados**: `flutter analyze` debe pasar sin warnings
- **Cobertura mínima**: 70% de cobertura es requisito bloqueante
- **Build limpio**: Si falla, ejecutar `flutter clean` antes de reintentar
- **Artefactos versionados**: Usar versión de pubspec.yaml en nombre de archivos si es posible
- **Idempotencia**: Ejecutar múltiples veces debe producir mismos artefactos si código no cambió
- **Logs obligatorios**: Toda ejecución debe generar log en `.claude/logs/`

---

## Acción del Usuario

Para ejecutar el build de release de FitPulse Interval Timer, proporciona:

1. **Plataforma**: ¿iOS, Android o ambos? (default: both)
2. **Omitir tests**: ¿Debes omitir la ejecución de tests? (default: false, NO recomendado)
3. **Versión**: ¿Número de versión específico? (opcional, usa pubspec.yaml si no se proporciona)
4. **Notas**: ¿Notas del release para documentación? (opcional)

**Ejemplos de uso válidos**:

```bash
# Build para ambas plataformas con todos los checks
build-release

# Build solo para Android
build-release --platform=android

# Build rápido omitiendo tests (NO recomendado para producción)
build-release --skip-tests

# Build para iOS con versión específica
build-release --platform=ios --version=1.2.3
```

**Salida esperada**:
- Reporte en `.claude/reports/build-release-{timestamp}.md`
- Artefactos en `build/ios/` y `build/app/outputs/`
- Logs en `.claude/logs/build-release-{timestamp}.log`