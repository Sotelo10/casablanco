/** Normalización de rutas para canonical, migas y estado activo del menú. */

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
