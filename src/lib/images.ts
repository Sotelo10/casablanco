/**
 * Resolución de las fotografías de la propiedad.
 *
 * Las imágenes se colocan en `src/assets/property/` y se referencian por nombre
 * de archivo desde `src/data/*`. Al resolverse aquí pasan por el pipeline de
 * optimización de Astro (`astro:assets`): formatos modernos, tamaños
 * responsivos y dimensiones explícitas para evitar CLS.
 */
import type { ImageMetadata } from 'astro';
import type { GalleryImage, ImageOrientation } from '../types/content.js';

const propertyImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/property/**/*.{jpeg,jpg,png,webp,avif,gif,tiff}',
  { eager: true },
);

/**
 * Devuelve la imagen optimizable o `null` si todavía no existe el archivo.
 * `null` hace que la interfaz muestre el mockup con la proporción correcta.
 */
export function resolvePropertyImage(src: string | undefined): ImageMetadata | null {
  if (!src) return null;
  const key = `/src/assets/property/${src.replace(/^\/+/, '')}`;
  return propertyImages[key]?.default ?? null;
}

export interface ResponsiveSource {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

/**
 * Fotografías pregeneradas en `public/` (ver `scripts/optimize-media.mjs`):
 * devuelve `src` (variante intermedia, para navegadores sin `srcset`), el
 * `srcset` completo y las dimensiones intrínsecas. `null` si la imagen no es
 * de ese tipo.
 */
export function responsiveSource(image: GalleryImage): ResponsiveSource | null {
  const widths = image.widths;
  if (!widths || widths.length === 0) return null;
  const fallback = widths.includes(768) ? 768 : widths[widths.length - 1]!;
  return {
    src: `${image.src}-${fallback}.webp`,
    srcset: widths.map((w) => `${image.src}-${w}.webp ${w}w`).join(', '),
    width: image.width,
    height: image.height,
  };
}

/** Variante más grande: la que abre el lightbox. */
export function largestSource(image: GalleryImage): string {
  const widths = image.widths;
  if (!widths || widths.length === 0) return image.src;
  return `${image.src}-${widths[widths.length - 1]}.webp`;
}

/** Proporción CSS asociada a cada orientación de fotografía. */
export const aspectRatios: Record<ImageOrientation, string> = {
  landscape: '3 / 2',
  portrait: '4 / 5',
  square: '1 / 1',
};

/** Resolución mínima recomendada para cada orientación (guía de fotografía). */
export const recommendedSizes: Record<ImageOrientation, string> = {
  landscape: '2400 × 1600 px',
  portrait: '1600 × 2000 px',
  square: '1800 × 1800 px',
};

export const orientationLabels: Record<ImageOrientation, string> = {
  landscape: 'Horizontal 3:2',
  portrait: 'Vertical 4:5',
  square: 'Cuadrada 1:1',
};
