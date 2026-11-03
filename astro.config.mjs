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

if (!SITE_URL) {
  console.warn(
    '\n⚠  SITE_URL no está definido: canonical, sitemap, robots y Open Graph usarán ' +
      'https://www.example.com. Define el dominio real en .env antes de publicar.\n',
  );
}

/**
 * Despliegue de previsualización en GitHub Pages (repo `casablanco`), servido
 * bajo `/casablanco/`. Sólo se activa dentro de GitHub Actions
 * (`GITHUB_ACTIONS=true`): en local y en la build de producción real el sitio
 * sigue viviendo en la raíz (`/`).
 */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site,
  base: isGitHubPages ? '/casablanco/' : '/',
  trailingSlash: 'never',
  build: {
    format: 'file',
    /* CSS en línea: elimina las hojas de estilo que bloquean el render (una
       ida y vuelta de red menos por archivo en móvil). Comprimido con gzip o
       brotli, el sobrecoste en el HTML es de pocos KB. */
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      lastmod: new Date(),
      /* `/resenas` no se indexa mientras no haya reseñas reales (ver
         `src/data/reviews.ts`). Quita este filtro cuando se publiquen. */
      filter: (page) => !/\/resenas\/?$/.test(page),
    }),
  ],
  /**
   * Tipografía autoalojada. Las familias se descargan en el build como WOFF2 y
   * se sirven desde el propio dominio: no hay peticiones a terceros en runtime.
   *
   * Cormorant Garamond → titulares editoriales (serif clásica de alto contraste).
   * Manrope            → texto, navegación, botones y elementos funcionales.
   */
  fonts: [
    {
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      provider: fontProviders.google(),
      weights: [500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
      optimizedFallbacks: true,
      display: 'swap',
    },
    {
      name: 'Manrope',
      cssVariable: '--font-manrope',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
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
