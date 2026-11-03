/**
 * ESPACIOS Y TEXTOS DE LA PROPIEDAD
 * =============================================================================
 * Los números (huéspedes, habitaciones, camas, baños) viven en
 * `src/config/site.ts` y siguen en `null` hasta que el propietario los
 * confirme: aquí no se cuenta nada.
 *
 * Regla de redacción: sólo se describe lo que se ve en las fotografías reales
 * de la casa (piscina, jardín, terraza, patio techado, sala, cocina,
 * dormitorios con cama matrimonial, camarotes y camas individuales, baños con
 * ducha de mampara). Nada de capacidades, metros ni servicios no verificados.
 */
import type { PropertySpace } from '../types/content.js';
import type { GalleryImage } from '../types/content.js';
import { photoBySlug } from './gallery.js';

/** Bloques de texto de la página "La casa". */
export const propertyIntro = {
  eyebrow: 'La propiedad',
  title: 'Una casa de dos plantas, con piscina, jardín y espacio para todos',
  paragraphs: [
    'Casa Leblanc es una casa vacacional en Ica que se reserva completa. Durante tu estadía, la piscina, el jardín, la terraza y todos los ambientes son sólo para tu grupo: sin recepción, sin pasillos compartidos y sin horarios que no sean los tuyos.',
    'La planta baja se abre al exterior con ventanales corredizos: la sala y la cocina miran a la terraza y a la piscina. Los dormitorios combinan camas matrimoniales, camarotes y camas individuales, una distribución pensada para familias y grupos de amigos.',
  ],
};

/** Párrafos de presentación de la portada. Admiten enlaces internos. */
export const homeIntroParagraphs = [
  'Casa Leblanc es una casa de dos plantas en Ica que se alquila completa: la piscina, el jardín, la terraza y cada ambiente son sólo para tu grupo durante toda la estadía.',
  'De día, el desierto, las bodegas y el <a href="/experiencia">oasis de Huacachina</a> esperan a un trayecto corto. Al volver, la casa ofrece lo que se busca en un alojamiento para familias y grupos: <a href="/casa">espacio, calma</a> y una piscina iluminada para terminar el día.',
];

/** Espacios de la casa, con su fotografía real. */
export const spaces: PropertySpace[] = [
  {
    id: 'exteriores',
    name: 'Piscina, jardín y terraza',
    description:
      'La piscina iluminada es el centro de la casa. A su alrededor, jardín, una terraza con piso de madera, mesa exterior con sombrilla y un patio techado con luces colgantes.',
    beds: null,
    icon: 'pool',
  },
  {
    id: 'sala-cocina',
    name: 'Sala y cocina',
    description:
      'Una sala amplia con sofá seccional y ventanales hacia la terraza, y una cocina con refrigeradora, cocina con horno y espacio para preparar las comidas del grupo.',
    beds: null,
    icon: 'sofa',
  },
  {
    id: 'dormitorios',
    name: 'Dormitorios y baños',
    description:
      'Dormitorios con cama matrimonial y clóset, una habitación con camarotes y otras con camas individuales. Baños con ducha de mampara de vidrio y acabados en madera.',
    beds: null,
    icon: 'bed',
  },
];

/** Fotografía de cada espacio (mismo orden e `id` que `spaces`). */
export const spaceImages: Record<string, GalleryImage> = {
  exteriores: photoBySlug('piscina-zona-comedor-exterior-casa-leblanc'),
  'sala-cocina': photoBySlug('cocina-equipada-casa-leblanc-ica'),
  dormitorios: photoBySlug('habitacion-camarotes-casa-leblanc'),
};

/** Argumentos de estancia mostrados en la portada. Todos verificables. */
export const stayHighlights = [
  {
    id: 'privacidad',
    title: 'Casa completa y privada',
    description: 'Una sola reserva a la vez: el espacio es de tu grupo de principio a fin.',
    icon: 'key',
  },
  {
    id: 'piscina',
    title: 'Piscina iluminada',
    description: 'Rodeada de jardín y terraza, para el sol de Ica y para las noches templadas.',
    icon: 'pool',
  },
  {
    id: 'grupos',
    title: 'Para familias y grupos',
    description: 'Camas matrimoniales, camarotes y camas individuales en dormitorios separados.',
    icon: 'users',
  },
  {
    id: 'directo',
    title: 'Trato directo',
    description: 'Consultas y reservas con el anfitrión, por WhatsApp, sin intermediarios.',
    icon: 'whatsapp',
  },
];
