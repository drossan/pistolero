# Commands Disponibles

Este directorio contiene los comandos del proyecto Fit Pulse.

## Comandos Configurados

### plan-manage

**Descripción**: Comando meta para gestionar el ciclo de vida completo de planes técnicos en FitPulse Interval Timer, desde su creación hasta aprobación, ejecución y validación

**Uso**: `plan-manage [create | approve | execute | validate | list | cancel] [plan-id] [--priority=high]`

---

### orchestrator

**Descripción**: Orquesta tareas de desarrollo Flutter en FitPulse Interval Timer, coordinando múltiples agentes especializados según la naturaleza de la solicitud (desarrollo, arquitectura, testing, debugging, optimización)

**Uso**: `orchestrator [task-description] [--priority=normal|high|critical] [--type=feature|bug|refactor|test|optimization]`

---

### pre-flight

**Descripción**: Comando de verificación pre-vuelo para FitPulse Interval Timer que valida el estado del proyecto antes de iniciar desarrollo, incluyendo dependencias, configuración de entorno, calidad de código y estado de tests

**Uso**: `pre-flight [--full] [--skip-tests]`

---

### run-tests

**Descripción**: Ejecuta la suite de tests de FitPulse Interval Timer con opciones para filtrar por tipo (unit, widget, integration) y genera reportes de cobertura

**Uso**: `run-tests [--type=all|unit|widget|integration] [--coverage] [--device]`

---

### build-release

**Descripción**: Comando para ejecutar el build de release de FitPulse Interval Timer para iOS y Android, validando que se cumplan todos los requisitos de calidad antes de generar los artefactos finales

**Uso**: `build-release [--platform=ios|android|both] [--skip-tests]`

---

### analyze-code

**Descripción**: Comando para ejecutar análisis estático de código en FitPulse Interval Timer, verificando calidad, arquitectura Clean Architecture y cumplimiento de estándares Flutter/Dart

**Uso**: `analyze-code [--scope=full|quick|module] [--focus=architecture|performance|security]`

---

### format-code

**Descripción**: Comando para formatear todo el código del proyecto FitPulse Interval Timer según los estándares de Dart/Flutter, verificando calidad y generando reportes de cambios

**Uso**: `format-code [--fix] [--dry-run] [--verbose]`

---

### generate-db-migrations

**Descripción**: Comando para generar migraciones de base de datos Drift ORM en FitPulse Interval Timer, validando esquemas y detectando breaking changes

**Uso**: `generate-db-migrations [--from-schema=<version>] [--to-schema=<version>]`

---

### test-background-audio

**Descripción**: Ejecuta pruebas integrales de audio en segundo plano para validar que el sistema de audio funciona correctamente con la pantalla bloqueada, en background y durante interrupciones del sistema

**Uso**: `test-background-audio [--device=device-id] [--duration=minutes]`

---

### measure-timer-precision

**Descripción**: Comando para medir y validar la precisión del timer en FitPulse Interval Timer, ejecutando pruebas de precisión en dispositivos reales y generando reportes de drift

**Uso**: `measure-timer-precision [--duration=30] [--device=<device_id>] [--iterations=3]`

---

### battery-optimization-check

**Descripción**: Comando para analizar y validar el consumo de batería de FitPulse Interval Timer, verificando que la app cumpla con el estándar de <2% consumo por sesión de 30 minutos según especificaciones del proyecto

**Uso**: `battery-optimization-check [--duration=30] [--real-device]`

---

### create-feature-branch

**Descripción**: Comando para crear una nueva feature branch en FitPulse Interval Timer, asegurando que la rama siga las convenciones del proyecto y esté preparada para desarrollo con TDD

**Uso**: `create-feature-branch [feature-name] [--type=feat|fix|refactor|test|docs] [--ticket-id=JIRA-XXX]`

---

### run-integration-tests

**Descripción**: Comando para ejecutar pruebas de integración en FitPulse Interval Timer, validando(timer precision, background execution, audio background, call interruption, battery efficiency) en dispositivos reales iOS y Android

**Uso**: `run-integration-tests [--target=all|ios|android] [--skip-build] [--coverage]`

---

## Uso de los Comandos

Los comandos definen flujos de trabajo orquestados que utilizan uno o más agentes.

Para más información sobre cómo se crean estos comandos, consulta las guías en `.claude/embeds/command_guide.md`.
