/**
 * SOLICITUDES DE RESERVA
 * =============================================================================
 * Toda la lógica del formulario vive aquí: validación, limpieza, filtro antibot
 * y traducción de errores. El componente sólo se ocupa de la interacción.
 *
 * DOS ESTADOS POSIBLES
 * -----------------------------------------------------------------------------
 * · Supabase sin configurar → `notConfigured: true`. La interfaz lo dice con
 *   claridad y ofrece WhatsApp. Nunca se finge un envío correcto.
 * · Supabase configurado    → se inserta en `booking_inquiries` con la clave
 *   pública, protegida por las políticas RLS de `supabase/schema.sql`.
 *
 * SOBRE LA VALIDACIÓN
 * -----------------------------------------------------------------------------
 * Lo que hay aquí es comodidad para quien rellena el formulario: se ejecuta en
 * el navegador y cualquiera puede saltárselo llamando a la API REST. La
 * validación que de verdad protege los datos son los `check` y el trigger
 * `booking_inquiries_guard` del esquema, que se aplican en el servidor a todo
 * lo que entra. Ambas reglas están escritas para coincidir.
 */
import type {
  BookingAntiSpam,
  BookingFieldErrors,
  BookingInquiry,
  BookingSubmitResult,
} from '../../types/booking.js';
import { getPublicSupabaseClient } from '../supabase/client.js';
import { logWarning } from '../utils/logger.js';

/** Un envío legítimo nunca se completa en menos de este tiempo. */
const MIN_FILL_TIME_MS = 2500;

