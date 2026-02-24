---
name: analyze-code
version: 1.0.0
author: team
description: Comando para ejecutar análisis estático de código en FitPulse Interval Timer, verificando calidad, arquitectura Clean Architecture y cumplimiento de estándares Flutter/Dart
usage: "analyze-code [--scope=full|quick|module] [--focus=architecture|performance|security]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Analyze Code

## Objetivo

Ejecutar análisis estático completo del código base de FitPulse Interval Timer para:

1. Verificar cumplimiento de estándares de calidad Flutter/Dart
2. Validar adherencia a Clean Architecture + Riverpod
3. Identificar problemas de arquitectura y patrones
4. Detectar código muerto o subutilizado
5. Revisar convenciones de nomenclatura
6. Verificar configuración correcta de code generation

**Output**: Reporte detallado de hallazgos con recomendaciones accionables.

## Contexto Requerido del Usuario

- [ ] Alcance del análisis (full, quick, módulo específico)
- [ ] Foco específico si aplica (architecture, performance, security, all)
- [ ] Archivos o directorios a excluir (opcional)
- [ ] Umbral de severidad para reportar (error, warning, info)

## Análisis Inicial (Obligatorio)

### Validaciones Pre-ejecución

```json
{
  "validation_passed": true,
  "risks": [
    "Análisis puede tomar 3-5 minutos en codebase completo",
    "Algunos warnings pueden ser falsos positivos"
  ],
  "required_approvals": [],
  "estimated_complexity": "low",
  "blocking_issues": []
}
```

### Checklist Pre-ejecución

- [ ] Verificar que `flutter analyze` está disponible
- [ ] Confirmar que dependencies están instaladas (`flutter pub get`)
- [ ] Verificar espacio en disco para reportes
- [ ] Identificar si hay análisis previos para comparar

## Selección de Agentes y Skills

### Fase 1: Análisis Estático

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: [ code-reviewer, debug-master ]
informed: [ technical-writer ]
```

### Fase 2: Validación de Arquitectura

```yaml
responsible: flutter-architect
accountable: flutter-planning-agent
consulted: [ riverpod-state-management, drift-orm ]
informed: [ flutter-developer ]
```

### Fase 3: Reporte y Recomendaciones

```yaml
responsible: technical-writer
accountable: flutter-orchestrator
consulted: [ code-reviewer ]
informed: [ flutter-developer, flutter-architect ]
```

## Flujo de Trabajo Orquestado

### 1. Ejecutar Análisis Estático (flutter-developer | Validado por flutter-architect)

**Objetivo**: Ejecutar herramientas de análisis y recopilar resultados

**Tareas**:

- Ejecutar `flutter analyze` con salida JSON
- Ejecutar `dart format --output=none --set-exit-if-changed .` para verificar formato
- Verificar que `flutter pub run build_runner build` no tiene errores
- Recopilar resultados de análisis en archivo estructurado

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `code-reviewer`, `debug-master`
- **Comandos**:
  ```bash
  flutter analyze --json > .claude/reports/analyze-output.json
  dart format --output=none --set-exit-if-changed . || echo "FORMAT_ISSUES_DETECTED"
  flutter pub run build_runner build --delete-conflicting-outputs 2>&1 | tee .claude/reports/code-generation.log
  ```

**Criterios de Salida**:

- [ ] Archivo JSON de análisis generado
- [ ] Conteo de errores/warnings/info por severidad
- [ ] Lista de archivos con problemas ordenados por severidad

---

### 2. Validar Arquitectura Clean Architecture (flutter-architect | Validado por flutter-planning-agent)

**Objetivo**: Verificar adherencia a principios de Clean Architecture y patrones del proyecto

**Tareas**:

- Analizar estructura de directorios `lib/` según arquitectura
- Verificar que capas no se violan (domain → data → presentation)
- Validar uso correcto de Riverpod (no llamadas directas a providers)
- Revisar que servicios se inyectan correctamente (no singletons globales)
- Verificar uso de DateTime en timers (no Timer.periodic simple)
- Validar precarga de sonidos en AudioService

**Asignación**:

- **Agente**: flutter-architect
- **Skills**: `riverpod-state-management`, `drift-orm`
- **MCPs**: Ninguno (análisis de código estático)

**Criterios de Salida**:

- [ ] Reporte de violaciones a Clean Architecture
- [ ] Lista de dependencias incorrectas entre capas
- [ ] Verificación de patrones anti-arquitectura conocidos
- [ ] Validación de separación de responsabilidades

---

### 3. Generar Reporte con Recomendaciones (technical-writer | Validado por flutter-orchestrator)

**Objetivo**: Crear reporte legible con hallazgos y acciones recomendadas

**Tareas**:

- Consolidar resultados de fases anteriores
- Categorizar problemas por severidad (critical, high, medium, low)
- Priorizar recomendaciones según impacto en calidad
- Generar métricas de cobertura de análisis
- Crear lista de verificación para corrección
- Guardar reporte en `.claude/reports/`

**Asignación**:

- **Agente**: technical-writer
- **Skills**: `code-reviewer`
- **Dependencias**: Fases 1 y 2 completadas
- **Validador**: flutter-orchestrator

**Criterios de Salida**:

- [ ] Reporte en Markdown en `.claude/reports/code-analysis-{timestamp}.md`
- [ ] Resumen ejecutivo con métricas clave
- [ ] Tabla de problemas encontrados con severidad y recomendación
- [ ] Comparativa con análisis anterior si existe
- [ ] Checklist de acciones prioritarias

---

## Uso de otros Commands y MCPs

```yaml
commands_invocados: []

