/**
 * CONFIGURACIÓN CENTRAL DEL SITIO
 * =============================================================================
 * Todo lo editable de la propiedad vive aquí. Es la única fuente de verdad para
 * el header, el footer, los metadatos, los datos estructurados (Schema.org),
 * WhatsApp, Google Maps y la consistencia NAP (Name · Address · Phone).
 *
 * CÓMO PERSONALIZARLO
 * -----------------------------------------------------------------------------
 * 1. Sustituye los valores marcados con `[...]` y las cadenas vacías.
 * 2. Los campos `null` o `''` se consideran "sin dato": la interfaz muestra un
 *    marcador visible en lugar de inventar información.
 * 3. Cuando termines, cambia `content.isPlaceholder` a `false` para ocultar los
 *    avisos de contenido de ejemplo.
 */
import type { SiteConfig } from '../types/site.js';

export const site = {
  name: 'Casa Leblanc',
  shortName: 'Casa Leblanc',
  tagline: 'Casa vacacional y alojamiento en Ica, Perú',
  /** Descripción base para metadatos y datos estructurados. */
  description:
    'Casa Leblanc es una casa vacacional en Ica, Perú, cerca de Huacachina: casa de dos plantas con piscina iluminada, jardín, terraza, sala, cocina y dormitorios para familias y grupos. Reserva directa con el anfitrión.',

  location: {
    city: 'Ica',
    region: 'Ica',
    country: 'Perú',
    countryCode: 'PE',
    /** TODO: calle y número exactos. */
    address: '',
    /** Zona publicada por la propia marca en su perfil oficial de Instagram
        ("Huacachina - Ica - Perú"). */
    area: 'Huacachina',
    /** TODO: referencia para llegar (p. ej. "a dos cuadras de …"). */
    reference: '',
    postalCode: '',
    /** TODO: coordenadas reales. Sin ellas no se emite el schema `geo`. */
    latitude: null,
    longitude: null,
    /** TODO: enlace a la ficha de Google Maps / Google Business Profile. */
    googleMapsUrl: '',
    googlePlaceId: '',
  },

  contact: {
    /** Número de contacto publicado en el perfil oficial de Instagram. */
    phone: '+51 948 898 400',
    /**
     * Mismo número, en formato wa.me. VERIFICAR con el propietario que la
     * línea tiene WhatsApp activo (el perfil lo publica como "contacto").
     */
    whatsapp: '51948898400',
    /** TODO: correo de contacto. */
    email: '',
    /** Horario de atención: vacío hasta que el propietario lo confirme. */
    hours: '',
  },

  social: {
    instagram: 'https://www.instagram.com/casa_leblanc26/',
    facebook: 'https://www.facebook.com/profile.php?id=61586105676935',
    tiktok: 'https://www.tiktok.com/@casa_leblanc',
    airbnb: '',
    booking: '',
  },

  /**
   * Datos objetivos del inmueble. Se muestran en el hero, en "La casa" y en los
   * datos estructurados. Mantener en `null` hasta tener la información real.
   */
  property: {
    guests: null,
    bedrooms: null,
    beds: null,
    bathrooms: null,
    area: null,
  },

  booking: {
    /** TODO: rango de precios (formato Schema.org). Vacío = no se publica. */
    priceRange: '',
    currency: 'PEN',
    /** TODO: horarios reales de check-in / check-out. */
    checkIn: '',
    checkOut: '',
    minNights: null,
  },

  seo: {
    locale: 'es-PE',
    ogLocale: 'es_PE',
    /** Imagen social 1200×630 generada por `scripts/optimize-media.mjs`. */
    ogImage: '/images/casa-leblanc/og/casa-leblanc-ica-peru.jpg',
    ogImageAlt: 'Piscina iluminada y fachada de Casa Leblanc de noche, en Ica, Perú',
    twitterHandle: '',
  },

  content: {
    isPlaceholder: false,
    placeholderLabel: 'Por confirmar',
  },
} satisfies SiteConfig;

export type Site = typeof site;

/** Nombre visible con respaldo seguro para textos y metadatos. */
export const siteName = site.name;

/** `true` cuando hay datos suficientes para enlazar a Google Maps. */
export const hasCoordinates =
  typeof site.location.latitude === 'number' && typeof site.location.longitude === 'number';

/** Une las partes con coma, descartando vacíos y repeticiones. */
function joinUnique(parts: string[], separator = ', '): string {
  return parts
    .map((part) => part.trim())
    .filter((part, index, all) => part.length > 0 && all.indexOf(part) === index)
    .join(separator);
}

/**
 * Dirección en una línea, omitiendo las partes sin dato y sin repetir nombres
 * (en Ica la ciudad y la región coinciden).
 */
export function formattedAddress(): string {
  const { address, area, city, region, country } = site.location;
  return joinUnique([address, area, city, region, country]);
}

/** Ciudad, región y país, sin repeticiones: "Ica, Perú". */
export function formattedCity(separator = ', '): string {
  const { city, region, country } = site.location;
  return joinUnique([city, region, country], separator);
}

/** Dirección completa sólo si hay calle: evita publicar direcciones a medias. */
export function hasFullAddress(): boolean {
  return site.location.address.trim().length > 0;
}
