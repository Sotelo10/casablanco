/** Navegación principal, footer y enlaces legales. */

export interface NavItem {
  label: string;
  href: string;
  /** Descripción breve usada en el menú móvil. */
  description?: string;
}

export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/', description: 'Casa Leblanc de un vistazo' },
  { label: 'La casa', href: '/casa', description: 'Espacios, dormitorios y exteriores' },
  { label: 'Experiencias', href: '/experiencia', description: 'Escapadas, celebraciones y entorno' },
  { label: 'Galería', href: '/galeria', description: 'Fotografías reales de la casa' },
  { label: 'Reservas', href: '/reservas', description: 'Consulta disponibilidad' },
  { label: 'Contacto', href: '/contacto', description: 'WhatsApp, redes y ubicación' },
];

export const secondaryNav: NavItem[] = [
  { label: 'Ubicación', href: '/ubicacion' },
  { label: 'Preguntas frecuentes', href: '/faq' },
];

export const legalNav: NavItem[] = [
  { label: 'Política de privacidad', href: '/politica-privacidad' },
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de cookies', href: '/politica-cookies' },
];

/**
 * Vocabulario de acción, centralizado para que la jerarquía de CTA sea la misma
 * en toda la web: una acción principal, una secundaria y un canal directo.
 */
export const bookingHref = '/reservas';
export const bookingLabel = 'Consultar disponibilidad';
export const bookingLabelLong = 'Reservar tu estadía';
export const exploreHref = '/casa';
export const exploreLabel = 'Explorar la casa';
/** Versión corta para la cabecera, donde el espacio es limitado. */
export const bookingLabelShort = 'Reservar';
