import { teas } from "./teas.js";
function lowStockAlert(teas) {
  return teas
    .filter((tea) => tea.stockCount < 50)
    .map((tea) => ({ name: tea.name, stockCount: tea.stockCount }))
    .sort((a, b) => a.stockCount - b.stockCount);
}
console.log(lowStockAlert(teas));
