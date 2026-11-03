/**
 * ESPACIOS Y TEXTOS DE LA PROPIEDAD
 * =============================================================================
 * Los números (huéspedes, habitaciones, camas, baños) viven en
 * `src/config/site.ts`. Aquí van los espacios y los textos descriptivos.
 *
 * Ningún texto afirma características concretas del inmueble: descríbelas tú
 * cuando tengas la información real.
 */
import type { PropertySpace } from '../types/content.js';

/** Bloques de texto editables de la página "La casa". */
export const propertyIntro = {
  eyebrow: 'La propiedad',
  title: 'Una casa para quedarse, no sólo para dormir',
  paragraphs: [
    'Casa Blanco se alquila completa: durante tu estancia la propiedad es sólo de tu grupo. Llegar, dejar las maletas y no pensar en nada más.',
    'La distribución, los ambientes y el equipamiento definitivos se detallan a continuación. Sustituye este texto por la descripción real de la casa cuando la tengas: mantén el tono tranquilo y concreto, sin exageraciones comerciales.',
  ],
};

/** Párrafos de presentación de la portada. Admiten enlaces internos. */
export const homeIntroParagraphs = [
  'Casa Blanco se alquila completa: durante tu estancia la propiedad es sólo de tu grupo. Sin recepción, sin pasillos compartidos y sin horarios que no sean los tuyos.',
  'Ica se recorre bien de día y se agradece con calma al volver. Por eso la casa está pensada para las dos cosas: <a href="/casa">espacios amplios</a> donde reunirse y rincones tranquilos para desconectar, con <a href="/experiencia">el desierto y los viñedos</a> a un trayecto corto.',
];

/**
 * TODO: describe los espacios reales de la casa. `beds: null` se muestra como
 * pendiente en lugar de inventar una configuración de camas.
 */
export const spaces: PropertySpace[] = [
  {
    id: 'dormitorio-1',
    name: 'Dormitorio principal',
    description: 'Habitación principal de la casa.',
    beds: null,
    icon: 'bed',
  },
  {
    id: 'dormitorio-2',
    name: 'Dormitorio secundario',
    description: 'Habitación adicional para acompañantes.',
    beds: null,
    icon: 'bed',
  },
  {
    id: 'sala',
    name: 'Sala de estar',
    description: 'Zona común para reunirse al final del día.',
    beds: null,
    icon: 'sofa',
  },
  {
    id: 'cocina-comedor',
    name: 'Cocina y comedor',
    description: 'Espacio para preparar y compartir las comidas.',
    beds: null,
    icon: 'utensils',
  },
  {
    id: 'exteriores',
    name: 'Exteriores',
    description: 'Áreas al aire libre de la propiedad.',
    beds: null,
    icon: 'sun',
  },
];

/** Argumentos de estancia mostrados en la portada. Textos genéricos y honestos. */
export const stayHighlights = [
  {
    id: 'privacidad',
    title: 'Una sola reserva a la vez',
    description:
      'La casa no se comparte. Durante tu estancia el espacio es de tu grupo, de principio a fin.',
    icon: 'key',
  },
  {
    id: 'descanso',
    title: 'Ambientes para cada momento',
    description:
      'Zonas comunes para reunirse y rincones tranquilos para leer, dormir o no hacer nada.',
    icon: 'moon',
  },
  {
    id: 'directo',
    title: 'Trato directo con el propietario',
    description:
      'Escribes y te responde quien administra la casa: sin centralitas ni intermediarios.',
    icon: 'shield',
  },
];
