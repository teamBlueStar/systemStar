# Decisiones iniciales

- Separamos el núcleo nativo de protocolos del API web para permitir ciclos de
  despliegue independientes.
- El aislamiento multi-tenant se aplica en el servidor mediante `clientId`.
- OpenAPI es el contrato formal entre backend y clientes.
- Los protocolos GPS se implementan detrás de una interfaz común y no dentro
  de las rutas HTTP.
- Los secretos se entregan por variables de entorno o gestores de secretos.