mcps_utilizados: []

contexto_compartido:
  location: .claude/reports/analyze-output.json
  format: JSON
  consumers: [ technical-writer ]
```

## Output y Artefactos

| Artefacto               | Ubicación                                           | Formato  | Validador       | Obligatorio |
|-------------------------|-----------------------------------------------------|----------|-----------------|-------------|
| Reporte de análisis     | `.claude/reports/code-analysis-{timestamp}.md`      | Markdown | -               | Sí          |
| Salida JSON de analyze  | `.claude/reports/analyze-output.json`               | JSON     | `json-validator`| Sí          |
| Log de code generation  | `.claude/reports/code-generation.log`               | Text     | -               | Sí          |
| Métricas de calidad     | `.claude/metrics/quality-{timestamp}.json`          | JSON     | -               | No          |

## Rollback y Cancelación

Si el comando falla o es cancelado:

1. Eliminar reportes parciales en `.claude/reports/`
2. Limpiar archivos temporales si existen
3. Registrar cancelación en `.claude/logs/cancelled-analyze-{timestamp}.log`

## Reglas Críticas

- **No modificación de código**: Este command solo analiza, no implementa cambios
- **Análisis no destructivo**: No modifica archivos del proyecto
- **Reporte honesto**: Incluir todos los hallazgos, sin minimizar severidad
- **Recomendaciones accionables**: Cada problema debe tener solución clara
- **Velocidad aceptable**: Análisis completo no debe exceder 5 minutos
- **Comparación histórica**: Si existe análisis previo, mostrar evolución

## Formato del Reporte

```markdown
# Code Analysis Report - FitPulse Interval Timer
**Fecha**: {timestamp}
**Alcance**: {full|quick|module}
**Duración**: {segundos}

## Resumen Ejecutivo

- **Errores críticos**: {count}
- **Warnings**: {count}
- **Info**: {count}
- **Archivos analizados**: {count}
- **Porcentaje de adherencia a arquitectura**: {percentage}%

## Problemas Críticos (Requieren atención inmediata)

| Archivo | Línea | Problema | Severidad | Recomendación |
|---------|-------|----------|-----------|---------------|
| ... | ... | ... | Critical | ... |

## Violaciones de Arquitectura

| Archivo | Violación | Capas Afectadas | Recomendación |
|---------|-----------|-----------------|---------------|
| ... | ... | ... | ... |

## Métricas de Calidad

- Adherencia a Clean Architecture: {percentage}%
- Cobertura de código: {percentage}% (desde tests)
- Convenciones de nomenclatura: {percentage}%
- Comentarios documentación: {percentage}%

## Acciones Prioritarias

1. [ ] {acción más crítica}
2. [ ] {segunda acción más crítica}
3. [ ] ...

## Detalle Completo

{sección con listado completo de problemas por categoría}
```

---

## Acción del Usuario

Para ejecutar el análisis de código, especifica:

1. **Alcance**: `full` (todo el proyecto), `quick` (solo errores), `module` (módulo específico)
2. **Foco** (opcional): `architecture` (solo arquitectura), `performance` (solo rendimiento), `security` (solo seguridad), `all` (todo)

**Ejemplos de uso**:

```bash
# Análisis completo del proyecto
analyze-code --scope=full --focus=all

# Análisis rápido de arquitectura
analyze-code --scope=quick --focus=architecture

# Análisis de un módulo específico
analyze-code --scope=module --focus=performance lib/services/