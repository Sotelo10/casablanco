/** Enlaces y embebido de Google Maps. */
import { site } from '../../config/site.js';
import { env } from '../../config/env.js';

/**
 * Consulta de búsqueda: coordenadas si existen y, si no, la dirección postal.
 *
 * Devuelve `null` mientras sólo se conozca la ciudad: enlazar a "Ica" sin más
 * daría una ubicación que no es la de la propiedad.
 */
function mapQuery(): string | null {
  const { latitude, longitude, address, area, city, region, country } = site.location;

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return `${latitude},${longitude}`;
  }

  if (!address.trim()) return null;

  return [address, area, city, region, country]
    .map((part) => part.trim())
    .filter((part, index, all) => part.length > 0 && all.indexOf(part) === index)
    .join(', ');
}

/** Enlace público a Google Maps, o `null` si no hay datos de ubicación. */
export function googleMapsLink(): string | null {
  if (site.location.googleMapsUrl) return site.location.googleMapsUrl;

  const query = mapQuery();
  if (!query) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Enlace a la ZONA publicada (p. ej. "Huacachina, Ica, Perú"), no a la casa.
 * Se usa mientras no haya dirección ni coordenadas, siempre rotulado como zona.
 */
export function googleMapsZoneLink(): string | null {
  const { area, city, country } = site.location;
  if (!area.trim()) return null;
  const query = [area, city, country].filter((part) => part.trim()).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Enlace de indicaciones "cómo llegar". */
export function googleDirectionsLink(): string | null {
  const query = mapQuery();
  if (!query) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/**
 * URL del iframe de Google Maps Embed API. Requiere clave pública y datos de
 * ubicación; devuelve `null` si falta cualquiera de los dos.
 */
export function googleMapsEmbedUrl(): string | null {
  const query = mapQuery();
  if (!query || !env.googleMapsApiKey) return null;

  const params = new URLSearchParams({
    key: env.googleMapsApiKey,
    q: query,
    zoom: '15',
    language: 'es',
    region: 'PE',
  });

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}
