/**
 * REPOSITORIO DE CONTENIDO
 * =============================================================================
 * Galería, servicios y lugares cercanos. Mismo patrón que `reviews.repository`:
 * Supabase si está configurado, datos locales de `src/data/` en caso contrario
 * (o si la tabla está vacía, o si la consulta falla).
 *
 * Se ejecuta durante el build (servidor). El navegador no repite la consulta.
 */
import { amenities as localAmenities } from '../../data/amenities.js';
import { gallery as localGallery } from '../../data/gallery.js';
import { nearbyPlaces as localNearby } from '../../data/nearby.js';
import type {
  Amenity,
  AmenityGroup,
  GalleryCategory,
  GalleryImage,
  ImageOrientation,
  NearbyCategory,
  NearbyPlace,
} from '../../types/content.js';
import { getServerSupabaseClient } from '../supabase/server.js';
import type { AmenityRow, GalleryImageRow, NearbyPlaceRow } from '../supabase/types.js';
import { logWarning } from '../utils/logger.js';

const galleryCategoryValues: GalleryCategory[] = [
  'exterior',
  'sala',
  'comedor',
  'cocina',
  'habitaciones',
  'banos',
  'terraza',
  'jardin',
  'piscina',
  'comunes',
];

const orientationValues: ImageOrientation[] = ['landscape', 'portrait', 'square'];

const amenityGroupValues: AmenityGroup[] = [
  'esenciales',
  'cocina',
  'confort',
  'exterior',
  'seguridad',
  'servicios',
];

const nearbyCategoryValues: NearbyCategory[] = [
  'naturaleza',
  'gastronomia',
  'turismo',
  'actividades',
  'entretenimiento',
  'servicios',
];

function pick<T extends string>(values: T[], value: string, fallback: T): T {
  return values.includes(value as T) ? (value as T) : fallback;
}

function mapGalleryRow(row: GalleryImageRow): GalleryImage {
  return {
    src: row.storage_path,
    alt: row.alt,
    category: pick(galleryCategoryValues, row.category, 'comunes'),
    width: row.width ?? 0,
    height: row.height ?? 0,
    orientation: pick(orientationValues, row.orientation, 'landscape'),
    label: row.label,
    caption: row.caption ?? undefined,
    featured: row.featured,
  };
}

function mapAmenityRow(row: AmenityRow): Amenity {
  return {
    id: row.id,
    name: row.name,
    group: pick(amenityGroupValues, row.group_id, 'servicios'),
    icon: row.icon,
    detail: row.detail ?? undefined,
    confirmed: row.confirmed,
  };
}

function mapNearbyRow(row: NearbyPlaceRow): NearbyPlace {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    distance: row.distance,
    category: pick(nearbyCategoryValues, row.category, 'turismo'),
    image: row.image ?? '',
    icon: row.icon,
  };
}

export async function findGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return localGallery;

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    logWarning('gallery', error);
    return localGallery;
  }

  if (!data || data.length === 0) return localGallery;

  return data.map(mapGalleryRow);
}

export async function findAmenities(): Promise<Amenity[]> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return localAmenities;

  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    logWarning('amenities', error);
    return localAmenities;
  }

  if (!data || data.length === 0) return localAmenities;

  return data.map(mapAmenityRow);
}

export async function findNearbyPlaces(): Promise<NearbyPlace[]> {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return localNearby;

  const { data, error } = await supabase
    .from('nearby_places')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    logWarning('nearby', error);
    return localNearby;
  }

  if (!data || data.length === 0) return localNearby;

  return data.map(mapNearbyRow);
}
