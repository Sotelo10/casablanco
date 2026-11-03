/**
 * CLIENTE DE SUPABASE PARA EL SERVIDOR (build)
 * =============================================================================
 * Lo usan los repositorios cuando Astro genera el sitio. Al ser un build
 * estático, estas consultas ocurren una sola vez en tu máquina o en el CI, y su
 * resultado queda incrustado en el HTML: el visitante nunca las repite.
 *
 * Está separado del cliente del navegador a propósito. Es el único lugar del
 * proyecto donde tendría sentido añadir credenciales elevadas si algún día
 * hicieran falta (por ejemplo, un panel de administración con adaptador SSR),
 * y el guardia de abajo garantiza que este módulo no acabe en un bundle
 * público por accidente.
 *
 * Hoy usa la misma clave `anon` que el navegador: todo lo que lee es contenido
 * público, así que no hay ninguna razón para usar `service_role`.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../../config/env.js';
import type { Database } from './types.js';

export type ServerSupabaseClient = SupabaseClient<Database>;

let cachedClient: ServerSupabaseClient | null = null;
let pendingClient: Promise<ServerSupabaseClient> | null = null;

/**
 * Cliente de servidor, o `null` si Supabase todavía no está configurado.
 * Lanza si alguien lo importa desde código de navegador: es la red de seguridad
 * que impide filtrar credenciales de servidor al cliente el día que existan.
 */
export async function getServerSupabaseClient(): Promise<ServerSupabaseClient | null> {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[supabase] `server.ts` sólo puede usarse en el servidor. En el navegador, usa `client.ts`.',
    );
  }

  if (!isSupabaseConfigured()) return null;
  if (cachedClient) return cachedClient;

  pendingClient ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(env.supabase.url, env.supabase.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { 'x-application-name': 'casa-blanco-build' } },
    }),
  );

  cachedClient = await pendingClient;
  return cachedClient;
}
