# Notificaciones

Las notificaciones deben generarse desde eventos de dominio, no directamente
desde un parser. Cada canal debe tener reintentos limitados, deduplicación,
observabilidad y configuración por cliente.