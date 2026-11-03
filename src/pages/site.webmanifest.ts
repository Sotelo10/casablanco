/**
 * Manifiesto web generado desde la configuración central, para que el nombre y
 * los colores no se dupliquen en un archivo estático.
 */
import type { APIRoute } from 'astro';
import { site } from '../config/site.js';
import { theme } from '../config/theme.js';
import { withBase } from '../lib/utils/url.js';

export const GET: APIRoute = () => {
  const manifest = {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: site.seo.locale,
    start_url: withBase('/'),
    scope: withBase('/'),
    display: 'standalone',
    background_color: theme.backgroundColor,
    theme_color: theme.themeColor,
    icons: [
      { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: withBase('/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
