/**
 * QUÉ HAY CERCA — REGIÓN DE ICA
 * =============================================================================
 * Lugares reales de la zona. Las distancias y los tiempos quedan en `null` a
 * propósito: la interfaz muestra `[X min]` hasta que midas el trayecto real
 * desde la propiedad.
 *
 * Para añadir una fotografía, copia el archivo en `src/assets/property/` y
 * escribe su nombre en `image`.
 */
import type { ExperienceCategory, NearbyPlace } from '../types/content.js';

export const experienceCategories: ExperienceCategory[] = [
  {
    id: 'naturaleza',
    title: 'Desierto y oasis',
    description: 'Dunas, lagunas y paisajes que sólo existen en esta parte del país.',
    icon: 'mountain',
  },
  {
    id: 'gastronomia',
    title: 'Viñedos y mesa iqueña',
    description: 'Bodegas de pisco y vino, y una cocina regional con identidad propia.',
    icon: 'grape',
  },
  {
    id: 'turismo',
    title: 'Cultura y patrimonio',
    description: 'Museos, plazas y el legado de las culturas que habitaron la región.',
    icon: 'landmark',
  },
  {
    id: 'actividades',
    title: 'Aventura',
    description: 'Actividades al aire libre para quienes viajan buscando movimiento.',
    icon: 'compass',
  },
];

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'huacachina',
    name: 'Oasis de Huacachina',
    description:
      'Laguna natural rodeada de dunas y palmeras, uno de los paisajes más reconocibles del Perú.',
    distance: null,
    category: 'naturaleza',
    image: '',
    icon: 'palm',
  },
  {
    id: 'dunas',
    name: 'Dunas y sandboarding',
    description:
      'Recorridos en areneros y descensos en tabla sobre las dunas que rodean la ciudad.',
    distance: null,
    category: 'actividades',
    image: '',
    icon: 'compass',
  },
  {
    id: 'bodegas',
    name: 'Bodegas de pisco y vino',
    description:
      'Ica es una de las cunas del pisco. Varias bodegas de la zona ofrecen visitas y catas guiadas.',
    distance: null,
    category: 'gastronomia',
    image: '',
    icon: 'grape',
  },
  {
    id: 'gastronomia-local',
    name: 'Cocina iqueña',
    description:
      'Carapulcra con sopa seca, tejas y frejol colado forman parte de la mesa tradicional de la región.',
    distance: null,
    category: 'gastronomia',
    image: '',
    icon: 'utensils',
  },
  {
    id: 'plaza-de-armas',
    name: 'Centro histórico de Ica',
    description:
      'La Plaza de Armas y su entorno concentran comercio, cafés y la vida diaria de la ciudad.',
    distance: null,
    category: 'turismo',
    image: '',
    icon: 'landmark',
  },
  {
    id: 'museo-regional',
    name: 'Museo Regional de Ica',
    description:
      'Colección arqueológica dedicada a las culturas Paracas, Nasca e Ica.',
    distance: null,
    category: 'turismo',
    image: '',
    icon: 'landmark',
  },
  {
    id: 'paracas',
    name: 'Paracas e Islas Ballestas',
    description:
      'Reserva nacional en la costa, con recorridos en bote hasta las islas y su fauna marina.',
    distance: null,
    category: 'naturaleza',
    image: '',
    icon: 'wave',
  },
  {
    id: 'nasca',
    name: 'Líneas de Nasca',
    description:
      'Geoglifos declarados Patrimonio de la Humanidad, al sur de la región.',
    distance: null,
    category: 'turismo',
    image: '',
    icon: 'compass',
  },
];
