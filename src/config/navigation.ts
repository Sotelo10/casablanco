/** Navegación principal, footer y enlaces legales. */

export interface NavItem {
  label: string;
  href: string;
  /** Descripción breve usada en el menú móvil. */
  description?: string;
}

export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/', description: 'Casa Blanco de un vistazo' },
  { label: 'La casa', href: '/casa', description: 'Espacios, capacidad y servicios' },
  { label: 'Galería', href: '/galeria', description: 'Fotografías de la propiedad' },
  { label: 'Experiencia', href: '/experiencia', description: 'Qué hacer en Ica' },
  { label: 'Reseñas', href: '/resenas', description: 'Opiniones de huéspedes' },
  { label: 'Ubicación', href: '/ubicacion', description: 'Cómo llegar y qué hay cerca' },
];

export const secondaryNav: NavItem[] = [
  { label: 'Preguntas frecuentes', href: '/faq' },
  { label: 'Contacto', href: '/contacto' },
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
export const bookingHref = '/contacto';
export const bookingLabel = 'Reservar estadía';
export const bookingLabelLong = 'Reservar tu estadía';
export const exploreHref = '/casa';
export const exploreLabel = 'Explorar Casa Blanco';
