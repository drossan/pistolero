---
name: generate-db-migrations
version: 1.0.0
author: fitpulse-dev-team
description: Comando para generar migraciones de base de datos Drift ORM en FitPulse Interval Timer, validando esquemas y detectando breaking changes
usage: "generate-db-migrations [--from-schema=<version>] [--to-schema=<version>]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: [drift-orm, sqlite-debugging]
---

# Comando: Generate DB Migrations

## Objetivo

Generar y validar migraciones de base de datos para FitPulse Interval Timer usando Drift ORM. Este comando:

- Analiza el esquema actual de la base de datos (tablas Routines y Exercises)
- Detecta cambios en las entidades Drift desde la última versión
- Genera archivos de migración compatibles con向后兼容
- Valida que las migraciones no rompan datos existentes
- Ejecuta tests de migración para verificar integridad

**No modifica código existente**, solo genera nuevos archivos de migración y reportes de validación.

## Contexto Requerido del Usuario

- [ ] Versión actual del esquema (ej: 1, 2, 3)
- [ ] Descripción de cambios realizados en las entidades Drift
- [ ] Archivos de entidades modificados (ej: `lib/data/database/models.dart`)
- [ ] ¿Es una migración destructiva? (drop columns, drop tables, change types)
- [ ] Datos de prueba para validar migración (opcional)

## Análisis Inicial (Obligatorio)

Antes de generar cualquier migración, el comando debe evaluar:

- Estado actual del esquema Drift (schemaVersion en AppDatabase)
- Cambios en las entidades anotadas con @DriftDatabase
- Impacto en datos existentes (loss of data, nullability changes)
- Riesgos de breaking changes
- Necesidad de migración de datos existentes

### Pre-ejecución: Checklist Obligatorio

El comando debe verificar:

