/**
 * Utility functions for generating clean URL slugs supporting Armenian and Latin characters
 */

export function generateCleanSlug(text: string, fallbackId: string | number): string {
  const clean = text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u0531-\u058F\u0561-\u0587-]/g, '')
    .replace(/^-+|-+$/g, '');
  return clean || `item-${fallbackId}`;
}

export function formatPriceAMD(amount: number): string {
  return new Intl.NumberFormat('hy-AM', {
    style: 'currency',
    currency: 'AMD',
    maximumFractionDigits: 0,
  }).format(amount);
}
