/**
 * RESEÑAS — CONTENIDO DE DEMOSTRACIÓN
 * =============================================================================
 * Todas las entradas llevan `isDemo: true`. La interfaz las etiqueta como
 * ejemplo y no calcula un promedio "oficial" a partir de ellas.
 *
 * Sustitúyelas por reseñas reales (o conéctalas a Supabase, tabla `reviews`)
 * y pon `isDemo: false`. El componente y el resumen funcionan igual.
 */
import type { Review } from '../types/content.js';

export const reviews: Review[] = [
  {
    id: 'demo-1',
    guestName: 'Huésped 01',
    rating: 5,
    comment:
      'Este espacio está reservado para la primera reseña real de la propiedad. El diseño admite textos de una a seis líneas sin romperse.',
    source: 'directo',
    publishedAt: '2025-01-15',
    approved: true,
    location: '[Ciudad]',
    isDemo: true,
  },
  {
    id: 'demo-2',
    guestName: 'Huésped 02',
    rating: 5,
    comment:
      'Ejemplo de reseña breve. Cuando cargues las opiniones reales, esta tarjeta mostrará el nombre, la fecha y la plataforma de origen.',
    source: 'airbnb',
    publishedAt: '2024-12-02',
    approved: true,
    location: '[Ciudad]',
    isDemo: true,
  },
  {
    id: 'demo-3',
    guestName: 'Huésped 03',
    rating: 4,
    comment:
      'Ejemplo de reseña de cuatro estrellas: la distribución por puntuación del resumen se calcula automáticamente a partir de estos valores.',
    source: 'booking',
    publishedAt: '2024-11-18',
    approved: true,
    location: '[Ciudad]',
    isDemo: true,
  },
  {
    id: 'demo-4',
    guestName: 'Huésped 04',
    rating: 5,
    comment:
      'Ejemplo de reseña algo más extensa, útil para comprobar cómo se comporta la tipografía en párrafos largos dentro de la tarjeta y en pantallas pequeñas, donde el texto ocupa varias líneas seguidas.',
    source: 'google',
    publishedAt: '2024-10-27',
    approved: true,
    location: '[Ciudad]',
    isDemo: true,
  },
  {
    id: 'demo-5',
    guestName: 'Huésped 05',
    rating: 5,
    comment:
      'Ejemplo de reseña recibida por contacto directo. Puedes indicar el origen de cada opinión para dar contexto al visitante.',
    source: 'directo',
    publishedAt: '2024-09-09',
    approved: true,
    location: '[Ciudad]',
    isDemo: true,
  },
];
