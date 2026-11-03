/** Construcción de metadatos por página. */
import { site } from '../../config/site.js';
import { normalizePath, withBase } from '../utils/url.js';

export interface PageMeta {
  /** Título propio de la página, sin el nombre del sitio. */
  title: string;
  description: string;
  /** Ruta absoluta del sitio, p. ej. `/galeria`. */
  path?: string;
  /** Evita indexar páginas sin valor de búsqueda (404, agradecimientos…). */
  noindex?: boolean;
  type?: 'website' | 'article';
  image?: string;
}

/**
 * Título completo: `Página | Casa Leblanc`. Si el título ya incluye la marca
 * (portada, títulos SEO a medida) se usa tal cual, sin duplicarla.
 */
export function buildTitle(title: string, isHome = false): string {
  const name = site.name;
  if (title.includes(name)) return title;
  if (isHome) return `${name} | ${site.tagline}`;
  return `${title} | ${name}`;
}

/**
 * URL canónica sin barra final (consistente con `trailingSlash: 'never'`).
 * `pathname` es `Astro.url.pathname`, que ya incluye el `base` configurado
 * (p. ej. `/casablanco/casa` en GitHub Pages), así que no se vuelve a prefijar.
 */
export function canonicalUrl(pathname: string, origin: URL | string | undefined): string {
  const base = origin ? new URL(origin).origin : '';
  return `${base}${normalizePath(pathname)}`;
}

/** Ruta absoluta de un recurso público (imagen social, manifest…). */
export function absoluteUrl(path: string, origin: URL | string | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  const base = origin ? new URL(origin).origin : '';
  return `${base}${withBase(path.startsWith('/') ? path : `/${path}`)}`;
}
