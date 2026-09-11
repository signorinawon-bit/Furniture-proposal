export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceNumber(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}
