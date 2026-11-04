/**
 * GALERÍA
 * =============================================================================
 * Fuente única de la galería: la usan la home, la página /galeria, el lightbox
 * y las composiciones editoriales de cada página.
 *
 * Todas las fotografías son reales y vienen de los originales del propietario
 * (`media/originales/`). `scripts/optimize-media.mjs` las convierte a WebP en
 * varios anchos y escribe sus dimensiones en `photos.generated.json`; aquí sólo
 * se añade lo editorial: texto alternativo, etiqueta y categoría.
 *
 * CÓMO AÑADIR UNA FOTOGRAFÍA
 * -----------------------------------------------------------------------------
 * 1. Copia el original en `media/originales/` y añádelo a
 *    `scripts/media-manifest.json` con su carpeta y su slug.
 * 2. Ejecuta `node scripts/optimize-media.mjs`.
 * 3. Añade aquí una entrada con el mismo slug. El ALT describe lo que se ve,
 *    sin repetir palabras clave.
 */
import type { GalleryCategory, GalleryImage, ImageOrientation } from '../types/content.js';
import { withBase } from '../lib/utils/url.js';
import generated from './photos.generated.json';

/**
 * Categorías de la galería, en el orden en que se presentan. Una categoría sin
 * fotografías no se muestra: "Experiencias" queda lista para cuando haya
 * fotografías reales de huéspedes o de momentos en la casa.
 */
export const galleryCategories: { id: GalleryCategory; label: string; description: string }[] = [
  { id: 'piscina', label: 'Piscina', description: 'La piscina iluminada y su entorno.' },
  { id: 'dormitorios', label: 'Dormitorios', description: 'Camas matrimoniales, camarotes y camas individuales.' },
  { id: 'interiores', label: 'Interiores', description: 'Cocina y baños.' },
  { id: 'terraza', label: 'Terraza', description: 'Terraza de madera y patio techado con luces.' },
  { id: 'comunes', label: 'Áreas comunes', description: 'Sala de estar, jardín y comedor exterior.' },
  { id: 'experiencias', label: 'Experiencias', description: 'Momentos vividos en la casa.' },
];

type PhotoSlug = keyof typeof generated.photos;

interface PhotoEntry {
  slug: PhotoSlug;
  alt: string;
  label: string;
  category: GalleryCategory;
  /** Punto focal (`object-position`) cuando la pieza se recorta. */
  focus?: string;
  featured?: boolean;
}

/** Une los datos editoriales con las dimensiones reales generadas. */
function photo({ slug, ...entry }: PhotoEntry): GalleryImage {
  const file = generated.photos[slug];
  const ratio = file.width / file.height;
  const orientation: ImageOrientation =
    ratio > 1.05 ? 'landscape' : ratio < 0.95 ? 'portrait' : 'square';

  return {
    ...entry,
    src: withBase(file.src),
    widths: file.widths,
    width: file.width,
    height: file.height,
    orientation,
  };
}

/**
 * El orden sigue el ritmo del mosaico (ver `GalleryGrid.astro`): fila ancha +
 * estrecha, fila de tres verticales, fila estrecha + ancha, fila de dos
 * horizontales. Así cada fotografía cae en una celda de proporción parecida
 * a la suya y apenas se recorta. Las cinco primeras son las destacadas de la
 * portada.
 */
