/**
 * Datos estructurados (Schema.org).
 *
 * Regla estricta: sólo se publica lo que existe. Cualquier campo sin dato real
 * se elimina del JSON-LD en lugar de rellenarse con un valor inventado.
 */
import { site } from '../../config/site.js';
import type { FaqItem, ReviewSummary } from '../../types/content.js';

type JsonValue = string | number | boolean | JsonObject | JsonValue[] | null | undefined;
export interface JsonObject {
  [key: string]: JsonValue;
}

/** Elimina recursivamente valores vacíos (`''`, `null`, `undefined`, `[]`, `{}`). */
export function prune(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    const items = value.map(prune).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, prune(item)] as const)
      .filter(([, item]) => item !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;

  return value;
}

interface SchemaContext {
  /** Origen del sitio, p. ej. `https://midominio.pe`. */
  origin: string;
  /** URL absoluta de la imagen social, si existe. */
  image?: string;
  /** Resumen de reseñas: sólo se publica si son reales. */
  reviewSummary?: ReviewSummary;
}

/** Identificador estable de la propiedad dentro del grafo. */
export const propertyId = (origin: string) => `${origin}/#propiedad`;

/**
 * Negocio de alojamiento (LodgingBusiness ← LocalBusiness) con
 * `additionalType` de alquiler vacacional.
 */
export function propertySchema({ origin, image, reviewSummary }: SchemaContext): JsonObject {
  const { location, contact, booking, property } = site;

  const hasRealRating =
    reviewSummary && !reviewSummary.isDemo && reviewSummary.total > 0 && reviewSummary.average;

  const schema: JsonObject = {
    '@type': 'LodgingBusiness',
    '@id': propertyId(origin),
    additionalType: 'https://schema.org/VacationRental',
    name: site.name,
    description: site.description,
    url: `${origin}/`,
    image: image,
    telephone: contact.phone || undefined,
    email: contact.email || undefined,
    priceRange: booking.priceRange || undefined,
    currenciesAccepted: booking.priceRange ? booking.currency : undefined,
    checkinTime: booking.checkIn || undefined,
    checkoutTime: booking.checkOut || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address || undefined,
      addressLocality: location.city,
      addressRegion: location.region,
      postalCode: location.postalCode || undefined,
      addressCountry: location.countryCode,
    },
    geo:
      typeof location.latitude === 'number' && typeof location.longitude === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : undefined,
    hasMap: location.googleMapsUrl || undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    containsPlace:
      property.guests || property.bedrooms || property.bathrooms
        ? {
            '@type': 'Accommodation',
            name: site.name,
            numberOfBedrooms: property.bedrooms ?? undefined,
            numberOfBathroomsTotal: property.bathrooms ?? undefined,
            occupancy: property.guests
              ? { '@type': 'QuantitativeValue', maxValue: property.guests, unitCode: 'C62' }
              : undefined,
            floorSize: property.area
              ? { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' }
              : undefined,
          }
        : undefined,
    aggregateRating: hasRealRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: reviewSummary.average,
          reviewCount: reviewSummary.total,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    sameAs: [site.social.instagram, site.social.facebook, site.social.airbnb, site.social.booking],
  };

  return prune(schema) as JsonObject;
}

export function websiteSchema(origin: string): JsonObject {
  return prune({
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: site.name,
    description: site.description,
    inLanguage: site.seo.locale,
    publisher: { '@id': propertyId(origin) },
  }) as JsonObject;
}

/**
 * Página concreta dentro del grafo. Enlaza con el sitio y con el alojamiento,
 * que es lo que permite a los buscadores entender que todas las URL describen
 * el mismo negocio.
 */
export function webPageSchema(options: {
  origin: string;
  url: string;
  name: string;
  description: string;
  isHome?: boolean;
}): JsonObject {
  const { origin, url, name, description, isHome = false } = options;

  return prune({
    '@type': isHome ? ['WebPage', 'CollectionPage'] : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: site.seo.locale,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': propertyId(origin) },
    primaryImageOfPage: undefined,
  }) as JsonObject;
}

export interface BreadcrumbEntry {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbEntry[], origin: string): JsonObject {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.href === '/' ? '/' : item.href}`,
    })),
  };
}

export function faqSchema(items: FaqItem[]): JsonObject | null {
  if (items.length === 0) return null;

  return {
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** Envuelve uno o varios nodos en un único grafo JSON-LD. */
export function jsonLdGraph(nodes: (JsonObject | null | undefined)[]): string {
  const graph = nodes.filter((node): node is JsonObject => Boolean(node));
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
