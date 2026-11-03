/**
 * PREGUNTAS FRECUENTES
 * =============================================================================
 * `isPlaceholder: true` marca las respuestas que dependen de datos que aún no
 * han sido proporcionados. Esas preguntas NO se publican en el schema FAQPage
 * para no enviar información inventada a los buscadores.
 */
import type { FaqItem } from '../types/content.js';

export const faqs: FaqItem[] = [
  {
    id: 'reserva',
    question: '¿Cómo consulto la disponibilidad?',
    answer:
      'Puedes escribirnos por WhatsApp o completar el formulario de consulta con tus fechas y el número de huéspedes. Te respondemos con la disponibilidad y las condiciones de la estancia.',
    isPlaceholder: false,
  },
  {
    id: 'capacidad',
    question: '¿Cuántas personas pueden alojarse?',
    answer:
      'La capacidad máxima se confirma al momento de la consulta. Indícanos el tamaño de tu grupo y te decimos si la casa se ajusta.',
    isPlaceholder: true,
  },
  {
    id: 'horarios',
    question: '¿Cuáles son los horarios de ingreso y salida?',
    answer:
      'Los horarios de check-in y check-out se confirman junto con la reserva.',
    isPlaceholder: true,
  },
  {
    id: 'precio',
    question: '¿Cuál es el precio por noche?',
    answer:
      'La tarifa depende de la temporada, del número de noches y del tamaño del grupo. Consúltanos tus fechas y te enviamos el detalle.',
    isPlaceholder: true,
  },
  {
    id: 'ubicacion',
    question: '¿Dónde está exactamente la casa?',
    answer:
      'La propiedad está en Ica, Perú. La dirección exacta y las referencias para llegar se comparten al confirmar la reserva.',
    isPlaceholder: false,
  },
  {
    id: 'mascotas',
    question: '¿Se admiten mascotas?',
    answer:
      'Esta política se confirma al momento de la consulta.',
    isPlaceholder: true,
  },
  {
    id: 'estacionamiento',
    question: '¿Hay estacionamiento?',
    answer:
      'Las facilidades de estacionamiento se confirman al momento de la consulta.',
    isPlaceholder: true,
  },
  {
    id: 'pago',
    question: '¿Cómo se realiza el pago?',
    answer:
      'Los medios de pago y las condiciones de reserva se detallan durante la consulta, antes de confirmar cualquier fecha.',
    isPlaceholder: true,
  },
];
