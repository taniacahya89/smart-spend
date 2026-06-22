/**
 * Formats a numeric value to Indonesian Rupiah currency style.
 * Example: 50000 -> Rp 50.000
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats an ISO date string "YYYY-MM-DD" into a readable Indonesian date.
 * Example: "2026-06-22" -> "22 Juni 2026"
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return dateStr;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

/**
 * Gets the current local date in "YYYY-MM-DD" format.
 */
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Capitalizes or processes a category name for formatting uniformity if needed.
 */
export const formatCategory = (category: string): string => {
  if (!category) return '';
  return category.trim();
};

/**
 * Formats standard number inputs to include thousand separators as a text helper.
 * Example: 1000000 -> "1.000.000"
 */
export const formatThousandSeparator = (value: number | string): string => {
  const num = typeof value === 'number' ? value : parseFloat(value.replace(/[^\d]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('id-ID');
};
