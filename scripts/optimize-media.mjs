/**
 * OPTIMIZACIÓN DE FOTOGRAFÍAS Y VÍDEO
 * =============================================================================
 * Genera, a partir de los originales de `media/originales/` (que nunca se
 * modifican ni se publican), los recursos que sirve la web:
 *
 * - WebP en varios anchos (480 / 768 / 1200, sin ampliar nunca el original)
 *   dentro de `public/images/casa-leblanc/<carpeta>/<slug>-<ancho>.webp`.
 * - `src/data/photos.generated.json` con dimensiones y anchos disponibles,
 *   que consume `src/data/gallery.ts` para escribir `width`, `height` y
 *   `srcset` exactos (CLS = 0).
 * - Imagen social 1200 × 630 en JPEG (máxima compatibilidad en WhatsApp,
 *   Facebook y LinkedIn).
 * - Vídeo del hero sin audio en MP4 (H.264) y WebM (VP9) + póster WebP, si
 *   hay un binario de ffmpeg disponible (`FFMPEG_PATH` o `ffmpeg` en el PATH).
 *
 * Uso:  node scripts/optimize-media.mjs
 *       FFMPEG_PATH=/ruta/a/ffmpeg node scripts/optimize-media.mjs
 *
 * Toda la selección y los nombres viven en `scripts/media-manifest.json`.
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(path.join(root, 'scripts/media-manifest.json'), 'utf8'));

const sourceDir = path.join(root, manifest.sourceDir);
const outputDir = path.join(root, manifest.outputDir);
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const report = { originalBytes: 0, webpBytes: 0, largestBytes: 0, mobileBytes: 0, avifProbeBytes: 0, webpProbeBytes: 0, files: 0 };
const generated = {};

for (const photo of manifest.photos) {
  const input = path.join(sourceDir, photo.source);
  const { size } = await stat(input);
  report.originalBytes += size;

  const image = sharp(input).rotate();
  const { width, height } = await image.metadata();
  const dir = path.join(outputDir, photo.dir);
  await mkdir(dir, { recursive: true });

  /* Anchos pedidos que no superan el original; si el original es menor que el
     mayor ancho pedido, se añade su ancho nativo como última variante. */
  const widths = manifest.widths.filter((w) => w < width);
  if (width <= manifest.widths.at(-1) && !widths.includes(width)) widths.push(width);
  else if (width > manifest.widths.at(-1)) widths.push(manifest.widths.at(-1));
  const uniqueWidths = [...new Set(widths)].sort((a, b) => a - b);

  for (const w of uniqueWidths) {
    const file = path.join(dir, `${photo.slug}-${w}.webp`);
    const info = await sharp(input)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: manifest.quality, effort: 6, smartSubsample: true })
      .toFile(file);
    report.webpBytes += info.size;
    report.files += 1;
    if (w === uniqueWidths.at(-1)) report.largestBytes += info.size;
    if (w === 768) report.mobileBytes += info.size;
  }

  /* Sonda AVIF a 768 px: sólo mide, no se publica (ver informe). */
  const probe = sharp(input).rotate().resize({ width: 768 });
  report.avifProbeBytes += (await probe.clone().avif({ quality: 60, effort: 4 }).toBuffer()).length;
  report.webpProbeBytes += (await probe.clone().webp({ quality: manifest.quality, effort: 6 }).toBuffer()).length;

  const largest = uniqueWidths.at(-1);
  generated[photo.slug] = {
    src: `/${path.relative(path.join(root, 'public'), dir).split(path.sep).join('/')}/${photo.slug}`,
    width: largest,
    height: Math.round((height / width) * largest),
    widths: uniqueWidths,
  };
  console.log(`✓ ${photo.dir}/${photo.slug}  ${width}×${height}  ${kb(size)} → [${uniqueWidths.join(', ')}]`);
}

/* Imagen social */
{
  const { og } = manifest;
  const input = path.join(sourceDir, og.source);
  const resized = sharp(input).rotate().resize({ width: og.width });
  const { height } = await resized.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const top = Math.min(Math.round(height * og.top), height - og.height);
  const file = path.join(outputDir, og.file);
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(await resized.toBuffer())
    .extract({ left: 0, top, width: og.width, height: og.height })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
  console.log(`✓ og → ${og.file}`);
}

