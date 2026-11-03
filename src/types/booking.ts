/** Modelos de la solicitud de reserva. */

export interface BookingInquiry {
  name: string;
  phone: string;
  email: string;
  /** Fecha ISO (YYYY-MM-DD) o cadena vacía. */
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}

/** Errores de validación indexados por campo del formulario. */
export type BookingFieldErrors = Partial<Record<keyof BookingInquiry, string>>;

export type BookingSubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'notice';

/**
 * Señales antibot que acompañan al envío. No usan servicios externos ni
 * cookies: un campo trampa invisible y el tiempo que tardó el formulario en
 * completarse.
 */
export interface BookingAntiSpam {
  /** Campo señuelo: si viene relleno, lo ha completado un bot. */
  honeypot: string;
  /** Milisegundos transcurridos desde que se cargó el formulario. */
  elapsedMs: number;
}

export interface BookingSubmitResult {
  ok: boolean;
  /** Mensaje mostrado al usuario. Siempre texto humano, nunca un error interno. */
  message: string;
  /** `true` cuando el backend todavía no está configurado. */
  notConfigured?: boolean;
  /** `true` cuando el envío se ha descartado por las señales antibot. */
  blocked?: boolean;
  /** Errores por campo devueltos por la validación previa al envío. */
  fieldErrors?: BookingFieldErrors;
}
