# Fotografías de la propiedad

Coloca aquí los archivos de imagen (`.jpg`, `.png`, `.webp` o `.avif`) y
referencia su **nombre de archivo** desde `src/data/gallery.ts` o
`src/data/nearby.ts`.

Ejemplo:

```ts
{
  src: 'exterior-01.jpg',   // el archivo vive en src/assets/property/
  alt: 'Fachada de la casa al atardecer',
  category: 'exterior',
  width: 2400,              // dimensiones reales del archivo
  height: 1600,
  orientation: 'landscape',
  label: 'Exterior · Fachada',
}
```

Al hacerlo, la imagen pasa automáticamente por el pipeline de `astro:assets`:
se generan formatos modernos (WebP/AVIF), varios tamaños con `srcset` y las
dimensiones explícitas que evitan saltos de maquetación.

## Recomendaciones

| Uso                | Proporción | Resolución mínima |
| ------------------ | ---------- | ----------------- |
| Hero / portada     | 3:2        | 2400 × 1600 px    |
| Galería horizontal | 3:2        | 2400 × 1600 px    |
| Galería vertical   | 4:5        | 1600 × 2000 px    |
| Lugares cercanos   | 3:2        | 1600 × 1067 px    |

- Formato de origen: JPEG o PNG de buena calidad (Astro se encarga de optimizar).
- Evita textos incrustados en la imagen: no se traducen ni se leen por buscadores.
- El mosaico recorta algunas piezas: deja aire alrededor del motivo principal.

Mientras un `src` esté vacío, la web muestra un mockup con la proporción exacta
de la fotografía que irá en su lugar, de modo que el diseño no cambia al
sustituirlo.
