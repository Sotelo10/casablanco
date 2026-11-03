// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/**
 * Dominio público del sitio. Se usa para canonical, Open Graph, sitemap y robots.
 * Cámbialo en `.env` (SITE_URL) antes de desplegar a producción.
 */
const site = SITE_URL || 'https://www.example.com';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ lastmod: new Date() })],
  /**
   * Tipografía autoalojada. Las familias se descargan en el build y se sirven
   * desde el propio dominio: no hay peticiones a terceros en runtime.
   *
   * General Sans        → interfaz y texto (geométrica luminosa, muy legible).
   * Boska               → titulares (serif de alto contraste, hospitalidad).
   * Petit Formal Script → firma manuscrita, sólo en detalles de identidad.
   */
  fonts: [
    {
      name: 'General Sans',
      cssVariable: '--font-general-sans',
      provider: fontProviders.fontshare(),
      weights: [400, 500, 600],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
      display: 'swap',
    },
    {
      name: 'Boska',
      cssVariable: '--font-boska',
      provider: fontProviders.fontshare(),
      /* Los titulares usan un solo peso y estilo: menos archivos y la misma
         presencia. La cursiva puntual de los marcadores la resuelve el
         navegador. */
      weights: [400],
      styles: ['normal'],
      fallbacks: ['Georgia', 'serif'],
      optimizedFallbacks: true,
      display: 'swap',
    },
    {
      name: 'Petit Formal Script',
      cssVariable: '--font-petit-script',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
      display: 'swap',
    },
  ],
  /**
   * Variables de entorno tipadas y validadas. Todas son `PUBLIC_*`: se incrustan
   * en el build y viajan al navegador, que es exactamente para lo que sirven.
   *
   * El proyecto NO declara ninguna variable secreta. La clave `service_role` de
   * Supabase no se usa en ninguna parte: el navegador escribe con la clave
   * pública y quien decide qué puede hacer son las políticas RLS del esquema.
   * Si algún día hace falta (por ejemplo, un panel de administración con
   * adaptador SSR), se declara aquí con `context: 'server', access: 'secret'` y
   * se usa sólo desde `src/lib/supabase/server.ts`.
   *
   * Ver `.env.example`.
   */
  env: {
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_GOOGLE_MAPS_API_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_GA_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
    },
  },
});
