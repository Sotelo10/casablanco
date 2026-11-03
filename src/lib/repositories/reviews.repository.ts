/**
 * REPOSITORIO DE RESEÑAS
 * =============================================================================
 * Patrón común a todos los repositorios: intenta leer de Supabase y, si no está
 * configurado, falla o no devuelve nada, usa los datos locales de `src/data/`.
 * La interfaz recibe siempre el mismo tipo de dominio y nunca se queda vacía.
 *
 * Se ejecuta durante el build (servidor). El navegador no repite la consulta.
 */
import { reviews as localReviews } from '../../data/reviews.js';
import type { Review, ReviewSource } from '../../types/content.js';
import { getServerSupabaseClient } from '../supabase/server.js';
import type { ReviewRow } from '../supabase/types.js';
import { logWarning } from '../utils/logger.js';

const validSources: ReviewSource[] = ['airbnb', 'booking', 'google', 'directo', 'otro'];

function mapRow(row: ReviewRow): Review {
  const source = validSources.includes(row.source as ReviewSource)
    ? (row.source as ReviewSource)
    : 'otro';

  return {
    id: row.id,
    guestName: row.guest_name,
    rating: row.rating,
    comment: row.comment,
    source,
    publishedAt: row.published_at,
    approved: row.approved,
    location: row.location ?? undefined,
    isDemo: false,
  };
}

const fallback = (): Review[] => localReviews.filter((review) => review.approved);

export async function findApprovedReviews(): Promise<Review[]> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return fallback();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('published_at', { ascending: false });

  if (error) {
    logWarning('reviews', error);
    return fallback();
  }

  // Tabla todavía vacía: mejor el contenido de ejemplo, marcado como tal, que
  // una página sin reseñas.
  if (!data || data.length === 0) return fallback();

  return data.map(mapRow);
}
