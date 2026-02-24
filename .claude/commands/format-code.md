---
name: format-code
version: 1.0.0
author: fitpulse-dev-team
description: Comando para formatear todo el código del proyecto FitPulse Interval Timer según los estándares de Dart/Flutter, verificando calidad y generando reportes de cambios
usage: "format-code [--fix] [--dry-run] [--verbose]"
type: executable
writes_code: true
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Format Code

## Objetivo

Ejecutar el formateo de código del proyecto FitPulse Interval Timer utilizando las herramientas oficiales de Dart (`dart format`), asegurando que todo el código cumpla con los estándares de estilo del lenguaje.

Este comando:

- Formatea todos los archivos `.dart` del proyecto
- Aplica las convenciones de estilo de Dart automáticamente
- Genera un reporte de archivos modificados
- Valida que el formateo no introduzca errores sintácticos
- Es idempotente: ejecutarlo múltiples veces produce el mismo resultado

**No genera planes** ni requiere aprobación, es una operación de bajo riesgo que mantiene la calidad del código.

## Contexto Requerido del Usuario

Ninguno. Este comando puede ejecutarse en cualquier momento sin necesidad de contexto adicional.

Opcionales:
- [ ] `--fix`: Aplica automáticamente las correcciones de formato (default: true)
- [ ] `--dry-run`: Solo muestra qué archivos serían formateados sin modificarlos
- [ ] `--verbose`: Muestra salida detallada del proceso de formateo

## Análisis Inicial (Obligatorio)

Antes de cualquier acción, el comando debe evaluar:

- Estado actual del repositorio (archivos modificados sin commit)
- Existencia de archivos `.dart` en el proyecto
- Disponibilidad de las herramientas de formateo de Dart
- Espacio en disco para los archivos formateados

### Pre-ejecución: Checklist Obligatorio

El comando debe verificar:

- [ ] ¿Existe el archivo `pubspec.yaml`? → Confirmar que es un proyecto Flutter
- [ ] ¿Hay archivos `.dart` sin formatear? → Continuar con formateo
- [ ] ¿Hay cambios sin commit en el working directory? → Advertir al usuario
- [ ] ¿Están las dependencias instaladas (`flutter pub get`)? → Ejecutar si es necesario
- [ ] ¿El comando `dart format` está disponible? → Fallar si no

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "dart_files_found": 47,
  "unformatted_files": 12,
  "warnings": ["Hay 3 archivos modificados sin commit"],
  "blocking_issues": []
}
```

## Selección de Agentes y Skills

El comando **flutter-developer** es el agente responsable de ejecutar el formateo de código, ya que su descripción indica que es un "Senior Flutter Developer especializado en razonamiento sobre arquitectura Clean Architecture + Riverpod y desarrollo de apps móviles de alta confiabilidad", lo cual incluye mantener los estándares de código.

### Framework RACI

```yaml
fase_1_validacion:
  responsible: flutter-developer
  accountable: flutter-developer
  consulted: [ code-reviewer ]
  informed: []

fase_2_formateo:
  responsible: flutter-developer
  accountable: flutter-developer
  consulted: [ code-reviewer ]
  informed: []

fase_3_verificacion:
  responsible: flutter-developer
  accountable: flutter-developer
  consulted: [ code-reviewer ]
  informed: []
```

### Criterios de Selección

| Criterio                          | Selección                        |
|-----------------------------------|----------------------------------|
| Conocimiento de Dart/Flutter      | `flutter-developer`              |
| Comprensión de estándares de código| `flutter-developer`              |
| Validación de calidad             | `code-reviewer` (skill)          |

**Justificación**: El agente `flutter-developer` tiene la expertise necesaria para ejecutar el formateo correctamente y validar que no se introduzcan problemas. El skill `code-reviewer` proporciona la capacidad de verificar que el formateo mantiene la calidad del código.

## Flujo de Trabajo Orquestado

### 1. Validación del Entorno (flutter-developer | Validado por flutter-developer)

**Objetivo**: Verificar que el proyecto está listo para ser formateado

**Tareas**:

- Verificar que el comando `dart format` está disponible en el PATH
- Confirmar que existe el archivo `pubspec.yaml` en la raíz del proyecto
- Ejecutar `flutter pub get` si las dependencias no están instaladas
- Contar el número total de archivos `.dart` en el proyecto
- Detectar si hay archivos modificados sin commit en el working directory

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer`
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] El comando `dart format --version` ejecuta exitosamente
- [ ] Se encontró al menos 1 archivo `.dart` en el proyecto
- [ ] Las dependencias de Flutter están instaladas
- [ ] Se generó un reporte inicial con el estado del proyecto

---

### 2. Ejecución del Formateo (flutter-developer | Validado por flutter-developer)

**Objetivo**: Aplicar el formateo de Dart a todos los archivos del proyecto

**Tareas**:

- Ejecutar `dart format .` para formatear todos los archivos `.dart` recursivamente
- Capturar la salida del comando para identificar archivos modificados
- Si se usa `--dry-run`, ejecutar `dart format --output=none --set-exit-if-changed .`
- Si se usa `--verbose`, incluir la salida completa del comando
- Contar el número de archivos que fueron modificados

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] El comando `dart format` se ejecutó sin errores
- [ ] Se generó un reporte con la lista de archivos formateados
- [ ] Se contabilizó el número total de archivos modificados

---

### 3. Verificación y Reporte (flutter-developer | Validado por flutter-developer)

**Objetivo**: Validar que el formateo no introdujo errores y generar un reporte final

**Tareas**:

