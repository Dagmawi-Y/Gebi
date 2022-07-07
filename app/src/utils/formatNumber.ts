export default function formatNumber(num) {
  return String(num.toString()).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}
