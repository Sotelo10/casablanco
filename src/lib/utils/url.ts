/** Normalización de rutas para canonical, migas y estado activo del menú. */

/**
 * Prefija una ruta interna con el `base` de Astro (`import.meta.env.BASE_URL`).
 * En local `base` es `/`, así que no cambia nada; en GitHub Pages es
 * `/casablanco/` y la ruta resultante incluye ese prefijo. Las rutas externas
 * (`http(s):`, `mailto:`, `tel:`) y las ancla (`#...`) se devuelven tal cual.
 */
export function withBase(path: string): string {
  if (!path || !path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${path}`;
}

/**
 * Devuelve la ruta pública de una URL de compilación.
 * Con `build.format: 'file'` Astro genera `/casa.html`; la ruta pública es
 * `/casa`, y es la que debe aparecer en canonical, sitemap y enlaces.
 */
export function normalizePath(pathname: string): string {
  const withoutIndex = pathname.replace(/index\.html$/, '');
  const withoutExtension = withoutIndex.replace(/\.html$/, '');
  const withoutTrailing = withoutExtension.replace(/\/+$/, '');
  return withoutTrailing === '' ? '/' : withoutTrailing;
}

/** `true` si `href` es la página actual o una de sus secciones. */
export function isActivePath(href: string, currentPath: string): boolean {
  const current = normalizePath(currentPath);
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}