- [ ] ¿Existe un archivo de base de datos actual? → Verificar schemaVersion
- [ ] ¿Hay cambios en las entidades Drift? → Comparar con versión anterior
- [ ] ¿Los cambios son backward compatible? → Alertar si no lo son
- [ ] ¿Se requieren transformaciones de datos? → Preparar scripts
- [ ] ¿Existe data de producción que migrar? → Avisar sobre backup

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "current_schema_version": 3,
  "target_schema_version": 4,
  "changes_detected": [
    "Added column 'isFavorite' to Routines table",
    "Modified 'workTime' constraint in Exercises table"
  ],
  "risks": [
    "Non-nullable column 'isFavorite' requires default value",
    "Existing data may violate new 'workTime' constraint"
  ],
  "is_breaking_change": false,
  "requires_data_migration": true,
  "blocking_issues": []
}
```

## Selección de Agentes y Skills (Framework RACI)

Este comando orquesta agentes especializados en bases de datos Flutter y Drift ORM.

### Fase 1: Análisis de Esquema

```yaml
responsible: flutter-architect
accountable: flutter-developer
consulted: [ drift-orm, sqlite-debugging, code-reviewer ]
informed: [ technical-writer ]
```

**Justificación**: 
- `flutter-architect`: Su descripción menciona "diseño de arquitectura Flutter Clean Architecture + Riverpod" y es crucial para entender el impacto arquitectónico de cambios en el esquema de BD
- `drift-orm`: Propósito explícito de "trabajar con Drift ORM en Flutter, incluyendo definición de tablas, relaciones, migraciones, queries complejas y generación de código"
- `sqlite-debugging`: Propósito de "diagnosticar, analizar, o resolver problemas relacionados con bases de datos SQLite en Flutter con Drift ORM"

### Fase 2: Generación de Migración

```yaml
responsible: flutter-developer
accountable: flutter-architect
consulted: [ dart-code-generation, drift-orm, debug-master ]
informed: [ test-coverage-analyzer ]
```

**Justificación**:
- `flutter-developer`: Descripción menciona "Senior Flutter Developer especializado en razonamiento sobre arquitectura Clean Architecture + Riverpod" y es ideal para ejecutar comandos de code generation
- `dart-code-generation`: Propósito de "generar código Dart en proyectos Flutter, incluyendo configuración de code generation con build_runner"

### Fase 3: Validación y Testing

```yaml
responsible: test-coverage-analyzer
accountable: flutter-developer
consulted: [ flutter-testing, drift-orm, sqlite-debugging ]
informed: [ technical-writer ]
```

**Justificación**:
- `test-coverage-analyzer`: Descripción menciona "Test Coverage Analyzer especializado en razonamiento sobre cobertura de tests para proyectos Flutter con Clean Architecture"
- `flutter-testing`: Propósito de "crear, ejecutar o mejorar pruebas Flutter (unit tests, widget tests, integration tests)"

## Flujo de Trabajo Orquestado

### 1. Análisis de Esquema Actual (flutter-architect | Validado por flutter-developer)

**Objetivo**: Determinar el estado actual del esquema y los cambios necesarios

**Tareas**:

- Leer el archivo de definición de la base de datos (ej: `lib/data/database/database.dart`)
- Identificar la versión actual (schemaVersion)
- Comparar entidades Drift actuales con la versión anterior
- Documentar todos los cambios detectados (added columns, modified constraints, new tables)
- Clasificar cambios como backward compatible o breaking changes

**Asignación**:

- **Agente**: flutter-architect
- **Skills**: `drift-orm`, `sqlite-debugging`, `code-reviewer`
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Esquema actual documentado con todas las tablas y columnas
- [ ] Lista de cambios detectados generada
- [ ] Cambios clasificados como breaking/non-breaking
- [ ] Riesgos identificados (data loss, constraint violations)

---

### 2. Generación de Archivos de Migración (flutter-developer | Validado por flutter-architect)

**Objetivo**: Crear los archivos de migración de Drift

**Tareas**:

- Ejecutar `flutter pub run build_runner build --delete-conflicting-outputs`
- Generar archivos de migración en el directorio adecuado (ej: `lib/data/database/migrations/`)
- Crear clases que extiendan `DatabaseMigration` para cada versión
- Implementar métodos `onUpgrade` con las sentencias SQL apropiadas
- Agregar lógica de migración de datos si es necesario (transformaciones, defaults)

**Asignación**:

- **Agente**: flutter-developer
- **Skills**: `dart-code-generation`, `drift-orm`, `debug-master`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-architect

**Criterios de Salida**:

- [ ] Archivo de migración generado (ej: `migration_v3_to_v4.dart`)
- [ ] Código generado pasa `flutter analyze`
- [ ] Migración incluye actualización de schemaVersion
- [ ] Sentencias SQL validadas (ALTER TABLE, CREATE TABLE, etc.)

---

### 3. Validación de Migración (test-coverage-analyzer | Validado por flutter-developer)

**Objetivo**: Verificar que la migración funciona correctamente y preserva datos

**Tareas**:

- Crear tests de migración unitarios (verificar schema changes)
- Crear tests de integración con datos de ejemplo
- Ejecutar migración forward (v3 → v4) y backward (v4 → v3 si es soportado)
- Verificar que no hay pérdida de datos
- Validar restricciones (foreign keys, not null, defaults)
- Ejecutar `flutter test` y verificar que todos los tests pasan

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `flutter-testing`, `drift-orm`, `sqlite-debugging`
- **Dependencias**: Fase 2 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Tests de migración creados y pasando
- [ ] Cobertura de tests >80% para el código de migración
- [ ] Migración probada con datos reales o mock realistas
- [ ] No hay warnings de `flutter analyze`
- [ ] Reporte de validación generado

---

### 4. Documentación de Cambios (flutter-architect | Validado por flutter-developer)

**Objetivo**: Documentar la migración para referencias futuras

**Tareas**:

- Crear/actualizar archivo de changelog de migraciones
- Documentar breaking changes para desarrolladores
- Agregar ejemplos de SQL de migración
- Actualizar documentación del esquema de BD si existe
- Crear notas para release notes

**Asignación**:

- **Agente**: flutter-architect
- **Skills**: `technical-writer`, `drift-orm`
- **Dependencias**: Fase 3 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Changelog de migración actualizado
- [ ] Breaking changes documentados
- [ ] Ejemplos de SQL agregados
- [ ] Documentación del esquema actualizada

## Uso de otros Commands y MCPs

```yaml
commands_invocados:
  - name: run-tests
    trigger: post-fase-3
    purpose: Verificar que todos los tests pasan después de la migración
    
  - name: analyze-code
    trigger: post-fase-2
    purpose: Validar que el código generado no tiene warnings

