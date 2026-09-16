# Backend overview

El backend debe mantenerse modular. Los parsers no deben acceder directamente
a la base de datos ni conocer detalles de la interfaz web. Publican modelos y
eventos; los servicios de dominio deciden cómo persistir, alertar o exponer
la información.