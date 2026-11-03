/**
 * Colores de marca que viven fuera del CSS.
 *
 * Son los únicos valores de color que no puede leer una hoja de estilos: el
 * `theme-color` del navegador y los colores del manifiesto web. Deben coincidir
 * con `--color-surface-deep` y `--color-background` de `src/styles/tokens.css`.
 */
export const theme = {
  /** Igual que `--color-surface-deep`. */
  themeColor: '#10293f',
  /** Igual que `--color-background`. */
  backgroundColor: '#f7fbfe',
} as const;
