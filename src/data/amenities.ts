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

export const amenities: Amenity[] = [
  { id: 'wifi', name: 'WiFi', group: 'esenciales', icon: 'wifi', confirmed: false },
  { id: 'agua-caliente', name: 'Agua caliente', group: 'esenciales', icon: 'droplet', confirmed: false },
  { id: 'ropa-cama', name: 'Ropa de cama y toallas', group: 'esenciales', icon: 'bed', confirmed: false },
  { id: 'aire', name: 'Aire acondicionado', group: 'confort', icon: 'snowflake', confirmed: false },
  { id: 'ventiladores', name: 'Ventiladores', group: 'confort', icon: 'fan', confirmed: false },
  { id: 'tv', name: 'Televisor', group: 'confort', icon: 'tv', confirmed: false },
  { id: 'cocina-equipada', name: 'Cocina equipada', group: 'cocina', icon: 'kitchen', confirmed: false },
  { id: 'refrigeradora', name: 'Refrigeradora', group: 'cocina', icon: 'fridge', confirmed: false },
  { id: 'vajilla', name: 'Vajilla y utensilios', group: 'cocina', icon: 'utensils', confirmed: false },
  { id: 'comedor', name: 'Comedor', group: 'cocina', icon: 'table', confirmed: false },
  { id: 'piscina', name: 'Piscina', group: 'exterior', icon: 'pool', confirmed: false },
  { id: 'terraza', name: 'Terraza', group: 'exterior', icon: 'sun', confirmed: false },
  { id: 'jardin', name: 'Jardín', group: 'exterior', icon: 'leaf', confirmed: false },
  { id: 'parrilla', name: 'Parrilla', group: 'exterior', icon: 'flame', confirmed: false },
  { id: 'estacionamiento', name: 'Estacionamiento', group: 'seguridad', icon: 'car', confirmed: false },
  { id: 'ingreso-privado', name: 'Ingreso privado', group: 'seguridad', icon: 'key', confirmed: false },
  { id: 'lavanderia', name: 'Lavandería', group: 'servicios', icon: 'washer', confirmed: false },
  { id: 'limpieza', name: 'Limpieza antes del ingreso', group: 'servicios', icon: 'sparkle', confirmed: false },
];

/** Selección corta para la portada y la vista previa de "La casa". */
export const featuredAmenityIds = [
  'wifi',
  'piscina',
  'cocina-equipada',
  'aire',
  'estacionamiento',
  'terraza',
];
