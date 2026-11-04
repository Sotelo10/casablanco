/**
 * EXPERIENCIAS EN CASA LEBLANC
 * =============================================================================
 * Cuatro formas de vivir la casa. Las fotografías son reales y se eligen por
 * el ambiente que transmiten, no porque muestren un servicio concreto.
 *
 * REGLAS
 * - `includes` sólo lleva servicios confirmados por el propietario. Mientras
 *   esté vacío, la interfaz no muestra ninguna lista de servicios.
 * - Celebraciones y encuentros corporativos llevan una condición visible: no
 *   se afirma que se permitan eventos sin confirmación del propietario.
 */
import type { StayExperience } from '../types/content.js';
import { photoBySlug } from './gallery.js';

export const stayExperiences: StayExperience[] = [
  {
    id: 'familiar',
    title: 'Escapada familiar',
    summary: 'Fines de semana, vacaciones y momentos de descanso.',
    description:
      'Una casa completa para la familia: piscina, jardín y dormitorios separados para que cada uno descanse a su ritmo.',
    image: photoBySlug('piscina-zona-comedor-exterior-casa-leblanc'),
    includes: [],
  },
  {
    id: 'romantica',
    title: 'Momentos románticos',
    summary: 'Tardes y noches especiales para parejas.',
    description:
      'La piscina iluminada, el patio con luces y la calma de una casa sólo para ustedes.',
    image: photoBySlug('patio-pergola-jardin-casa-leblanc'),
    includes: [],
  },
  {
    id: 'celebraciones',
    title: 'Celebraciones privadas',
    summary: 'Cumpleaños y reuniones entre amigos.',
    description:
      'Un espacio privado para reunirse con los suyos, alrededor de la piscina y la terraza.',
    image: photoBySlug('casa-leblanc-ica-fachada-piscina-noche'),
    includes: [],
    condition: 'Siempre sujetas a las condiciones de la propiedad. Consúltanos antes de reservar.',
  },
  {
    id: 'corporativo',
    title: 'Encuentros corporativos',
    summary: 'Reuniones e integración de pequeños equipos.',
    description:
      'Una sala amplia y espacios exteriores para trabajar juntos y compartir fuera de la oficina.',
    image: photoBySlug('sala-de-estar-casa-leblanc'),
    includes: [],
    condition: 'Sólo si las condiciones del alojamiento lo permiten. Confírmalo con el anfitrión.',
  },
];

/** Opciones del selector "Tipo de experiencia" del formulario de reservas. */
export const experienceOptions = stayExperiences.map(({ id, title }) => ({ id, label: title }));
