const API_BASE = "https://tea-api-787553294298.europe-west1.run.app/api";

export async function checkOrderStock(items) {
  //1. Fetch inventory from API
  const response = await fetch(`${API_BASE}/inventory`);
  const inventory = await response.json();

  const shortages = [];

  // 2. Check each item has enough stock
  for (const item of items) {
    const stockItem = inventory.find((i) => i.teaId === item.teaId);

    const available = stockItem ? stockItem.gramsInStock : 0;

    if (available < item.grams) {
      shortages.push({
        teaId: item.teaId,
        name: `Tea ${item.teaId}`, // simple name (we can improve later)
        needed: item.grams,
        available: available,
      });
    }
  }

  // 3. Return result
  return {
    inStock: shortages.length === 0,
    shortages,
  };
}

const largeOrder = [
  { teaId: 1, grams: 100 },
  { teaId: 2, grams: 500 },
  { teaId: 3, grams: 9999 },
];

checkOrderStock(largeOrder).then((result) => {
  if (result.inStock) {
    console.log("All items in stock!");
  } else {
    console.log("Shortages:");
    result.shortages.forEach((s) => {
      console.log(`- ${s.name}: need ${s.needed}, have ${s.available}`);
    });
  }
});
