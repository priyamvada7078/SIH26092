/**
 * Utility formatters for SchemeSaathi (SIH26092)
 */

/**
 * Format a number into Indian Rupee currency format
 * e.g., 140000 -> ₹1,40,000
 */
export function formatINR(amount, decimals = 0) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a percentage value
 * e.g., 6.5 -> 6.5% p.a.
 */
export function formatPercent(rate) {
  if (rate === undefined || rate === null || isNaN(rate)) return '0% p.a.';
  return `${Number(rate).toFixed(1).replace(/\.0$/, '')}% p.a.`;
}

/**
 * Humanize project type
 */
export function humanizeProjectType(type) {
  switch (type) {
    case 'business':
      return 'Business / Self-Employment';
    case 'education':
      return 'Education';
    case 'other':
      return 'Other Permissible Project';
    default:
      return type || 'N/A';
  }
}

/**
 * Humanize education status
 */
export function humanizeEducationStatus(status) {
  switch (status) {
    case 'student':
      return 'Currently a Student';
    case 'completed':
      return 'Completed Course / Graduate';
    case 'not_applicable':
      return 'Not Applicable';
    default:
      return status || 'N/A';
  }
}
