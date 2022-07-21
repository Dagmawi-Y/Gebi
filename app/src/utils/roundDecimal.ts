export default function roundDecimal(num) {
  num = num.toString();
  return parseFloat(num).toFixed(2);
}