mcps_utilizados:
  - name: sqlite-validator
    config: .claude/mcp-configs/sqlite-validator.json
    purpose: Validar sintaxis SQL de las migraciones

contexto_compartido:
  location: .claude/context/db-schema-state.json
  format: JSON
  data:
    current_schema_version: int
    migrations_history: array
    last_migration_timestamp: string
  consumers: [ flutter-developer, test-coverage-analyzer ]
```

## Output y Artefactos

| Artefacto | Ubicación | Formato | Validador | Obligatorio |
|-----------|-----------|---------|-----------|-------------|
| Archivo de migración | `lib/data/database/migrations/v{from}_to_v{to}.dart` | Dart | flutter-developer | Sí |
| Tests de migración | `test/database/migrations/v{from}_to_v{to}_test.dart` | Dart | test-coverage-analyzer | Sí |
| Reporte de validación | `.claude/reports/db-migration-{version}-{timestamp}.md` | Markdown | flutter-architect | Sí |
| Changelog de BD | `docs/database/migrations.md` | Markdown | technical-writer | No |
| JSON de estado | `.claude/context/db-schema-state.json` | JSON | schema-validator | Sí |

## Rollback y Cancelación

Si el comando falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener agentes en curso**: Enviar señal de cancelación a todos los agentes activos
2. **Eliminar artefactos parciales**:
   - Borrar archivos de migración incompletos en `lib/data/database/migrations/`
   - Borrar tests de migración incompletos en `test/database/migrations/`
   - Eliminar reportes parciales en `.claude/reports/`
3. **Revertir schemaVersion**: Si se modificó el archivo de database.dart, revertir schemaVersion al valor anterior
4. **Limpiar código generado**: Ejecutar `flutter clean` para eliminar código generado parcialmente
5. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-db-migration-{timestamp}.log
   ```
6. **Notificar dependencias**: Informar a `run-tests` y `analyze-code` que la migración fue cancelada

### Estados Finales Posibles

- `completed`: Migración generada y validada exitosamente
- `failed`: Error durante generación o validación (errores de SQL, tests fallando)
- `cancelled`: Cancelado por usuario
- `partial_warning`: Migración generada pero con warnings (ej: breaking changes sin data migration)

## Reglas Críticas

- **No modificación de código existente**: Este comando solo genera nuevos archivos de migración, no modifica código de lógica de negocio
- **Backward compatibility por defecto**: Siempre preferir cambios backward compatible (nullable columns, default values)
- **Tests obligatorios**: Toda migración debe incluir tests que verifiquen su correcto funcionamiento
- **Validación de datos**: Antes de marcar como completed, verificar que no hay pérdida de datos en tests
- **Documentación de breaking changes**: Si una migración es breaking change, debe estar claramente documentada
- **Versionado semántico**: Incrementar schemaVersion en 1 por cada migración
- **No rolling migrations**: Evitar generar múltiples migraciones a la vez, una por ejecución del comando

---

## Acción del Usuario

Para generar una migración de base de datos, proporciona la siguiente información:

1. **Cambios realizados**: Describe qué modificaste en las entidades Drift (ej: "Añadí columna 'isFavorite' a la tabla Routines", "Cambié el tipo de 'workTime' de int a Duration")
2. **Archivos modificados**: Lista los archivos de entidades que cambiaste (ej: `lib/data/database/models.dart`)
3. **Tipo de cambio**: ¿Es backward compatible? (añadir columnas nullable = compatible, cambiar tipos = breaking)
4. **Migración de datos**: ¿Necesitas transformar datos existentes? (ej: "Calcular valor de nueva columna basado en otras")

**Ejemplo de solicitud válida**:
> "He añadido una columna 'lastUsedAt' de tipo DateTime a la tabla Routines. Es nullable, así que es backward compatible. No necesito migrar datos existentes, el default es null. El archivo modificado es lib/data/database/models.dart."