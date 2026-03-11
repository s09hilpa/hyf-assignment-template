import { teas } from "./teas.js";
function searchTeas(teas, query) {
  return teas
    .filter((tea) => tea.name.toLowerCase().includes(query.toLowerCase()))
    .map((tea) => tea.name)
    .sort();
}

console.log(searchTeas(teas, "earl"));
console.log(searchTeas(teas, "dragon"));
console.log(searchTeas(teas, "ch"));
