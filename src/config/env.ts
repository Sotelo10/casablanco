/**
 * VARIABLES DE ENTORNO
 * =============================================================================
 * Punto único de lectura del entorno. Ningún otro archivo comprueba
 * `import.meta.env` por su cuenta: si mañana cambia una variable, se cambia
 * aquí y nada más.
 *
 * Las variables se declaran y validan en `astro.config.mjs` (`env.schema`) y se
 * documentan en `.env.example`. Todas las que se leen aquí son `PUBLIC_*`, es
 * decir, pensadas para viajar al navegador. El proyecto no usa ninguna clave
 * secreta: la seguridad vive en las políticas RLS de la base de datos.
 */
import {
  PUBLIC_GA_ID,
  PUBLIC_GOOGLE_MAPS_API_KEY,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from 'astro:env/client';

const clean = (value: string | undefined): string => (value ?? '').trim();

export const env = {
  supabase: {
    url: clean(PUBLIC_SUPABASE_URL),
    anonKey: clean(PUBLIC_SUPABASE_ANON_KEY),
  },
  googleMapsApiKey: clean(PUBLIC_GOOGLE_MAPS_API_KEY),
  gaId: clean(PUBLIC_GA_ID),
} as const;

/**
 * `true` cuando hay credenciales de Supabase utilizables.
 *
 * Comprueba la forma, no sólo que haya texto: un `.env` a medio rellenar (una
 * URL sin `https://`, la clave todavía con el marcador de ejemplo) haría fallar
 * cada petición en silencio. Es preferible seguir en modo "no conectado".
 *
 * Ésta es la única función que decide si Supabase está activo. Todo el resto
 * del proyecto la usa en lugar de mirar las variables directamente.
 */
export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = env.supabase;
  return /^https?:\/\/[^\s]+$/.test(url) && anonKey.length >= 30;
};

/** `true` cuando se puede incrustar el mapa de Google. */
export const isMapsConfigured = (): boolean => env.googleMapsApiKey.length > 0;

/** `true` cuando Analytics debe cargarse. */
export const isAnalyticsEnabled = (): boolean => env.gaId.length > 0;
