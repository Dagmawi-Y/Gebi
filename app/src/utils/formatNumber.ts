export default function formatNumber(num) {
  return String(num.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