export const gallery: GalleryImage[] = [
  photo({
    slug: 'casa-leblanc-ica-fachada-piscina-noche',
    alt: 'Fachada de dos plantas de Casa Leblanc con la piscina iluminada de noche',
    label: 'Fachada y piscina',
    category: 'piscina',
    focus: '50% 42%',
    featured: true,
  }),
  photo({
    slug: 'sala-de-estar-casa-leblanc',
    alt: 'Sala de estar con sofá seccional y ventanales corredizos hacia el exterior',
    label: 'Sala de estar',
    category: 'comunes',
    focus: '50% 60%',
    featured: true,
  }),
  photo({
    slug: 'patio-pergola-jardin-casa-leblanc',
    alt: 'Patio techado con luces colgantes, sendero entre el jardín y la casa al fondo',
    label: 'Patio y jardín',
    category: 'terraza',
    featured: true,
  }),
  photo({
    slug: 'dormitorio-cama-matrimonial-casa-leblanc',
    alt: 'Dormitorio con cama matrimonial, toallas dobladas y clóset empotrado',
    label: 'Dormitorio',
    category: 'dormitorios',
    featured: true,
  }),
  photo({
    slug: 'bano-ducha-vidrio-casa-leblanc',
    alt: 'Baño con mueble de madera, espejo redondo iluminado y ducha con mampara de vidrio',
    label: 'Baño',
    category: 'interiores',
    featured: true,
  }),
  photo({
    slug: 'terraza-deck-piscina-casa-leblanc',
    alt: 'Terraza con piso de madera junto a la piscina y el jardín, de noche',
    label: 'Terraza',
    category: 'terraza',
    focus: '50% 55%',
  }),
  photo({
    slug: 'cocina-equipada-casa-leblanc-ica',
    alt: 'Cocina con refrigeradora de acero, cocina con horno y muebles de madera',
    label: 'Cocina',
    category: 'interiores',
  }),
  photo({
    slug: 'piscina-zona-comedor-exterior-casa-leblanc',
    alt: 'Piscina, jardín y mesa exterior con sombrilla, con apliques de luz en los muros',
    label: 'Piscina y jardín',
    category: 'comunes',
  }),
  photo({
    slug: 'piscina-jardin-alojamiento-ica',
    alt: 'Vista nocturna de la piscina iluminada con la terraza y la zona de sombrilla',
    label: 'Piscina de noche',
    category: 'piscina',
  }),
  photo({
    slug: 'habitacion-camarotes-casa-leblanc',
    alt: 'Habitación con dos camarotes de madera',
    label: 'Habitación con camarotes',
    category: 'dormitorios',
  }),
  photo({
    slug: 'dormitorio-matrimonial-closet-casa-leblanc',
    alt: 'Dormitorio con cama matrimonial, clóset empotrado y apliques de luz',
    label: 'Dormitorio',
    category: 'dormitorios',
    focus: '50% 70%',
  }),
  photo({
    slug: 'habitacion-camas-individuales-casa-leblanc',
    alt: 'Habitación con dos camas individuales junto a un ventanal corredizo',
    label: 'Camas individuales',
    category: 'dormitorios',
  }),
  photo({
    slug: 'piscina-iluminada-casa-vacacional-ica',
    alt: 'Piscina iluminada frente a la terraza, el jardín y la sala de la casa',
    label: 'Piscina',
    category: 'piscina',
  }),
  photo({
    slug: 'dormitorio-cama-doble-casa-leblanc',
    alt: 'Dormitorio con cama matrimonial y apliques de luz en la pared',
    label: 'Dormitorio',
    category: 'dormitorios',
  }),
  photo({
    slug: 'bano-completo-casa-leblanc',
    alt: 'Baño completo con lavatorio, espejo y ducha con mampara de vidrio',
    label: 'Baño',
    category: 'interiores',
    focus: '50% 60%',
  }),
  photo({
    slug: 'dormitorio-dos-camas-casa-leblanc',
    alt: 'Dormitorio con dos camas individuales con mantas a rayas',
    label: 'Dormitorio',
    category: 'dormitorios',
  }),
];

/** Busca una fotografía por su slug (falla en el build si no existe). */
export function photoBySlug(slug: PhotoSlug): GalleryImage {
  const found = gallery.find((image) => image.src.endsWith(`/${slug}`));
  if (!found) throw new Error(`Fotografía no encontrada: ${slug}`);
  return found;
}

/** Imagen principal: la que mejor resume la casa. También es la social. */
export const heroImage: GalleryImage = photoBySlug('casa-leblanc-ica-fachada-piscina-noche');

/** Retrato editorial de la sección de presentación. */
export const introImage: GalleryImage = photoBySlug('piscina-iluminada-casa-vacacional-ica');

/* El vídeo de la portada vive en `src/data/hero.ts`. El recorrido vertical
   anterior (`public/video/`) se conserva, pero ya no se usa. */
