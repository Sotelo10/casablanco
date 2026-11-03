/**
 * GALERÍA
 * =============================================================================
 * Fuente única de la galería: la usan la home, la página /galeria y el lightbox.
 *
 * CÓMO AÑADIR LAS FOTOGRAFÍAS REALES
 * -----------------------------------------------------------------------------
 * 1. Copia la imagen en `src/assets/property/` (p. ej. `exterior-01.jpg`).
 * 2. Escribe ese nombre de archivo en `src`.
 * 3. Rellena `width` y `height` con las dimensiones reales del archivo.
 * 4. Ajusta `alt` describiendo lo que se ve (importante para SEO y accesibilidad).
 *
 * Mientras `src` esté vacío se renderiza un mockup con la proporción exacta que
 * tendrá la fotografía, así el diseño no cambia al sustituirlo.
 */
import type { GalleryCategory, GalleryImage } from '../types/content.js';

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'sala', label: 'Sala' },
  { id: 'comedor', label: 'Comedor' },
  { id: 'cocina', label: 'Cocina' },
  { id: 'habitaciones', label: 'Habitaciones' },
  { id: 'banos', label: 'Baños' },
  { id: 'terraza', label: 'Terraza' },
  { id: 'jardin', label: 'Jardín' },
  { id: 'piscina', label: 'Piscina' },
  { id: 'comunes', label: 'Áreas comunes' },
];

export const gallery: GalleryImage[] = [
  {
    src: '',
    alt: 'Fachada de la casa vacacional en Ica',
    category: 'exterior',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Exterior · Fachada',
    featured: true,
  },
  {
    src: '',
    alt: 'Sala de estar de la casa',
    category: 'sala',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Sala de estar',
    featured: true,
  },
  {
    src: '',
    alt: 'Comedor principal',
    category: 'comedor',
    width: 0,
    height: 0,
    orientation: 'portrait',
    label: 'Comedor',
  },
  {
    src: '',
    alt: 'Cocina equipada',
    category: 'cocina',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Cocina',
  },
  {
    src: '',
    alt: 'Dormitorio principal',
    category: 'habitaciones',
    width: 0,
    height: 0,
    orientation: 'portrait',
    label: 'Dormitorio principal',
    featured: true,
  },
  {
    src: '',
    alt: 'Segundo dormitorio',
    category: 'habitaciones',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Dormitorio',
  },
  {
    src: '',
    alt: 'Baño completo',
    category: 'banos',
    width: 0,
    height: 0,
    orientation: 'portrait',
    label: 'Baño',
  },
  {
    src: '',
    alt: 'Terraza exterior',
    category: 'terraza',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Terraza',
    featured: true,
  },
  {
    src: '',
    alt: 'Jardín de la propiedad',
    category: 'jardin',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Jardín',
  },
  {
    src: '',
    alt: 'Piscina',
    category: 'piscina',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Piscina',
    featured: true,
  },
  {
    src: '',
    alt: 'Zona de descanso al aire libre',
    category: 'piscina',
    width: 0,
    height: 0,
    orientation: 'portrait',
    label: 'Zona de descanso',
  },
  {
    src: '',
    alt: 'Área común de la casa',
    category: 'comunes',
    width: 0,
    height: 0,
    orientation: 'landscape',
    label: 'Áreas comunes',
  },
];

/** Imagen principal del hero. Se sustituye igual que el resto de la galería. */
export const heroImage: GalleryImage = {
  src: '',
  alt: 'Vista general de la casa vacacional en Ica',
  category: 'exterior',
  width: 0,
  height: 0,
  orientation: 'landscape',
  label: 'Imagen principal',
};

/** Retrato editorial usado en la sección introductoria. */
export const introImage: GalleryImage = {
  src: '',
  alt: 'Detalle de los espacios interiores de la casa',
  category: 'sala',
  width: 0,
  height: 0,
  orientation: 'portrait',
  label: 'Interiores',
};
