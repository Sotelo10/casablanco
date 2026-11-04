/**
 * MEDIOS DEL HERO
 * =============================================================================
 * Vídeo de fondo de la portada, generado a partir de la fotografía nocturna de
 * la fachada y la piscina (`public/ChatGPT Image 3 nov 2026, 08_32_35 a.m.png`)
 * con un movimiento de cámara lento tipo Ken Burns. No añade movimiento que no
 * exista en la fotografía: sólo zoom y desplazamiento de encuadre.
 *
 * Se regenera con `node scripts/generate-hero-video.mjs` (requiere ffmpeg).
 *
 * - `desktop`: 1600×900, la resolución más alta que permite el original
 *   (1672×941) sin ampliarlo.
 * - `mobile`: 960×540, para pantallas pequeñas y conexiones móviles.
 * - Cada versión existe en WebM (VP9, más ligera; Chrome, Edge, Firefox) y en
 *   MP4 H.264 (Safari y cualquier navegador sin VP9). El navegador elige.
 * - `poster`: primer fotograma del vídeo en WebP (y JPG de respaldo); es la
 *   imagen LCP y el respaldo si el vídeo no carga o no debe reproducirse.
 */
import { withBase } from '../lib/utils/url.js';

export interface HeroMedia {
  video: {
    desktop: { webm: string; mp4: string };
    mobile: { webm: string; mp4: string };
  } | null;
  poster: {
    /** Ruta base sin sufijo: cada variante vive en `${base}-${ancho}.webp`. */
    base: string;
    widths: number[];
    /** JPG de respaldo para navegadores sin WebP y para redes sociales. */
    fallback: string;
    width: number;
    height: number;
    alt: string;
  };
}

export const heroMedia: HeroMedia = {
  video: {
    desktop: {
      webm: withBase('/videos/casa-leblanc-hero.webm'),
      mp4: withBase('/videos/casa-leblanc-hero.mp4'),
    },
    mobile: {
      webm: withBase('/videos/casa-leblanc-hero-960.webm'),
      mp4: withBase('/videos/casa-leblanc-hero-960.mp4'),
    },
  },
  poster: {
    base: withBase('/images/casa-leblanc/hero/casa-leblanc-hero-poster'),
    widths: [640, 960, 1600],
    fallback: withBase('/images/casa-leblanc/hero/casa-leblanc-hero-poster-1600.jpg'),
    width: 1600,
    height: 900,
    alt: 'Casa Leblanc de noche: fachada blanca de dos plantas con ventanales iluminados, piscina turquesa, jardín y terraza con sombrilla',
  },
};

/** `srcset` del póster en WebP. */
export const heroPosterSrcset = heroMedia.poster.widths
  .map((width) => `${heroMedia.poster.base}-${width}.webp ${width}w`)
  .join(', ');

export const heroPosterSrc = `${heroMedia.poster.base}-${heroMedia.poster.widths.at(-1)}.webp`;
