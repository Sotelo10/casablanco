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
import type { GalleryImage, HouseSpace, PropertySpace } from '../types/content.js';
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

/**
 * "CONOCE NUESTRA CASA" — los ocho espacios de la portada.
 * -----------------------------------------------------------------------------
 * Las descripciones sólo cuentan lo que se ve en las fotografías reales.
 * Estacionamiento y áreas de entretenimiento no aparecen en ninguna fotografía
 * ni están confirmados: se muestran como "por confirmar" hasta que el
 * propietario aporte la información (y, si existe, una fotografía).
 */
export const houseSpaces: HouseSpace[] = [
  {
    id: 'dormitorios',
    name: 'Dormitorios',
    description:
      'Dormitorios con cama matrimonial y clóset, una habitación con camarotes y otras con camas individuales.',
    icon: 'bed',
    image: photoBySlug('dormitorio-cama-matrimonial-casa-leblanc'),
    confirmed: true,
  },
  {
    id: 'sala',
    name: 'Sala de estar',
    description: 'Sofá seccional y ventanales corredizos que se abren a la terraza y la piscina.',
    icon: 'sofa',
    image: photoBySlug('sala-de-estar-casa-leblanc'),
    confirmed: true,
  },
  {
    id: 'cocina',
    name: 'Cocina',
    description: 'Refrigeradora, cocina con horno y muebles de madera para preparar las comidas del grupo.',
    icon: 'kitchen',
    image: photoBySlug('cocina-equipada-casa-leblanc-ica'),
    confirmed: true,
  },
  {
    id: 'banos',
    name: 'Baños',
    description: 'Duchas con mampara de vidrio, espejo iluminado y acabados en madera.',
    icon: 'bath',
    image: photoBySlug('bano-ducha-vidrio-casa-leblanc'),
    confirmed: true,
  },
  {
    id: 'piscina',
    name: 'Piscina',
    description: 'Piscina con iluminación, rodeada de jardín y terraza: para el sol de Ica y las noches templadas.',
    icon: 'pool',
    image: photoBySlug('piscina-iluminada-casa-vacacional-ica'),
    confirmed: true,
  },
  {
    id: 'terraza',
    name: 'Terraza',
    description: 'Terraza con piso de madera junto a la piscina, mesa exterior con sombrilla y patio techado con luces.',
    icon: 'sun',
    image: photoBySlug('terraza-deck-piscina-casa-leblanc'),
    confirmed: true,
  },
  {
    id: 'estacionamiento',
    name: 'Estacionamiento',
    /** TODO: confirmar con el propietario si existe, cuántos vehículos y si es techado. */
    description: '',
    icon: 'car',
    image: null,
    confirmed: false,
  },
  {
    id: 'entretenimiento',
    name: 'Áreas de entretenimiento',
    /** TODO: confirmar con el propietario qué equipamiento existe (karaoke, juegos, etc.). */
    description: '',
    icon: 'sparkles',
    image: null,
    confirmed: false,
  },
];
