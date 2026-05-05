/**
 * Generates invisible text using the Hangul Filler (U+3164) character.
 * @param length The number of characters to generate.
 * @returns The generated invisible string.
 */
export function generateInvisibleText(length: number): string {
  const safeLength = Math.min(10000, Math.max(1, length));
  return "\u3164".repeat(safeLength);
}