/** Límites idénticos a los `check constraint` de la tabla. */
export const limits = {
  name: { min: 2, max: 120 },
  phone: { minDigits: 6, maxDigits: 20, max: 32 },
  email: { max: 160 },
  message: { max: 2000 },
  guests: { min: 1, max: 30 },
  /** Noches máximas de una estancia y antelación máxima de la llegada. */
  stayNights: 365,
  bookingAheadDays: 730,
} as const;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Fecha de hoy en formato ISO, comparable con el `value` de un `input[type=date]`. */
function today(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Días enteros entre dos fechas ISO. */
function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/**
 * Deja el texto en condiciones de guardarse: sin caracteres de control, sin
 * espacios repetidos y recortado al máximo que acepta la columna.
 * `keepLineBreaks` se usa en el mensaje, donde los saltos de línea son parte
 * del contenido.
 */
function sanitize(value: string, max: number, keepLineBreaks = false): string {
  const withoutControls = keepLineBreaks
    ? value.replace(/[^\P{C}\n]/gu, '')
    : value.replace(/\p{C}/gu, ' ');

  const collapsed = keepLineBreaks
    ? withoutControls.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n')
    : withoutControls.replace(/\s{2,}/g, ' ');

  return collapsed.trim().slice(0, max);
}

/** Normaliza lo escrito en el formulario antes de validarlo o enviarlo. */
export function normalizeInquiry(inquiry: BookingInquiry): BookingInquiry {
  return {
    name: sanitize(inquiry.name, limits.name.max),
    phone: sanitize(inquiry.phone, limits.phone.max),
    email: sanitize(inquiry.email, limits.email.max).toLowerCase(),
    checkIn: inquiry.checkIn.trim(),
    checkOut: inquiry.checkOut.trim(),
    guests: Number(inquiry.guests),
    message: sanitize(inquiry.message, limits.message.max, true),
  };
}

/**
 * Comprueba los datos ya normalizados. Devuelve un mensaje por campo; un objeto
 * vacío significa que el formulario puede enviarse.
 */
export function validateInquiry(input: BookingInquiry): BookingFieldErrors {
  const inquiry = normalizeInquiry(input);
  const errors: BookingFieldErrors = {};

  // --- Nombre --------------------------------------------------------------
  if (inquiry.name.length < limits.name.min) {
    errors.name = 'Escribe tu nombre.';
  }

  // --- Teléfono ------------------------------------------------------------
  const digits = inquiry.phone.replace(/\D/g, '');
  if (digits.length < limits.phone.minDigits || digits.length > limits.phone.maxDigits) {
    errors.phone = 'Escribe un teléfono o WhatsApp de contacto válido.';
  }

  // --- Correo (opcional) ---------------------------------------------------
  if (inquiry.email && !EMAIL_PATTERN.test(inquiry.email)) {
    errors.email = 'Revisa el correo electrónico.';
  }

  // --- Fechas (opcionales, pero coherentes si se indican) ------------------
  const now = today();

  if (inquiry.checkIn && !ISO_DATE_PATTERN.test(inquiry.checkIn)) {
    errors.checkIn = 'Escribe la fecha de llegada con el formato del calendario.';
  } else if (inquiry.checkIn && inquiry.checkIn < now) {
    errors.checkIn = 'La fecha de llegada no puede estar en el pasado.';
  } else if (inquiry.checkIn && daysBetween(now, inquiry.checkIn) > limits.bookingAheadDays) {
    errors.checkIn = 'Esa fecha está demasiado lejos. Escríbenos y lo vemos.';
  }

  if (inquiry.checkOut && !ISO_DATE_PATTERN.test(inquiry.checkOut)) {
    errors.checkOut = 'Escribe la fecha de salida con el formato del calendario.';
  } else if (inquiry.checkOut && !inquiry.checkIn) {
    errors.checkIn = 'Indica también la fecha de llegada.';
  } else if (inquiry.checkIn && inquiry.checkOut && inquiry.checkOut <= inquiry.checkIn) {
    errors.checkOut = 'La fecha de salida debe ser posterior a la de llegada.';
  } else if (
    inquiry.checkIn &&
    inquiry.checkOut &&
    daysBetween(inquiry.checkIn, inquiry.checkOut) > limits.stayNights
  ) {
    errors.checkOut = 'La estancia es demasiado larga. Escríbenos para acordarla.';
  }

  // --- Huéspedes -----------------------------------------------------------
  if (
    !Number.isInteger(inquiry.guests) ||
    inquiry.guests < limits.guests.min ||
    inquiry.guests > limits.guests.max
  ) {
    errors.guests = 'Indica cuántas personas viajan.';
  }

  // --- Mensaje (opcional) --------------------------------------------------
  if (input.message.trim().length > limits.message.max) {
    errors.message = `El mensaje no puede superar los ${limits.message.max} caracteres.`;
  }

  return errors;
}

/**
 * Filtro antibot sin dependencias: campo señuelo invisible y tiempo mínimo de
 * cumplimentación. Suficiente para el spam automatizado habitual y sin coste
 * para el usuario (ni captcha, ni cookies, ni servicios de terceros).
 *
 * Un envío sin marca de tiempo se considera sospechoso: sólo un cliente que no
 * ha ejecutado el formulario puede llegar sin ella.
 */
export function isLikelySpam(signals: BookingAntiSpam): boolean {
  if (signals.honeypot.trim().length > 0) return true;
  return !Number.isFinite(signals.elapsedMs) || signals.elapsedMs < MIN_FILL_TIME_MS;
}

/**
 * Texto del estado "todavía no conectado". Se exporta porque el formulario lo
 * muestra también al cargar la página, sin esperar a que alguien pulse enviar.
 */
export const NOT_CONNECTED_MESSAGE =
  'El formulario todavía no está conectado a la base de datos, así que las solicitudes no se envían. Escríbenos por WhatsApp o por correo y te respondemos igual de rápido.';

const GENERIC_ERROR =
  'No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp.';

/**
 * Traduce los errores del trigger `booking_inquiries_guard` a texto humano.
 * Cualquier otro error (red, RLS, esquema desactualizado) se resuelve con el
 * mensaje genérico: el visitante nunca ve un error de base de datos.
 */
function describeError(error: { message?: string } | null): string {
  const raw = error?.message ?? '';

  if (raw.includes('rate_limit')) {
    return 'Ya recibimos varias solicitudes desde este contacto. Espera un momento antes de enviar otra o escríbenos por WhatsApp.';
  }
  if (raw.includes('check_in_past') || raw.includes('check_in_too_far')) {
    return 'Revisa las fechas de la estancia: no pudimos aceptarlas.';
  }

  return GENERIC_ERROR;
}

export async function submitBookingInquiry(
  input: BookingInquiry,
  signals: BookingAntiSpam,
): Promise<BookingSubmitResult> {
  const fieldErrors = validateInquiry(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      message: 'Revisa los campos marcados para poder enviar la solicitud.',
    };
  }

  if (isLikelySpam(signals)) {
    return {
      ok: false,
      blocked: true,
      message:
        'No pudimos validar el envío. Espera unos segundos y vuelve a intentarlo, o escríbenos por WhatsApp.',
    };
  }

  const inquiry = normalizeInquiry(input);

  try {
    // Dentro del `try`: cargar el cliente implica descargar un chunk, y esa
    // descarga puede fallar igual que la petición.
    const supabase = await getPublicSupabaseClient();

    if (!supabase) {
      return { ok: false, notConfigured: true, message: NOT_CONNECTED_MESSAGE };
    }

    const { error } = await supabase.from('booking_inquiries').insert({
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email || null,
      check_in: inquiry.checkIn || null,
      check_out: inquiry.checkOut || null,
      guests: inquiry.guests,
      message: inquiry.message || null,
    });

    if (error) {
      logWarning('booking', error);
      return { ok: false, message: describeError(error) };
    }
  } catch (cause) {
    // Fallo de red o de carga del cliente: mismo trato, mensaje humano.
    logWarning('booking', cause);
    return {
      ok: false,
      message:
        'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp.',
    };
  }

  return {
    ok: true,
    message: 'Recibimos tu solicitud. Te responderemos con la disponibilidad de tus fechas.',
  };
}
