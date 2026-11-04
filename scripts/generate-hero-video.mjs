/**
 * VÍDEO DEL HERO — generación reproducible
 * =============================================================================
 * Convierte la fotografía nocturna de la casa en un vídeo de fondo con un
 * movimiento de cámara lento tipo Ken Burns (zoom suave + desplazamiento de
 * encuadre). No inventa movimiento: sólo mueve la "cámara" sobre la foto.
 *
 * El movimiento sigue una curva coseno (0 → 1 → 0) en 14 s, así que el último
 * fotograma coincide con el primero y el bucle no tiene salto.
 *
 * Uso:
 *   node scripts/generate-hero-video.mjs
 *   FFMPEG_PATH=/ruta/a/ffmpeg node scripts/generate-hero-video.mjs
 *   node scripts/generate-hero-video.mjs "public/otra-foto.png"
 *
 * Salida:
 *   public/videos/casa-leblanc-hero.{mp4,webm}       1600×900 (escritorio)
 *   public/videos/casa-leblanc-hero-960.{mp4,webm}   960×540  (móvil)
 *   public/images/casa-leblanc/hero/casa-leblanc-hero-poster-{640,960,1600}.webp
 *   public/images/casa-leblanc/hero/casa-leblanc-hero-poster-1600.jpg
 *
 * 1600×900 es la mayor resolución 16:9 que permite el original (1672×941) sin
 * ampliarlo. Si se usa una fotografía de ≥ 1920 px, cambia WIDTH/HEIGHT.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const SOURCE = process.argv[2] ?? 'public/ChatGPT Image 3 nov 2026, 08_32_35 a.m.png';
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const WIDTH = 1600;
const HEIGHT = 900;
const FPS = 25;
const FRAMES = 350; // 14 s
const VIDEO_DIR = 'public/videos';
const POSTER_DIR = 'public/images/casa-leblanc/hero';

const run = (args) => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

try {
  execFileSync(FFMPEG, ['-version'], { stdio: 'ignore' });
} catch {
  console.error(`No se encontró ffmpeg ("${FFMPEG}"). Instálalo o define FFMPEG_PATH.`);
  process.exit(1);
}

mkdirSync(VIDEO_DIR, { recursive: true });
mkdirSync(POSTER_DIR, { recursive: true });

// p: 0 → 1 → 0 (coseno) · q: oscilación lateral suave. Ambos cierran el ciclo.
const p = `(1-cos(2*PI*on/${FRAMES}))/2`;
const q = `sin(2*PI*on/${FRAMES})`;
// Se amplía la fuente ×4 antes de `zoompan` para evitar el temblor de redondeo.
const filter = [
  'scale=iw*4:-1:flags=lanczos',
  `zoompan=z='1.015+0.105*${p}':x='(iw-iw/zoom)*(0.5+0.22*${q})':y='(ih-ih/zoom)*(0.58-0.10*${p})':d=${FRAMES}:s=${WIDTH}x${HEIGHT}:fps=${FPS}`,
  'format=yuv420p',
].join(',');

const master = join(VIDEO_DIR, 'casa-leblanc-hero.mp4');
const h264 = ['-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an'];
const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an'];

console.log('→ MP4 1600×900 (H.264)');
run(['-i', SOURCE, '-vf', filter, ...h264, '-crf', '22', '-profile:v', 'high', '-level', '4.0', master]);

console.log('→ MP4 960×540');
run(['-i', master, '-vf', 'scale=960:540:flags=lanczos', ...h264, '-crf', '24', '-profile:v', 'main', join(VIDEO_DIR, 'casa-leblanc-hero-960.mp4')]);

console.log('→ WebM 1600×900 (VP9)');
run(['-i', master, ...vp9, '-crf', '36', join(VIDEO_DIR, 'casa-leblanc-hero.webm')]);

console.log('→ WebM 960×540');
run(['-i', master, '-vf', 'scale=960:540:flags=lanczos', ...vp9, '-crf', '38', join(VIDEO_DIR, 'casa-leblanc-hero-960.webm')]);

console.log('→ Pósters (primer fotograma)');
const tmp = mkdtempSync(join(tmpdir(), 'hero-'));
const frame = join(tmp, 'frame0.png');
run(['-i', master, '-frames:v', '1', frame]);
for (const width of [640, 960, 1600]) {
  await sharp(frame).resize(width).webp({ quality: 78 }).toFile(join(POSTER_DIR, `casa-leblanc-hero-poster-${width}.webp`));
}
await sharp(frame).resize(1600).jpeg({ quality: 80, mozjpeg: true }).toFile(join(POSTER_DIR, 'casa-leblanc-hero-poster-1600.jpg'));
rmSync(tmp, { recursive: true, force: true });

console.log('✓ Vídeo del hero y pósters generados.');