- Ejecutar `dart analyze` para verificar que no hay errores de linting
- Verificar que los archivos formateados compilen correctamente (opcional: `flutter build apk --debug --dry-run`)
- Generar un reporte en `.claude/reports/format-code-{timestamp}.md` con:
  - Número total de archivos analizados
  - Número de archivos formateados
  - Lista de archivos modificados (si `--verbose`)
  - Estado de validación (`dart analyze`)
  - Duración del proceso
- Mostrar un resumen en consola al usuario

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer`
- **Dependencias**: Fase 2 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] `dart analyze` no reporta errores nuevos
- [ ] El reporte fue generado exitosamente en `.claude/reports/`
- [ ] El usuario recibió un resumen legible de los cambios

## Uso de otros Commands y MCPs

Este comando no invoca otros commands ni utiliza MCPs específicos. Es una operación autocontenida que utiliza solamente las herramientas nativas de Dart/Flutter.

```yaml
commands_invocados: []

mcps_utilizados: []

contexto_compartido:
  location: .claude/reports/format-code-{timestamp}.md
  format: Markdown
  consumers: [ developer ]
```

## Output y Artefactos

| Artefacto           | Ubicación                                   | Formato  | Validador        | Obligatorio |
|---------------------|---------------------------------------------|----------|------------------|-------------|
| Reporte de formateo | `.claude/reports/format-code-{timestamp}.md` | Markdown | -                | Sí          |
| Log de ejecución    | `.claude/logs/format-code-{date}.log`       | Plain text | -             | Sí          |

### Estructura del Reporte

```markdown
# Formateo de Código - FitPulse Interval Timer

**Fecha**: 2025-01-20 14:30:22
**Duración**: 3.2 segundos

## Resumen

- **Archivos analizados**: 47
- **Archivos formateados**: 12
- **Archivos sin cambios**: 35
- **Estado**: ✅ Exitoso

## Archivos Modificados

1. `lib/services/timer_service.dart`
2. `lib/presentation/training/training_screen.dart`
3. `lib/data/repositories/routine_repository.dart`
[...]

## Validación

- **dart analyze**: ✅ Sin errores
- **Sintaxis**: ✅ Válida

## Detalles

[Salida detallada si --verbose]
```

## Rollback y Cancelación

Si el comando falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detectar archivos formateados**: Identificar qué archivos fueron modificados por `dart format`
2. **Restaurar desde Git**: Ejecutar `git checkout -- .` para revertir cambios de formateo
3. **Eliminar artefactos parciales**: Borrar reportes incompletos en `.claude/reports/`
4. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-format-code-{timestamp}.log
   ```
5. **Notificar al usuario**: Informar que el proyecto fue restaurado a su estado anterior

**Nota**: El formateo de código es una operación de bajo riesgo y fácilmente reversible usando Git. Se recomienda hacer un commit antes de formatear si hay cambios importantes sin commit.

### Estados Finales Posibles

- `completed`: Formateo exitoso, sin errores
- `failed`: Error en la ejecución de `dart format` o `dart analyze`
- `cancelled`: Cancelado por usuario
- `partial`: Algunos archivos se formatearon antes del error (revertir con Git)

## Reglas Críticas

- **Modificación de código permitida**: Este es un comando ejecutable que SI modifica archivos (es la excepción a la regla general)
- **Selección RACI obligatoria**: Cada fase debe tener responsible/accountable (aunque sea el mismo agente)
- **Idempotencia garantizada**: Ejecutar el comando múltiples veces debe producir el mismo resultado
- **Reversible con Git**: Todos los cambios pueden revertirse usando `git checkout`
- **No requiere aprobación**: El formateo es una operación de mantenimiento de bajo riesgo
- **Validación obligatoria**: Siempre ejecutar `dart analyze` después del formateo
- **Reporte obligatorio**: Generar siempre un reporte en `.claude/reports/`

## Ejemplos de Uso

### Caso 1: Formateo estándar

```bash
format-code
```

**Salida esperada**:
```
✅ Validando entorno...
📁 Encontrados 47 archivos .dart
🔧 Ejecutando dart format...
✅ 12 archivos formateados
🔍 Validando con dart analyze...
✅ Sin errores
📊 Reporte guardado en: .claude/reports/format-code-20250120-143022.md
```

### Caso 2: Dry run (sin modificar)

```bash
format-code --dry-run
```

**Salida esperada**:
```
✅ Validando entorno...
📁 Encontrados 47 archivos .dart
🔍 Simulando formateo (dry-run)...
⚠️  12 archivos requieren formateo:
   - lib/services/timer_service.dart
   - lib/presentation/training/training_screen.dart
   [...]
💡 Ejecuta 'format-code' para aplicar los cambios
```

### Caso 3: Formateo detallado

```bash
format-code --verbose
```

**Salida esperada**:
```
✅ Validando entorno...
📁 Encontrados 47 archivos .dart
🔧 Ejecutando dart format...
Formattting lib/services/timer_service.dart...
Formattting lib/presentation/training/training_screen.dart...
[...]
✅ 12 archivos formateados
🔍 Validando con dart analyze...
✅ Sin errores
📊 Reporte detallado guardado en: .claude/reports/format-code-20250120-143022.md
```

## Acción del Usuario

Para ejecutar este comando, simplemente escribe:

```
format-code
```

Opciones disponibles:
- `--fix`: Aplica correcciones automáticamente (default: true)
- `--dry-run`: Solo muestra qué serían los cambios sin aplicarlos
- `--verbose`: Muestra salida detallada del proceso

**No se requiere contexto adicional**. El comando analizará y formateará todo el código del proyecto automáticamente.