/**
 * Perfiles sociales oficiales, derivados de `site.social`. Se usan en la
 * sección de redes, el footer, el menú móvil y el `sameAs` de Schema.org.
 * Un perfil sin URL no se muestra.
 */
import { site } from './site.js';

export interface SocialProfile {
  network: string;
  handle: string;
  url: string;
  icon: string;
}

/** Extrae el usuario visible ("@casa_leblanc26") de la URL del perfil. */
function handleFrom(url: string, fallback: string): string {
  const match = url.match(/(?:instagram\.com|tiktok\.com)\/@?([\w.]+)/);
  return match ? `@${match[1]}` : fallback;
}

export const socialProfiles: SocialProfile[] = [
  {
    network: 'Instagram',
    handle: handleFrom(site.social.instagram, site.name),
    url: site.social.instagram,
    icon: 'instagram',
  },
  {
    network: 'TikTok',
    handle: handleFrom(site.social.tiktok, site.name),
    url: site.social.tiktok,
    icon: 'tiktok',
  },
  {
    network: 'Facebook',
    handle: 'CASA Leblanc | Ica',
    url: site.social.facebook,
    icon: 'facebook',
  },
].filter((profile) => profile.url.trim().length > 0);