/* Vídeo */
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
let video = null;
try {
  execFileSync(ffmpeg, ['-version'], { stdio: 'ignore' });
  const { video: v } = manifest;
  const input = path.join(sourceDir, v.source);
  const out = path.join(root, v.outputDir);
  await mkdir(out, { recursive: true });
  const mp4 = path.join(out, `${v.slug}.mp4`);
  const webm = path.join(out, `${v.slug}.webm`);
  const base = ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-an', '-map_metadata', '-1'];
  /* El bucle empieza en `loopStart` (la piscina) y termina enlazando con ese
     mismo instante: [loopStart → fin] + [0 → loopStart]. El único corte es el
     que ya existía entre el final y el principio del vídeo original. */
  const t = Number(v.loopStart ?? 0);
  const reorder = t > 0
    ? ['-filter_complex', `[0:v]trim=start=${t},setpts=PTS-STARTPTS[a];[0:v]trim=end=${t},setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]`, '-map', '[v]']
    : [];

  execFileSync(ffmpeg, [
    ...base, ...reorder, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryslow', '-crf', '27',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4,
  ]);
  execFileSync(ffmpeg, [
    ...base, ...reorder, '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1',
    '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', webm,
  ]);

  /* Póster = primer fotograma del vídeo final, para que la transición
     póster → vídeo no salte. */
  const tmp = path.join(out, '.poster.png');
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-frames:v', '1', tmp]);
  const posterBase = path.join(outputDir, v.poster);
  await mkdir(path.dirname(posterBase), { recursive: true });
  const meta = await sharp(tmp).metadata();
  const posterWidths = [480, meta.width].filter((w, i, all) => w <= meta.width && all.indexOf(w) === i);
  for (const w of posterWidths) {
    await sharp(tmp).resize({ width: w }).webp({ quality: 80, effort: 6 }).toFile(`${posterBase}-${w}.webp`);
  }
  await rm(tmp);

  const sizes = { source: (await stat(input)).size, mp4: (await stat(mp4)).size, webm: (await stat(webm)).size };
  video = {
    mp4: `/${path.relative(path.join(root, 'public'), mp4).split(path.sep).join('/')}`,
    webm: `/${path.relative(path.join(root, 'public'), webm).split(path.sep).join('/')}`,
    poster: `/${path.relative(path.join(root, 'public'), posterBase).split(path.sep).join('/')}`,
    posterWidths,
    width: meta.width,
    height: meta.height,
  };
  console.log(`✓ vídeo ${kb(sizes.source)} → mp4 ${kb(sizes.mp4)} · webm ${kb(sizes.webm)} (${meta.width}×${meta.height})`);
} catch (error) {
  console.warn(`⚠ Vídeo omitido: no se encontró ffmpeg (${error.message.split('\n')[0]}).`);
  const previous = JSON.parse(await readFile(path.join(root, 'src/data/photos.generated.json'), 'utf8').catch(() => '{}'));
  video = previous.video ?? null;
}

await writeFile(
  path.join(root, 'src/data/photos.generated.json'),
  `${JSON.stringify({ photos: generated, video }, null, 2)}\n`,
);

const pct = (part) => `${((1 - part / report.originalBytes) * 100).toFixed(1)} %`;
console.log(`
Fotografías: ${manifest.photos.length} originales · ${report.files} archivos WebP
Peso original (JPEG):              ${kb(report.originalBytes)}
WebP, variante mayor de cada foto: ${kb(report.largestBytes)}  (reducción ${pct(report.largestBytes)})
WebP, variante 768 px (móvil):     ${kb(report.mobileBytes)}  (reducción ${pct(report.mobileBytes)})
Todas las variantes en disco:      ${kb(report.webpBytes)}
Sonda 768 px — WebP: ${kb(report.webpProbeBytes)} · AVIF: ${kb(report.avifProbeBytes)}`);
