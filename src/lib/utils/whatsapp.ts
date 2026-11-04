/**
 * Enlaces de WhatsApp.
 *
 * `wa.me` funciona igual en escritorio (WhatsApp Web) y en móvil (app nativa),
 * por eso es el formato usado en todo el sitio.
 */
import { site } from '../../config/site.js';

export interface WhatsAppMessageOptions {
  checkIn?: string;
  checkOut?: string;
  guests?: number | string;
  /** Tipo de experiencia elegido en el formulario. */
  experience?: string;
  /** Nombre de quien escribe. */
  name?: string;
  /** Comentario libre que se añade al final del mensaje. */
  note?: string;
  /** Texto libre que sustituye al mensaje por defecto. */
  message?: string;
}

/** `true` cuando hay un número de WhatsApp configurado. */
export function hasWhatsApp(): boolean {
  return site.contact.whatsapp.replace(/\D/g, '').length > 0;
}

/** `2026-12-18` → `18/12/2026`; cualquier otro formato se deja tal cual. */
function formatDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

/**
 * Mensaje prellenado. Sólo incluye los datos que existen; los datos de la
 * estancia van en líneas separadas para que el anfitrión los lea de un vistazo.
 */
export function buildWhatsAppMessage(options: WhatsAppMessageOptions = {}): string {
  if (options.message) return options.message;

  const propertyName = site.name;
  const greeting = options.name ? `Hola, soy ${options.name}.` : 'Hola,';
  const lines = [`${greeting} Quisiera consultar disponibilidad en ${propertyName}.`];

  const details = [
    options.checkIn && `• Llegada: ${formatDate(options.checkIn)}`,
    options.checkOut && `• Salida: ${formatDate(options.checkOut)}`,
    options.guests && `• Huéspedes: ${options.guests}`,
    options.experience && `• Experiencia: ${options.experience}`,
  ].filter(Boolean) as string[];

  if (details.length > 0) lines.push('', ...details);
  if (options.note) lines.push('', options.note);

  return lines.join('\n');
}

/**
 * URL lista para usar, o `null` si aún no hay número configurado. Los
 * componentes que la consumen enlazan a `/contacto` cuando devuelve `null`.
 */
export function whatsAppUrl(options: WhatsAppMessageOptions = {}): string | null {
  const digits = site.contact.whatsapp.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildWhatsAppMessage(options))}`;
}
