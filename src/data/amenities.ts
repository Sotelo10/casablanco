/**
 * SERVICIOS Y EQUIPAMIENTO
 * =============================================================================
 * `confirmed: false` significa "todavía sin verificar con la propiedad real".
 * La interfaz lo muestra como pendiente y NUNCA afirma que el servicio existe.
 *
 * Cuando confirmes un servicio, cambia `confirmed` a `true`. Si la propiedad no
 * lo ofrece, elimina la entrada.
 */
import type { Amenity, AmenityGroup } from '../types/content.js';

export const amenityGroups: { id: AmenityGroup; title: string; description: string }[] = [
  {
    id: 'esenciales',
    title: 'Esenciales',
    description: 'Lo básico para que la estancia funcione desde el primer minuto.',
  },
  {
    id: 'cocina',
    title: 'Cocina',
    description: 'Para cocinar con calma y compartir la mesa.',
  },
  {
    id: 'confort',
    title: 'Confort',
    description: 'Detalles que hacen la diferencia en el descanso.',
  },
  {
    id: 'exterior',
    title: 'Exteriores',
    description: 'Espacios al aire libre para el clima de Ica.',
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    description: 'Tranquilidad durante toda la estancia.',
  },
  {
    id: 'servicios',
    title: 'Servicios',
    description: 'Facilidades adicionales de la propiedad.',
  },
];

/**
 * `confirmed: true` = visible en las fotografías reales de la casa.
 * El resto sigue pendiente de confirmación del propietario y no se publica.
 */
export const amenities: Amenity[] = [
  { id: 'piscina', name: 'Piscina con iluminación', group: 'exterior', icon: 'pool', confirmed: true },
  /* La casa se alquila completa a un solo grupo (dato publicado por la marca). */
  { id: 'areas-privadas', name: 'Áreas privadas para tu grupo', group: 'servicios', icon: 'key', confirmed: true },
  { id: 'jardin', name: 'Jardín', group: 'exterior', icon: 'leaf', confirmed: true },
  { id: 'terraza', name: 'Terraza con piso de madera', group: 'exterior', icon: 'sun', confirmed: true },
  { id: 'mesa-exterior', name: 'Mesa exterior con sombrilla', group: 'exterior', icon: 'table', confirmed: true },
  { id: 'patio-techado', name: 'Patio techado con luces', group: 'exterior', icon: 'home', confirmed: true },
  { id: 'sala', name: 'Sala con sofá seccional', group: 'confort', icon: 'sofa', confirmed: true },
  { id: 'closet', name: 'Clósets en dormitorios', group: 'confort', icon: 'key', confirmed: true },
  { id: 'ropa-cama', name: 'Ropa de cama y toallas', group: 'esenciales', icon: 'bed', confirmed: true },
  { id: 'ducha', name: 'Duchas con mampara de vidrio', group: 'esenciales', icon: 'bath', confirmed: true },
  { id: 'refrigeradora', name: 'Refrigeradora', group: 'cocina', icon: 'fridge', confirmed: true },
  { id: 'cocina-horno', name: 'Cocina con refrigeradora y horno', group: 'cocina', icon: 'kitchen', confirmed: true },
  { id: 'wifi', name: 'WiFi', group: 'esenciales', icon: 'wifi', confirmed: false },
  { id: 'agua-caliente', name: 'Agua caliente', group: 'esenciales', icon: 'droplet', confirmed: false },
  { id: 'aire', name: 'Aire acondicionado', group: 'confort', icon: 'snowflake', confirmed: false },
  { id: 'tv', name: 'Televisor', group: 'confort', icon: 'tv', confirmed: false },
  { id: 'karaoke', name: 'Karaoke', group: 'confort', icon: 'mic', confirmed: false },
  { id: 'vajilla', name: 'Vajilla y utensilios', group: 'cocina', icon: 'utensils', confirmed: false },
  { id: 'parrilla', name: 'Parrilla', group: 'exterior', icon: 'flame', confirmed: false },
  { id: 'estacionamiento', name: 'Estacionamiento', group: 'seguridad', icon: 'car', confirmed: false },
  { id: 'lavanderia', name: 'Lavandería', group: 'servicios', icon: 'washer', confirmed: false },
];

/** Selección corta para la portada y la vista previa de "La casa". */
export const featuredAmenityIds = [
  'piscina',
  'jardin',
  'terraza',
  'sala',
  'cocina-horno',
  'ropa-cama',
];

/**
 * Servicios destacados de la portada, en orden de prioridad. Sólo se muestran
 * los que tengan `confirmed: true`: al confirmar WiFi, karaoke o
 * estacionamiento aparecen solos, sin tocar ningún componente.
 */
export const highlightedAmenityIds = [
  'piscina',
  'wifi',
  'cocina-horno',
  'karaoke',
  'estacionamiento',
  'areas-privadas',
  'jardin',
  'terraza',
  'sala',
  'ropa-cama',
  'ducha',
  'patio-techado',
];
