/**
 * Modelos de dominio del contenido de la propiedad.
 *
 * Estas interfaces son el contrato entre la UI y el origen de datos. Hoy los
 * datos viven en `src/data/*`; cuando se conecte Supabase, los repositorios
 * devolverán exactamente estas mismas formas y la UI no cambia.
 */

/** Categorías usadas para agrupar y filtrar la galería. */
export type GalleryCategory =
  | 'exterior'
  | 'sala'
  | 'comedor'
  | 'cocina'
  | 'habitaciones'
  | 'banos'
  | 'terraza'
  | 'jardin'
  | 'piscina'
  | 'comunes';

/** Orientación esperada de la fotografía. Define la caja del placeholder. */
export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export interface GalleryImage {
  /**
   * Nombre del archivo dentro de `src/assets/property/` (por ejemplo
   * `exterior-01.jpg`), que pasa por el optimizador de Astro, o una URL
   * absoluta (por ejemplo de Supabase Storage), que se enlaza tal cual.
   * Vacío = todavía no hay fotografía y se muestra un mockup con la proporción
   * exacta que tendrá la imagen real.
   *
   * La imagen del hero debe ser siempre un archivo local: es la que marca el
   * LCP y necesita el `srcset` que genera el build.
   */
  src: string;
  /** Texto alternativo. Obligatorio por accesibilidad y SEO. */
  alt: string;
  category: GalleryCategory;
  /** Dimensiones reales de la foto. 0 mientras sea un placeholder. */
  width: number;
  height: number;
  orientation: ImageOrientation;
  /** Etiqueta corta mostrada sobre el mockup y en el lightbox. */
  label: string;
  /** Pie de foto opcional. */
  caption?: string;
  /** Marca la imagen como destacada dentro del mosaico editorial. */
  featured?: boolean;
}

export type AmenityGroup =
  | 'esenciales'
  | 'cocina'
  | 'confort'
  | 'exterior'
  | 'seguridad'
  | 'servicios';

export interface Amenity {
  id: string;
  name: string;
  group: AmenityGroup;
  /** Clave de icono resuelta por `components/ui/Icon.astro`. */
  icon: string;
  /** Detalle breve opcional (por ejemplo, "2 plazas techadas"). */
  detail?: string;
  /**
   * `true` sólo cuando el dato esté verificado con la propiedad real.
   * Mientras sea `false` la UI lo muestra como "por confirmar" y nunca afirma
   * que el servicio existe.
   */
  confirmed: boolean;
}

export interface PropertySpace {
  id: string;
  name: string;
  /** Descripción breve del espacio. */
  description: string;
  /** Camas del espacio, cuando aplique. `null` mientras no haya dato real. */
  beds: string | null;
  icon: string;
}

export interface PropertyFacts {
  guests: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  /** Superficie en m². `null` mientras no haya dato real. */
  area: number | null;
}

export type NearbyCategory =
  | 'naturaleza'
  | 'gastronomia'
  | 'turismo'
  | 'actividades'
  | 'entretenimiento'
  | 'servicios';

export interface NearbyPlace {
  id: string;
  name: string;
  description: string;
  /**
   * Tiempo o distancia desde la propiedad. `null` mientras no se confirme:
   * la UI renderiza `[X min]` en lugar de inventar un valor.
   */
  distance: string | null;
  category: NearbyCategory;
  /** Archivo en `src/assets/property/` o URL absoluta; vacío = placeholder. */
  image: string;
  icon: string;
}

export type ReviewSource = 'airbnb' | 'booking' | 'google' | 'directo' | 'otro';

export interface Review {
  id: string;
  guestName: string;
  /** Puntuación de 1 a 5. */
  rating: number;
  comment: string;
  source: ReviewSource;
  /** Fecha ISO (YYYY-MM-DD). */
  publishedAt: string;
  /** Sólo se muestran las reseñas aprobadas. */
  approved: boolean;
  /** País o ciudad del huésped, opcional. */
  location?: string;
  /**
   * `true` mientras la reseña sea contenido de demostración. La UI lo señala
   * explícitamente para no presentar opiniones ficticias como reales.
   */
  isDemo: boolean;
}

export interface ReviewSummary {
  /** Promedio redondeado a un decimal, o `null` si no hay reseñas. */
  average: number | null;
  total: number;
  /** Número de reseñas por puntuación: `distribution[5]`, `distribution[4]`… */
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  /** `true` si todas las reseñas mostradas son de demostración. */
  isDemo: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** `true` cuando la respuesta aún es un texto de ejemplo. */
  isPlaceholder: boolean;
}

export interface ExperienceCategory {
  id: NearbyCategory;
  title: string;
  description: string;
  icon: string;
}
