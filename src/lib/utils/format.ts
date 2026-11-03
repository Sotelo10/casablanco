/** Formateo de valores para la interfaz. */
import { site } from '../../config/site.js';

/** Marcador visible para cualquier dato todavía no proporcionado. */
export const PLACEHOLDER = site.content.placeholderLabel;

/**
 * Devuelve el valor si existe, o `null` para que el componente decida cómo
 * mostrar el marcador. Nunca inventa un valor por defecto.
 */
export function orNull<T>(value: T | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  return value;
}

/** Fecha larga en español para reseñas y contenidos con fecha. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date);
}

/** Promedio con un decimal y coma decimal (convención local). */
export function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/** Singular/plural sencillo: `pluralize(2, 'huésped', 'huéspedes')`. */
export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

const sourceLabels: Record<string, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking',
  google: 'Google',
  directo: 'Consulta directa',
  otro: 'Otra plataforma',
};

export function reviewSourceLabel(source: string): string {
  return sourceLabels[source] ?? sourceLabels.otro!;
}
