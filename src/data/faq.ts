/**
 * PREGUNTAS FRECUENTES
 * =============================================================================
 * Respuestas verdaderas hoy. Donde falta un dato del propietario (capacidad
 * exacta, horarios, tarifa, mascotas, estacionamiento) la respuesta explica
 * cómo se confirma, sin inventar el valor.
 *
 * `isPlaceholder: true` excluye la pregunta del schema FAQPage. Cuando el
 * propietario confirme un dato, reescribe la respuesta con el valor real y
 * pon `isPlaceholder: false`.
 */
import type { FaqItem } from '../types/content.js';

export const faqs: FaqItem[] = [
  {
    id: 'reserva',
    question: '¿Cómo reservo Casa Leblanc?',
    answer:
      'Escríbenos por WhatsApp al +51 948 898 400 o desde el formulario de reserva, indicando tus fechas y el número de huéspedes. Te respondemos con la disponibilidad, la tarifa y las condiciones; la reserva queda confirmada cuando el anfitrión te lo indica.',
    isPlaceholder: false,
  },
  {
    id: 'casa-completa',
    question: '¿La casa se comparte con otros huéspedes?',
    answer:
      'No. Casa Leblanc se alquila completa, para una sola reserva a la vez: la piscina, el jardín, la terraza y todos los ambientes son sólo para tu grupo.',
    isPlaceholder: false,
  },
  {
    id: 'espacios',
    question: '¿Qué espacios tiene la casa?',
    answer:
      'Es una casa de dos plantas con piscina iluminada, jardín, terraza con mesa exterior, patio techado, sala de estar, cocina con refrigeradora y horno, dormitorios con cama matrimonial, una habitación con camarotes, habitaciones con camas individuales y baños con ducha de mampara.',
    isPlaceholder: false,
  },
  {
    id: 'ubicacion',
    question: '¿Dónde está Casa Leblanc?',
    answer:
      'En Ica, Perú, en la zona de Huacachina. La dirección exacta y las indicaciones para llegar se comparten al confirmar la reserva.',
    isPlaceholder: false,
  },
  {
    id: 'capacidad',
    question: '¿Cuántas personas pueden alojarse?',
    answer:
      'La casa está pensada para familias y grupos. Indícanos cuántas personas viajan y te confirmamos si la distribución de camas se ajusta a tu grupo.',
    isPlaceholder: true,
  },
  {
    id: 'precio',
    question: '¿Cuál es el precio por noche?',
    answer:
      'La tarifa depende de la temporada, del número de noches y del tamaño del grupo. Consúltanos tus fechas por WhatsApp y te enviamos el detalle.',
    isPlaceholder: true,
  },
  {
    id: 'horarios',
    question: '¿Cuáles son los horarios de ingreso y salida?',
    answer:
      'Los horarios de check-in y check-out se coordinan contigo al confirmar la reserva.',
    isPlaceholder: true,
  },
  {
    id: 'que-hacer',
    question: '¿Qué se puede hacer cerca de la casa?',
    answer:
      'Ica ofrece el oasis de Huacachina, paseos en areneros y sandboarding en las dunas, visitas a bodegas de pisco y vino, y su gastronomía regional. Paracas y las Líneas de Nasca se pueden visitar en excursiones de un día.',
    isPlaceholder: false,
  },
  {
    id: 'mascotas',
    question: '¿Se admiten mascotas?',
    answer: 'Consúltanos antes de reservar y te confirmamos las condiciones.',
    isPlaceholder: true,
  },
  {
    id: 'pago',
    question: '¿Cómo se realiza el pago?',
    answer:
      'Los medios de pago y las condiciones de reserva se detallan por WhatsApp antes de confirmar cualquier fecha.',
    isPlaceholder: true,
  },
];
