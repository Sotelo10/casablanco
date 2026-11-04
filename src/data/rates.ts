/**
 * TARIFAS, PAQUETES Y DISPONIBILIDAD
 * =============================================================================
 * Estructura preparada para cuando el propietario defina sus condiciones. Hoy
 * TODO está vacío: la web no publica precios, disponibilidad ni paquetes
 * inventados, y la sección de reservas muestra "tarifa a consultar".
 *
 * CÓMO COMPLETARLO
 * -----------------------------------------------------------------------------
 * - `nightlyRates`: una entrada por temporada. Al tener al menos una, la tabla
 *   de tarifas aparece sola en /reservas y en la portada.
 * - `packages`: paquetes especiales (p. ej. "Escapada romántica 2 noches").
 * - `availability.calendarUrl`: enlace público a un calendario (Google
 *   Calendar, Airbnb, etc.). `icalUrl` queda listo para una futura integración.
 * - `directBooking`: cambia a `true` cuando exista un motor de reservas real.
 * - Las plataformas externas (Airbnb, Booking) se configuran en
 *   `src/config/site.ts` → `social.airbnb` / `social.booking`.
 */

export interface NightlyRate {
  /** Nombre de la temporada: "Temporada baja", "Fiestas patrias"... */
  season: string;
  /** Periodo legible: "Abril a junio". */
  period: string;
  /** Precio por noche en la moneda de `site.booking.currency`. */
  pricePerNight: number;
  /** Huéspedes incluidos en el precio, si aplica. */
  guestsIncluded?: number;
  /** Noches mínimas en esa temporada, si aplica. */
  minNights?: number;
  note?: string;
}

export interface StayPackage {
  id: string;
  name: string;
  description: string;
  /** Precio total del paquete. `null` = "a consultar". */
  price: number | null;
  nights?: number;
  includes: string[];
  /** `id` de la experiencia relacionada (ver `src/data/experiences.ts`). */
  experienceId?: string;
}

export const nightlyRates: NightlyRate[] = [];

export const packages: StayPackage[] = [];

export const availability = {
  /** TODO: enlace público al calendario de disponibilidad. */
  calendarUrl: '',
  /** TODO: URL iCal para sincronizar con Airbnb / Booking en el futuro. */
  icalUrl: '',
};

/** `true` cuando exista un sistema de reservas directas con pago y confirmación. */
export const directBooking = false;
