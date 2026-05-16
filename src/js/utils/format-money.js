export function formatMoney(amount) {
  return Number(amount)
    .toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
}