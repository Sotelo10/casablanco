/**
 * Lógica de reseñas: obtención, orden y resumen (promedio, total y
 * distribución por estrellas). Los componentes no calculan nada por su cuenta.
 */
import type { Review, ReviewSummary } from '../../types/content.js';
import { findApprovedReviews } from '../repositories/reviews.repository.js';

export async function getReviews(limit?: number): Promise<Review[]> {
  const reviews = await findApprovedReviews();
  const sorted = [...reviews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

export function summarize(reviews: Review[]): ReviewSummary {
  const distribution: ReviewSummary['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[rating] += 1;
  }

  const total = reviews.length;
  const average =
    total > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : null;

  return {
    average: average === null ? null : Math.round(average * 10) / 10,
    total,
    distribution,
    isDemo: total > 0 && reviews.every((review) => review.isDemo),
  };
}

export async function getReviewSummary(): Promise<ReviewSummary> {
  return summarize(await findApprovedReviews());
}
