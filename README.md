# Casa Leblanc — sitio web

Sitio estático construido con [Astro](https://astro.build) para **Casa Leblanc**,
casa vacacional en Ica, Perú. Está pensado para funcionar **desde el primer día
sin fotografías ni datos definitivos**: todo lo que falta se muestra como
marcador visible y se sustituye editando un puñado de archivos.

- Cero JavaScript de framework: sólo unos kilobytes de JS propio para el menú,
  el lightbox y el formulario.
- HTML estático, fuentes autoalojadas y optimización de imágenes de Astro.
- SEO local para Ica: metadatos por página, canonical, sitemap, robots y
  datos estructurados generados desde una configuración central.
- Preparado para Supabase, Google Maps, WhatsApp y Analytics sin tocar la
  arquitectura.

---

## 1. Instalación

Requisitos: **Node.js 22.12 o superior**.

```bash
npm install
cp .env.example .env      # opcional: sólo si vas a configurar integraciones
```

## 2. Desarrollo

```bash
npm run dev               # http://localhost:4321
```

## 3. Compilación y vista previa

```bash
npm run build             # genera dist/
npm run preview           # sirve dist/ en local
npm run check             # comprueba tipos y plantillas (astro check)
```

`npm run build` y `npm run check` deben terminar sin errores antes de desplegar.

---

## 4. Dónde se cambian los datos de la propiedad

| Qué                                            | Archivo                        |
| ---------------------------------------------- | ------------------------------ |
| Nombre, dirección, teléfono, redes, capacidad  | `src/config/site.ts`           |
| Menú, CTA y enlaces legales                    | `src/config/navigation.ts`     |
| Fotografías y galería                          | `src/data/gallery.ts`          |
| Servicios y equipamiento                       | `src/data/amenities.ts`        |
| Espacios y textos de "La casa"                 | `src/data/property.ts`         |
| Lugares cercanos y categorías de experiencia   | `src/data/nearby.ts`           |
| Reseñas                                        | `src/data/reviews.ts`          |
| Preguntas frecuentes                           | `src/data/faq.ts`              |
| Lema y línea de localización                   | `src/config/brand.ts`          |
| Espacios de "Conoce nuestra casa"              | `src/data/property.ts` (`houseSpaces`) |
| Experiencias (familiar, romántica, etc.)       | `src/data/experiences.ts`      |
| Tarifas, paquetes, calendario, reserva directa | `src/data/rates.ts`            |
| Vídeo y póster del hero                        | `src/data/hero.ts`             |
| Paleta, tipografía y espaciado                 | `src/styles/tokens.css`        |

**`src/config/site.ts` es el archivo principal.** Los campos vacíos (`''`) o
`null` se consideran "sin dato" y la interfaz los muestra como *Por confirmar*
en lugar de inventar un valor. Cuando termines de cargar la información real,
cambia:

```ts
content: {
  isPlaceholder: false,   // oculta los avisos de contenido de ejemplo
}
```

No hay reseñas de ejemplo: `src/data/reviews.ts` está vacío hasta que existan
reseñas reales (con `isDemo: false`). Al publicarlas, el promedio pasa a
publicarse también en los datos estructurados (`aggregateRating`).

---

## 5. Fotografías y vídeo

Los originales del propietario viven en **`media/originales/`** y **nunca se
publican ni se modifican**. La web sirve versiones optimizadas generadas por un
script reproducible:

```bash
node scripts/optimize-media.mjs
# con vídeo (requiere ffmpeg en el PATH o FFMPEG_PATH):
FFMPEG_PATH=/ruta/a/ffmpeg node scripts/optimize-media.mjs
```

| Qué                         | Dónde                                                   |
| --------------------------- | ------------------------------------------------------- |
| Selección, carpetas y slugs | `scripts/media-manifest.json`                           |
| Fotografías WebP            | `public/images/casa-leblanc/{exteriores,interiores,habitaciones}/<slug>-<ancho>.webp` |
| Póster del hero             | `public/images/casa-leblanc/hero/`                      |
| Imagen social 1200×630      | `public/images/casa-leblanc/og/casa-leblanc-ica-peru.jpg` |
| Vídeo del hero (MP4 + WebM) | `public/video/`                                         |
| Dimensiones generadas       | `src/data/photos.generated.json`                        |
| ALT, etiquetas y categorías | `src/data/gallery.ts`                                   |

Cada foto se genera en 480, 768 y 1200 px (sin ampliar nunca el original;
si el original mide menos, su ancho nativo es la última variante) con WebP
calidad 82. El vídeo se recodifica sin audio y su bucle empieza en la piscina
(`video.loopStart`).

### Vídeo del hero

El fondo de la portada es un vídeo generado a partir de
`public/ChatGPT Image 3 nov 2026, 08_32_35 a.m.png` con un movimiento de
cámara lento (Ken Burns, bucle continuo de 14 s, sin movimiento inventado):

```bash
FFMPEG_PATH=/ruta/a/ffmpeg node scripts/generate-hero-video.mjs
```

Genera `public/videos/casa-leblanc-hero{,-960}.{mp4,webm}` y los pósters en
`public/images/casa-leblanc/hero/`. El navegador elige WebM (VP9) o MP4 (H.264)
y la versión de 960 px en móviles. Sin JavaScript, con "reducir movimiento" o
con ahorro de datos se muestra sólo el póster.

**Para añadir una foto:** cópiala en `media/originales/`, añádela al manifiesto
con su carpeta y un slug descriptivo, ejecuta el script y crea su entrada en
`src/data/gallery.ts` con un ALT que describa lo que se ve.

---

## 6. Configurar Supabase

El sitio funciona sin Supabase: muestra el contenido local de `src/data/` y el
formulario avisa de que todavía no está conectado. Al configurarlo, el
formulario empieza a guardar solicitudes de verdad y los repositorios pasan a
leer el contenido de la base de datos.

Son cinco pasos y no hay que tocar código en ninguno.

### 1. Crea el proyecto

En [supabase.com](https://supabase.com) → **New project**. Elige la región más
cercana a tus visitantes (para Perú, `us-east-1` o `sa-east-1`).

### 2. Ejecuta el esquema

Abre **SQL Editor → New query**, pega el contenido completo de
[`supabase/schema.sql`](supabase/schema.sql) y ejecútalo.

El archivo es idempotente: puedes volver a lanzarlo cuando lo modifiques.

Crea cinco tablas:

| Tabla               | Para qué sirve                                   | Acceso público    |
| ------------------- | ------------------------------------------------ | ----------------- |
| `gallery_images`    | fotografías de la galería                        | sólo lectura      |
| `amenities`         | servicios y equipamiento                         | sólo lectura      |
| `nearby_places`     | lugares cercanos                                 | sólo lectura      |
| `reviews`           | reseñas (sólo se publican las aprobadas)         | sólo lectura      |
| `booking_inquiries` | solicitudes de reserva y contacto                | sólo **insertar** |

### 3. Copia las credenciales

**Project Settings → API**, y las pegas en `.env`:

```bash
PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

No hace falta nada más. **No copies la clave `service_role`**: el proyecto no la
usa en ninguna parte y no debe existir en el `.env` de este sitio.

### 4. Comprueba que quedó bien

En el **SQL Editor**, estas dos consultas te lo confirman.

Las cinco tablas con RLS activo (`rowsecurity` debe ser `true` en todas):

```sql
select tablename, rowsecurity
  from pg_tables
 where schemaname = 'public'
 order by tablename;
```

Y exactamente cinco políticas, ni una más:

```sql
select tablename, policyname, cmd, roles
  from pg_policies
 where schemaname = 'public'
 order by tablename, policyname;
```

Debes ver cuatro de tipo `SELECT` (galería, servicios, lugares y reseñas
aprobadas) y una de tipo `INSERT` sobre `booking_inquiries`. Si aparece alguna
`SELECT` sobre `booking_inquiries`, bórrala: significaría que cualquiera puede
leer los datos de tus clientes.

### 5. Compila y prueba

```bash
npm run dev      # o npm run build && npm run preview
```

Entra en `/contacto`. El aviso de "todavía no está conectado" debe haber
desaparecido. Rellena el formulario, envíalo y busca la fila nueva en
**Table Editor → booking_inquiries**.

> **Las variables se leen al compilar.** El sitio es estático: `npm run build`
> incrusta los valores en el HTML. Si cambias el `.env`, vuelve a compilar (o
> reinicia `npm run dev`); recargar el navegador no basta.

### Cómo está protegido

El navegador habla directamente con Supabase usando la clave pública `anon`.
Esa clave se puede leer en el código fuente de cualquier página: es normal y
está previsto. Quien decide qué se puede hacer con ella son las políticas de la
base de datos, y con ella sólo se puede:

- **leer** el contenido público del sitio y las reseñas que hayas aprobado;
- **crear** una solicitud de reserva.

No se puede leer, editar ni borrar ninguna solicitud. Tus clientes sólo son
visibles desde el panel de Supabase, con tu sesión de administrador.

Además, `booking_inquiries` valida en el servidor todo lo que entra, porque la
validación del navegador se puede saltar llamando a la API directamente:

- **Constraints** de longitud, formato de correo, número de huéspedes, orden de
  las fechas y duración máxima de la estancia.
- Un **trigger** (`booking_inquiries_guard`) que limpia el texto, rechaza fechas
  pasadas y limita a **3 solicitudes por hora** desde el mismo teléfono o correo.
- El estado inicial y la fecha de creación los fija la base de datos, no el
  cliente.

Y en el formulario, un **honeypot** invisible más un **tiempo mínimo de
cumplimentación** filtran el spam automatizado, sin captcha ni cookies.

### Contenido dinámico (opcional)

Las tablas de contenido están para cuando quieras editar la casa sin recompilar
a mano. Mientras estén vacías, el sitio usa los datos locales de `src/data/`, así
que puedes conectar Supabase sólo para el formulario y dejarlas sin tocar.

En `gallery_images.storage_path` y `nearby_places.image` puedes escribir el
nombre de un archivo de `src/assets/property/` (pasa por el optimizador de
Astro) o una URL absoluta de Supabase Storage (se enlaza tal cual). La
fotografía del hero debe ser siempre un archivo local: es la que marca el LCP.

### Regenerar los tipos

`src/lib/supabase/types.ts` describe el esquema para TypeScript. Si cambias
`schema.sql`, vuelve a generarlo:

```bash
SUPABASE_PROJECT_ID=xxxxxxxx npm run types:supabase
```

(`xxxxxxxx` es la parte variable de tu Project URL.)

### Arquitectura de datos

```
src/lib/
├── supabase/
│   ├── client.ts    cliente público (navegador), carga diferida
│   ├── server.ts    cliente de servidor, usado durante el build
│   └── types.ts     tipos del esquema
├── repositories/    acceso a datos: Supabase o datos locales de respaldo
└── services/        lógica de negocio que consumen las páginas
```

Las páginas nunca consultan la base de datos: llaman a un servicio, que llama a
un repositorio. Si Supabase no responde, no está configurado o la tabla está
vacía, el repositorio devuelve los datos locales y el sitio sigue en pie.

La única consulta que ocurre en el navegador es el envío del formulario, y la
librería de Supabase se descarga sólo en ese momento: las páginas que no la
necesitan no cargan ni un byte de ella.

---

## 7. Configurar Google Maps

1. Activa la **Maps Embed API** en Google Cloud y crea una clave.
2. Restríngela por dominio (referrer HTTP).
3. Añádela en `.env`:

```bash
PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

4. Rellena `latitude` y `longitude` (o al menos `address`) en
   `src/config/site.ts`.

Con la clave y las coordenadas, la página de ubicación incrusta el mapa. Sin
ellas muestra una tarjeta con el enlace directo a Google Maps, así que nunca
queda un hueco roto.

Para enlazar tu ficha de **Google Business Profile**, escribe su URL en
`site.location.googleMapsUrl`. Mantén el nombre, la dirección y el teléfono
(NAP) idénticos a los de la ficha: el sitio los reutiliza en el pie de página y
en los datos estructurados.

---

## 8. Configurar WhatsApp

En `src/config/site.ts`:

```ts
contact: {
  phone: '+51 900 000 000',   // se muestra tal cual
  whatsapp: '51900000000',    // sólo dígitos, con código de país
}
```

Todos los botones de WhatsApp usan `https://wa.me/…`, que funciona igual en
escritorio (WhatsApp Web) y en móvil (aplicación nativa). El mensaje se genera
en `src/lib/utils/whatsapp.ts` y admite fechas y número de huéspedes: el
formulario de consulta ya los añade cuando el visitante los ha escrito.

Si `whatsapp` está vacío, los botones enlazan a `/contacto` en lugar de mostrar
un número inventado.

---

## 9. Configurar Analytics

```bash
PUBLIC_GA_ID=G-XXXXXXXXXX
```

Si la variable está vacía **no se carga ningún script de seguimiento**. Al
activarla, recuerda revisar `/politica-cookies`, que refleja automáticamente si
hay analítica activa.

---

## 10. Desplegar en producción

1. Define el dominio real en `.env` (o en las variables del proveedor):

```bash
SITE_URL=https://tudominio.pe
```

Se usa para el canonical, Open Graph, el sitemap y `robots.txt`.

2. Configura el proveedor con:

| Ajuste              | Valor           |
| ------------------- | --------------- |
| Comando de build    | `npm run build` |
| Directorio publicado| `dist`          |
| Versión de Node     | 22              |

Funciona en Netlify, Vercel, Cloudflare Pages o cualquier hosting estático.

3. El sitio usa **URLs sin barra final** (`/casa`, no `/casa/`). Astro genera
   `casa.html`; los proveedores citados lo sirven en `/casa` sin configuración
   adicional. En un servidor propio (Nginx/Apache) añade la resolución de
   extensiones `.html` (`try_files $uri $uri.html $uri/ =404;` en Nginx).

4. Tras el despliegue: envía `https://tudominio.pe/sitemap-index.xml` a Google
   Search Console y comprueba los datos estructurados con la
   [prueba de resultados enriquecidos](https://search.google.com/test/rich-results).

### Variables de entorno

Todas se configuran en el panel del proveedor de hosting, con los mismos
nombres que en `.env`. Se leen **durante el build**: si cambias una, hay que
volver a desplegar.

| Variable                     | Obligatoria | Llega al navegador | Para qué                            |
| ---------------------------- | ----------- | ------------------ | ----------------------------------- |
| `SITE_URL`                   | Sí          | No (sólo el build) | canonical, Open Graph, sitemap      |
| `PUBLIC_SUPABASE_URL`        | No          | **Sí**             | conectar el formulario y el contenido |
| `PUBLIC_SUPABASE_ANON_KEY`   | No          | **Sí**             | idem                                |
| `PUBLIC_GOOGLE_MAPS_API_KEY` | No          | **Sí**             | mapa incrustado en `/ubicacion`     |
| `PUBLIC_GA_ID`               | No          | **Sí**             | Google Analytics                    |

Todo lo que empieza por `PUBLIC_` acaba dentro del HTML y del JavaScript que
recibe el visitante. Es correcto para estas claves, que están pensadas para ser
públicas, y **nunca** debe usarse para un secreto.

Este proyecto no necesita ninguna variable secreta. En particular, la clave
`service_role` de Supabase **no se usa en ninguna parte**: no la pongas en el
`.env` ni en el panel del proveedor. Quien protege los datos son las políticas
RLS del esquema.

### Qué no debe subirse a Git

- `.env` y cualquier variante (`.env.local`, `.env.production`). Están
  ignoradas en `.gitignore`; la única que se versiona es `.env.example`, que no
  contiene valores reales.
- `dist/` y `.astro/`, que se regeneran en cada build.
- Claves de API de cualquier tipo escritas directamente en el código.

Si alguna vez se filtra una clave, rótala en el panel correspondiente: borrarla
del repositorio no basta, porque queda en el historial.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── amenities/    servicios y equipamiento
│   ├── analytics/    carga condicional de Analytics
│   ├── booking/      CTA de cierre, formulario, WhatsApp y barra móvil
│   ├── gallery/      mosaico editorial y lightbox
│   ├── hero/         portada
│   ├── layout/       pie de página y contenedores de contenido
│   ├── location/     mapa y lugares cercanos
│   ├── media/        fotografías reales y placas de sustitución
│   ├── navigation/   cabecera, menú móvil, migas de pan, marca
│   ├── property/     datos de la propiedad (barra de cifras)
│   ├── reviews/      reseñas y valoraciones
│   ├── sections/     capítulos de página reutilizables
│   ├── seo/          metadatos
│   └── ui/           botones, tarjetas, capítulos, iconos y primitivas
├── config/           configuración central (site, navegación, entorno, tema)
├── data/             contenido editable (galería, servicios, reseñas…)
├── layouts/          BaseLayout y PageLayout
├── lib/
│   ├── supabase/     cliente público, cliente de servidor y tipos
│   ├── repositories/ acceso a datos
│   ├── services/     lógica de negocio
│   ├── seo/          metadatos y Schema.org
│   └── utils/        WhatsApp, mapas, formato, rutas y registro de errores
├── pages/            una página por ruta + robots.txt y manifest
├── styles/           tokens, reset, base y utilidades
└── assets/property/  aquí van las fotografías

supabase/
└── schema.sql        tablas, constraints, trigger y políticas RLS
```

## Sistema de diseño

Todo el lenguaje visual vive en **`src/styles/tokens.css`**: color, tipografía,
espaciado, radios, sombras, contenedores y movimiento. Ningún componente define
un color, una sombra o una familia tipográfica por su cuenta, así que la
identidad completa del sitio se cambia desde ese archivo.

### Cambiar la paleta

Arquitectura blanca, noche azul y arena del desierto. Las fotografías llevan el
color; la interfaz se mantiene sobria.

| Token                       | Valor      | Uso                                     |
| --------------------------- | ---------- | --------------------------------------- |
| `--color-text` / `--color-primary` | `#153b56` | azul profundo: texto y acción principal |
| `--color-accent-strong`     | `#285f7d`  | azul secundario: antetítulos y detalles  |
| `--color-background`        | `#fafaf7`  | blanco cálido, fondo general             |
| `--color-surface`           | `#ffffff`  | blanco                                   |
| `--color-surface-sand-deep` | `#e9e0d3`  | arena                                    |
| `--color-text-muted`        | `#5b6b7f`  | gris elegante (#64748B ajustado a AA)    |
| `--color-surface-deep`      | `#00509D`  | bandas profundas, hero y pie             |

Los velos sobre fotografía usan `--veil-rgb` y los demás canales base
(`--deep-rgb`, `--sky-rgb`, `--accent-rgb`).

Cada acento tiene tres intensidades para mantener el contraste AA:
`--color-accent` (gráficos), `--color-accent-strong` (texto sobre claro) y
`--color-accent-light` (texto sobre fondo profundo).

Sólo hay dos colores fuera del CSS, en `src/config/theme.ts`: el `theme-color`
del navegador y el fondo del manifiesto. Deben reflejar los tokens equivalentes.
Un `grep` de `#` o `rgb(` en `src/components` no devuelve ningún literal.

### Cambiar las fuentes

| Familia                | Uso                                              | Origen |
| ---------------------- | ------------------------------------------------ | ------ |
| **Cormorant Garamond** | titulares editoriales y logotipo (500/600, cursiva) | Google |
| **Manrope**            | texto, navegación, botones y elementos funcionales | Google |

Ambas se descargan como WOFF2 durante el `build` con la API de fuentes de Astro y se
sirven **desde tu propio dominio**: no hay peticiones a terceros en tiempo de
ejecución. La primera compilación necesita conexión a internet; después quedan
en caché.

1. Edita el bloque `fonts` de `astro.config.mjs` (nombre, proveedor y pesos).
2. Ajusta `--font-body`, `--font-heading`, `--font-script` y `--font-mono` en
   `tokens.css`.

No hay ninguna fuente declarada en componentes: los cuatro tokens gobiernan toda
la tipografía.

### Primitivas reutilizables

`src/components/ui/` contiene la base: `Button` (ocho variantes, con icono de
apertura y de cierre), `Card`, `Chapter` (encabezado de sección con numeral),
`Badge`, `Container`, `Section`, `Icon`, `PlaceholderValue` y
`PlaceholderNotice`.

Las secciones de portada viven en `src/components/sections/` y se reutilizan en
las páginas interiores. El hero (`components/hero/Hero.astro`) usa el vídeo real
de la casa con su póster WebP como imagen LCP.

Además de color y tipografía, los tokens centralizan espaciado, radios
(`--radius-xs` … `--radius-2xl`), sombras (`--shadow-sm` … `--shadow-lg`,
`--shadow-glass`), transiciones (`--transition-fast`, `--transition-base`,
`--transition-emphasis`) y anchos de contenedor.

## Accesibilidad y rendimiento

- HTML semántico, un único `<h1>` por página y jerarquía de encabezados correcta.
- Navegación completa por teclado: enlace de salto, foco visible, menú y
  lightbox construidos sobre `<dialog>` nativo (trampa de foco y cierre con ESC),
  y carril horizontal de tarjetas accesible con teclado.
- Áreas táctiles de 40–48 px en todos los controles.
- Auditoría axe-core sin incidencias (WCAG 2.1 A/AA + buenas prácticas) en las
  nueve páginas, en móvil y escritorio.
- Se respeta `prefers-reduced-motion`; las animaciones son mínimas y el revelado
  al hacer scroll es CSS puro (`animation-timeline`), sin JavaScript.
- Imágenes con dimensiones explícitas y `loading="lazy"` fuera de la primera
  pantalla, para evitar desplazamientos de contenido (CLS).
- Fuentes autoalojadas por Astro, precargando sólo el peso visible en la primera
  pantalla.

## Convenciones

- El contenido nunca se escribe dentro de los componentes: vive en `src/data`
  o en `src/config`.
- Ningún dato se inventa. Lo que falta se muestra como marcador y se centraliza
  para poder sustituirlo en un solo sitio.
- Los colores, tamaños, radios, sombras y tipografías salen siempre de las
  variables de `src/styles/tokens.css`. Un `grep` de `#` o `rgb(` en
  `src/components` no devuelve ningún valor literal.
