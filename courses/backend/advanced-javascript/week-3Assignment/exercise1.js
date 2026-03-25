const API_BASE = "https://tea-api-787553294298.europe-west1.run.app/api";

async function searchTeas(query) {
  // 1. Fetch all teas from the API
  const response = await fetch(`${API_BASE}/teas`);
  const teas = await response.json();

  // 2. Filter to teas where name includes query (case-insensitive)
  const filtered = teas.filter((tea) =>
    tea.name.toLowerCase().includes(query.toLowerCase()),
  );
  // 3. Return array of matching tea objects
  return filtered;
}
// Test it:
searchTeas("pearl").then((teas) => {
  console.log("Search results for 'pearl':");
  teas.forEach((tea) => console.log(`- ${tea.name}`));
});
