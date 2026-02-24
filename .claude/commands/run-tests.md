---
name: run-tests
version: 1.0.0
author: team
description: Ejecuta la suite de tests de FitPulse Interval Timer con opciones para filtrar por tipo (unit, widget, integration) y genera reportes de cobertura
usage: "run-tests [--type=all|unit|widget|integration] [--coverage] [--device]"
type: executable
writes_code: false
creates_plan: false
requires_approval: false
dependencies: []
---

# Comando: Run Tests

## Objetivo

Ejecutar la suite de pruebas de FitPulse Interval Timer de manera estructurada, proporcionando reportes claros de resultados y métricas de cobertura. Este comando valida que:

- Los tests unitarios pasen (>70% cobertura requerida)
- Los tests de widget validen interacciones UI
- Los tests de integración corran en dispositivos reales
- Los servicios críticos (TimerService, AudioService) tengan cobertura completa

**No modifica código**, solo ejecuta y reporta resultados.

## Contexto Requerido del Usuario

- [ ] Tipo de tests a ejecutar (all, unit, widget, integration)
- [ ] Si se requiere reporte de cobertura
- [ ] Si es test de integración, dispositivo de destino
- [ ] Opciones adicionales (verbose, timeout, filtered tests)

## Análisis Inicial (Obligatorio)

Antes de ejecutar los tests, el comando debe evaluar:

- Estado actual del proyecto (dependencias instaladas)
- Disponibilidad de dispositivos (para integration tests)
- Tests existentes y su clasificación
- Umbral de cobertura mínimo configurado
- Historial de ejecuciones previas

### Pre-ejecución: Checklist Obligatorio

El comando debe verificar:

- [ ] ¿Están las dependencias instaladas? (`flutter pub get` ejecutado)
- [ ] ¿Existe código generado actualizado? (`build_runner` ejecutado si hay cambios)
- [ ] ¿Hay dispositivo conectado para integration tests? (si aplica)
- [ ] ¿El proyecto compila sin errores? (`flutter analyze` limpio)
- [ ] ¿Los archivos de test existen?

**Output esperado**: JSON de validación antes de continuar.

```json
{
  "validation_passed": true,
  "risks": ["Integration tests requieren dispositivo real"],
  "test_summary": {
    "unit_tests": 45,
    "widget_tests": 12,
    "integration_tests": 5
  },
  "coverage_threshold": 70,
  "blocking_issues": []
}
```

## Selección de Agentes y Skills (Framework RACI)

El comando utiliza el modelo RACI para asignar responsabilidades:

- **R** (Responsible): Agente que ejecuta la tarea
- **A** (Accountable): Agente que valida y aprueba
- **C** (Consulted): Skills/MCPs necesarios como soporte
- **I** (Informed): Commands que deben ser notificados

### Criterios de Selección

| Criterio                          | Agente Candidato               |
|-----------------------------------|--------------------------------|
| Ejecución de tests Flutter        | `test-coverage-analyzer`       |
| Análisis de resultados            | `test-coverage-analyzer`       |
| Validación de cobertura           | `test-coverage-analyzer`       |
| Reporte de métricas               | `technical-writer` (opcional)  |

### Ejemplo de Asignación RACI

```yaml
fase_1_preparacion:
  responsible: test-coverage-analyzer
  accountable: flutter-developer
  consulted: [ flutter-testing ]
  informed: []

fase_2_ejecucion:
  responsible: test-coverage-analyzer
  accountable: flutter-developer
  consulted: [ flutter-testing ]
  informed: []

fase_3_reporte:
  responsible: test-coverage-analyzer
  accountable: flutter-developer
  consulted: [ technical-writer ]
  informed: []
```

## Flujo de Trabajo Orquestado

### 1. Preparación del Entorno (test-coverage-analyzer | Validado por flutter-developer)

**Objetivo**: Verificar que el proyecto esté listo para ejecutar tests

**Tareas**:

- Verificar que `flutter pub get` se haya ejecutado
- Validar que el código generado esté actualizado
- Confirmar que `flutter analyze` no tenga errores
- Verificar disponibilidad de dispositivos para integration tests
- Identificar archivos de test existentes

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `flutter-testing`
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Dependencias instaladas y actualizadas
- [ ] Código generado compilado sin errores
- [ ] Proyecto pasa análisis estático
- [ ] Dispositivo disponible (si integration tests)

---

### 2. Ejecución de Tests (test-coverage-analyzer | Validado por flutter-developer)

**Objetivo**: Correr la suite de tests según el tipo solicitado

**Tareas**:

- Ejecutar `flutter test` con flags apropiados según tipo
- Monitorear ejecución y capturar output
- Manejar timeouts y failures
- Ejecutar tests de cobertura si se solicita
- Para integration tests: ejecutar en dispositivo real específico

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `flutter-testing`
- **Dependencias**: Fase 1 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Tests ejecutados según tipo solicitado
- [ ] Output capturado completamente
- [ ] Cobertura generada (si se solicitó)
- [ ] Reportes HTML generados (si coverage)

