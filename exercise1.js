import { teas } from "./teas.js";

const result = teas
  .filter((tea) => tea.caffeineLevel !== "none")
  .map((tea) => tea.name.toUpperCase());

console.log(result);
