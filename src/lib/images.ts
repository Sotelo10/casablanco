/**
 * Resolución de las fotografías de la propiedad.
 *
 * Las imágenes se colocan en `src/assets/property/` y se referencian por nombre
 * de archivo desde `src/data/*`. Al resolverse aquí pasan por el pipeline de
 * optimización de Astro (`astro:assets`): formatos modernos, tamaños
 * responsivos y dimensiones explícitas para evitar CLS.
 */
import type { ImageMetadata } from 'astro';
import type { ImageOrientation } from '../types/content.js';

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
