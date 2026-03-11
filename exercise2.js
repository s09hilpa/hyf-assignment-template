import { teas } from "./teas.js";
function inventoryReport(teas) {
  const totalTeas = teas.length;
  const inStock = teas.filter((tea) => tea.inStock).length;

  const outOfStock = teas.filter((tea) => !tea.inStock).length;

  const totalInventoryValue = teas.reduce(
    (sum, tea) => sum + tea.pricePerGram * tea.stockCount,
    0,
  );

  const averagePrice =
    teas.reduce((sum, tea) => sum + tea.pricePerGram, 0) / teas.length;
  return {
    totalTeas,
    inStock,
    outOfStock,
    totalInventoryValue,
    averagePrice,
  };
}
console.log(inventoryReport(teas));
