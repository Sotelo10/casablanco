/**
 * RESEÑAS
 * =============================================================================
 * Todavía no hay reseñas verificadas, así que la lista está vacía: la web no
 * publica opiniones de ejemplo. Mientras esté vacía, la sección de reseñas no
 * aparece en la portada, `/resenas` muestra un estado vacío con `noindex` y no
 * se emite `aggregateRating` en los datos estructurados.
 *
 * Para publicar reseñas reales (o conectarlas a Supabase, tabla `reviews`):
 *
 *   {
 *     id: 'r-001',
 *     guestName: 'Nombre del huésped',
 *     rating: 5,
 *     comment: 'Texto literal de la reseña.',
 *     source: 'airbnb',          // airbnb | booking | google | directo | otro
 *     publishedAt: '2026-11-15',
 *     approved: true,
 *     isDemo: false,
 *   }
 *
 * y elimina el filtro de `/resenas` en `astro.config.mjs` (sitemap).
 */
import type { Review } from '../types/content.js';

export const reviews: Review[] = [];
