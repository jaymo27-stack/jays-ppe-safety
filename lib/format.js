export function formatPrice(amount) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'ZAR';
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `R${Number(amount).toFixed(2)}`;
  }
}
