/**
 * REGISTRO DE ERRORES
 * =============================================================================
 * Punto único donde el proyecto escribe en consola. Que no haya `console.*`
 * sueltos es lo que garantiza que ningún detalle interno (mensajes de Postgres,
 * códigos, trazas) acabe delante de un visitante.
 *
 * Se registra en dos situaciones, ambas invisibles para el público:
 *
 *   · en el servidor (build o `astro dev`), donde el log es tuyo y necesitas
 *     enterarte de que una consulta falló y el sitio usó los datos locales;
 *   · en el navegador, sólo durante el desarrollo.
 *
 * En el bundle de producción la condición es constante y falsa, así que el
 * empaquetador elimina la llamada entera.
 */
const shouldLog = import.meta.env.SSR || import.meta.env.DEV;

export function logWarning(scope: string, error: unknown): void {
  if (!shouldLog) return;
  const detail = error instanceof Error ? error.message : error;
  console.warn(`[${scope}]`, detail);
}
