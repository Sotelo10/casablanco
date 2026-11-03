/** Configuración central del sitio y de la propiedad. */

export interface SiteLocation {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  /** Calle y número. Vacío mientras no haya dato real. */
  address: string;
  /** Zona, urbanización o distrito. */
  area: string;
  /** Referencia útil para llegar. */
  reference: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  /** URL del perfil de Google Business / ficha de Maps, si existe. */
  googleMapsUrl: string;
  googlePlaceId: string;
}

export interface SiteContact {
  /** Formato internacional, p. ej. `+51 999 999 999`. Vacío = sin dato. */
  phone: string;
  /** Sólo dígitos con código de país, p. ej. `51999999999`. */
  whatsapp: string;
  email: string;
  /** Horario de atención en texto libre. */
  hours: string;
}

export interface SiteSocial {
  instagram: string;
  facebook: string;
  tiktok: string;
  airbnb: string;
  booking: string;
}

export interface SiteBooking {
  /** Rango de precios en formato Schema.org (p. ej. `S/300 - S/500`). */
  priceRange: string;
  currency: string;
  checkIn: string;
  checkOut: string;
  minNights: number | null;
}

export interface SiteSeo {
  /** Idioma del documento. */
  locale: string;
  /** Locale de Open Graph. */
  ogLocale: string;
  /** Imagen social (colócala en `public/`). Vacío = no se emite `og:image`. */
  ogImage: string;
  ogImageAlt: string;
  twitterHandle: string;
}

export interface SiteContentStatus {
  /**
   * `true` mientras el sitio use datos de ejemplo. Muestra avisos discretos y
   * marca los valores pendientes. Cambia a `false` cuando cargues los datos
   * reales de la propiedad.
   */
  isPlaceholder: boolean;
  /** Texto que sustituye a cualquier dato aún no proporcionado. */
  placeholderLabel: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  location: SiteLocation;
  contact: SiteContact;
  social: SiteSocial;
  property: import('./content.js').PropertyFacts;
  booking: SiteBooking;
  seo: SiteSeo;
  content: SiteContentStatus;
}
