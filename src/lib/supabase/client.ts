/**
 * CLIENTE PÚBLICO DE SUPABASE (navegador)
 * =============================================================================
 * Lo usa el código que se ejecuta en el navegador: hoy, sólo el envío del
 * formulario de reserva.
 *
 * Tres decisiones importantes:
 *
 * 1. Sólo la clave `anon`. Es pública por diseño y está limitada por las
 *    políticas RLS de `supabase/schema.sql`. La `service_role` no se usa en
 *    ninguna parte del proyecto y no debe llegar nunca aquí.
 * 2. Carga diferida (`import()` dinámico). La librería queda en un chunk aparte
 *    que sólo se descarga cuando alguien envía el formulario: las páginas que
 *    no la necesitan no pagan nada.
 * 3. Sin sesión persistente. El sitio no tiene login, así que no escribe nada
 *    en `localStorage` ni renueva tokens en segundo plano.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '../../config/env.js';
import type { Database } from './types.js';

export type AppSupabaseClient = SupabaseClient<Database>;

let cachedClient: AppSupabaseClient | null = null;
let pendingClient: Promise<AppSupabaseClient> | null = null;

/**
 * Cliente público, o `null` si Supabase todavía no está configurado.
 * Quien lo llama debe tratar el `null` como "backend no conectado", nunca como
 * un error de red.
 */
export async function getPublicSupabaseClient(): Promise<AppSupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  if (cachedClient) return cachedClient;

  // Dos envíos simultáneos comparten la misma promesa: un solo cliente.
  pendingClient ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(env.supabase.url, env.supabase.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { 'x-application-name': 'casa-blanco' } },
    }),
  );

  cachedClient = await pendingClient;
  return cachedClient;
}

export { isSupabaseConfigured };
