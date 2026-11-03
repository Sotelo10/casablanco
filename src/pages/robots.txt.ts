/**
 * robots.txt generado a partir del dominio configurado en `astro.config.mjs`,
 * de modo que la URL del sitemap siempre es correcta en cada entorno.
 */
import type { APIRoute } from 'astro';
import { withBase } from '../lib/utils/url.js';

export const GET: APIRoute = ({ site }) => {
  const sitemap = site ? new URL(withBase('/sitemap-index.xml'), site).href : '/sitemap-index.xml';

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
