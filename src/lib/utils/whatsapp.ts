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
  /** Texto libre que sustituye al mensaje por defecto. */
  message?: string;
}

/** `true` cuando hay un número de WhatsApp configurado. */
export function hasWhatsApp(): boolean {
  return site.contact.whatsapp.replace(/\D/g, '').length > 0;
}

/** Mensaje prellenado. Sólo incluye los datos que existen. */
export function buildWhatsAppMessage(options: WhatsAppMessageOptions = {}): string {
  if (options.message) return options.message;

  const propertyName = site.name;
  const parts = [`Hola, quisiera consultar disponibilidad para ${propertyName}.`];

  if (options.checkIn) parts.push(`Llegada: ${options.checkIn}.`);
  if (options.checkOut) parts.push(`Salida: ${options.checkOut}.`);
  if (options.guests) parts.push(`Huéspedes: ${options.guests}.`);

  return parts.join(' ');
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
