/**
 * Servicios de contenido usados por las páginas. Encapsulan el origen de datos
 * (hoy locales, mañana Supabase) y aplican los filtros de presentación.
 */
import { featuredAmenityIds } from '../../data/amenities.js';
import { faqs } from '../../data/faq.js';
import type { Amenity, FaqItem, GalleryImage, NearbyCategory, NearbyPlace } from '../../types/content.js';
import {
  findAmenities,
  findGalleryImages,
  findNearbyPlaces,
} from '../repositories/content.repository.js';

export async function getGallery(): Promise<GalleryImage[]> {
  return findGalleryImages();
}

/** Selección destacada para los mosaicos de portada. */
export async function getFeaturedGallery(limit = 5): Promise<GalleryImage[]> {
  const images = await findGalleryImages();
  const featured = images.filter((image) => image.featured);
  return (featured.length >= limit ? featured : images).slice(0, limit);
}

export async function getAmenities(): Promise<Amenity[]> {
  return findAmenities();
}

export async function getFeaturedAmenities(): Promise<Amenity[]> {
  const amenities = await findAmenities();
  const featured = amenities.filter((amenity) => featuredAmenityIds.includes(amenity.id));
  return featured.length > 0 ? featured : amenities.slice(0, 6);
}

export async function getNearbyPlaces(category?: NearbyCategory): Promise<NearbyPlace[]> {
  const places = await findNearbyPlaces();
  return category ? places.filter((place) => place.category === category) : places;
}

export function getFaqs(): FaqItem[] {
  return faqs;
}

/** Sólo las preguntas con respuesta definitiva se publican como FAQPage. */
export function getPublishableFaqs(): FaqItem[] {
  return faqs.filter((faq) => !faq.isPlaceholder);
}
