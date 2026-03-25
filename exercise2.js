const API_BASE = "https://tea-api-787553294298.europe-west1.run.app/api";
async function getTeaDetails(id) {
  // Fetch tea and inventory in PARALLEL using Promise.all

  const [teaRes, stockRes] = await Promise.all([
    fetch(`${API_BASE}/teas/${id}`),
    fetch(`${API_BASE}/inventory/${id}`),
  ]);
  // Return combined object: { ...tea, stock: number }

  const tea = await teaRes.json();
  const stockData = await stockRes.json();

  return {
    ...tea,
    stock: stockData.stockCount,
  };
}
// Test it:
getTeaDetails(1).then((tea) => {
  console.log(`${tea.name} (${tea.origin})`);
  console.log(`Price: ${tea.pricePerGram} DKK/gram`);
  console.log(`Stock: ${tea.stock} grams`);
  console.log(`Value: ${(tea.pricePerGram * tea.stock).toFixed(2)} DKK`);
});
