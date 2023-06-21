export default function formatNumber(num) {
  num = parseFloat(num).toFixed(2);
  return String(num.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