---

### 3. Análisis y Reporte (test-coverage-analyzer | Validado por flutter-developer)

**Objetivo**: Procesar resultados y generar reporte accionable

**Tareas**:

- Parsear resultados de tests (pasados/fallidos/skipped)
- Calcular porcentaje de cobertura total y por archivo
- Identificar archivos con cobertura <70%
- Generar reporte HTML de cobertura (genhtml)
- Crear resumen ejecutivo con recommendations
- Guardar logs en `.claude/logs/run-tests-{timestamp}.log`

**Asignación**:

- **Agente**: test-coverage-analyzer
- **Skills**: `flutter-testing`
- **Dependencias**: Fase 2 completada
- **Validador**: flutter-developer

**Criterios de Salida**:

- [ ] Reporte de resumen generado
- [ ] Métricas de cobertura calculadas
- [ ] Archivos críticos identificados
- [ ] Recomendaciones documentadas
- [ ] Log de ejecución guardado

## Uso de otros Commands y MCPs

Este comando no invoca otros commands ni utiliza MCPs externos. Opera de manera autónoma utilizando las capacidades nativas de Flutter y Dart.

```yaml
commands_invocados: []

mcps_utilizados: []

contexto_compartido:
  location: .claude/logs/
  format: Plain text logs + JSON metrics
  consumers: [ci-cd-systems, QA-team]
```

## Output y Artefactos

| Artefacto               | Ubicación                                     | Formato    | Validador          | Obligatorio     |
|-------------------------|-----------------------------------------------|------------|--------------------|-----------------|
| Resumen de ejecución    | `.claude/logs/run-tests-{timestamp}.log`      | Plain text | -                  | Sí              |
| Métricas de cobertura   | `.claude/reports/coverage-{timestamp}.json`   | JSON       | `schema-validator` | Sí (si coverage)|
| Reporte HTML cobertura  | `coverage/html/index.html`                    | HTML       | -                  | Sí (si coverage)|
| Tests fallidos detalle  | `.claude/reports/failed-tests-{timestamp}.md` | Markdown   | -                  | Sí (si failures)|

## Rollback y Cancelación

Si el comando falla o el usuario cancela durante la ejecución:

### Procedimiento de Rollback

1. **Detener tests en curso**: Enviar señal de interrupción (`flutter test` se cancela con Ctrl+C)
2. **Limpiar artefactos parciales**:
   - Eliminar reportes de cobertura incompletos
   - Remover logs de ejecución truncados
3. **Restaurar estado previo**: No hay modificaciones en el código, rollback no es necesario
4. **Registrar cancelación**:
   ```
   .claude/logs/cancelled-run-tests-{timestamp}.log
   ```
5. **Reportar estado actual**: Indicar tests que completaron antes de cancelación

### Estados Finales Posibles

- `completed`: Tests ejecutados exitosamente
- `failed`: Tests fallaron o error en ejecución
- `cancelled`: Cancelado por usuario
- `partial`: Algunos tests ejecutados antes de fallo/cancelación

## Reglas Críticas

- **No modificación de código**: Este comando solo ejecuta tests y genera reportes
- **Dispositivos reales obligatorios**: Integration tests requieren dispositivos físicos (simuladores no son válidos para background audio/execution)
- **Umbral de cobertura**: Proyecto requiere >70% cobertura, reportar si no se cumple
- **Tests críticos**: TimerService, AudioService, RoutineRepository deben tener 100% cobertura de paths críticos
- **Idempotencia**: Ejecutar múltiples veces debe producir mismos resultados
- **Logs obligatorios**: Toda ejecución debe generar log en `.claude/logs/`
- **Reporte accionable**: Si tests fallan, incluir pasos específicos para debugging

## Acción del Usuario

Especifica los tests que deseas ejecutar:

```bash
# Ejecutar todos los tests con cobertura
run-tests --type=all --coverage

# Solo tests unitarios
run-tests --type=unit

# Tests de widget sin cobertura
run-tests --type=widget

# Tests de integración en dispositivo específico
run-tests --type=integration --device=<device_id>

# Tests unitarios con cobertura y reporte detallado
run-tests --type=unit --coverage --verbose
```

**Ejemplos de uso**:

> "Ejecuta todos los tests y genera reporte de cobertura"
> 
> "Corre solo los tests unitarios del TimerService"
> 
> "Ejecuta tests de integración en el iPhone conectado"
> 
> "Verifica cobertura de AudioService y TrainingNotifier"

**Opciones disponibles**:

- `--type`: Tipo de tests (all, unit, widget, integration) - default: all
- `--coverage`: Generar reporte de cobertura HTML - default: false
- `--device`: Device ID para integration tests - default: primer dispositivo disponible
- `--verbose`: Output detallado de ejecución - default: false
- `--timeout`: Timeout máximo en segundos - default: 120

---

**Versión del comando**: 1.0.0  
**Última actualización**: 2025-01-20