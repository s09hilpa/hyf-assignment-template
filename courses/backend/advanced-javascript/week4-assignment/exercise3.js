import { Tea } from "./exercise1.js";
import { teas } from "../data/teas.js";

export class Inventory {
  constructor() {
    this.items = new Map();
  }

  add(tea, stockCount) {
    if (!(tea instanceof Tea)) {
      throw new Error("Must provide a Tea instance");
    }

    if (typeof stockCount !== "number" || stockCount < 0) {
      throw new Error("Stock must be a non-negative number");
    }

    this.items.set(tea.name, { tea, stockCount });
  }

  sell(teaName, grams) {
    const item = this.items.get(teaName);

    if (!item) {
      throw new Error(`Tea not found: ${teaName}`);
    }

    if (grams <= 0) {
      throw new Error("Grams must be positive");
    }

    if (item.stockCount < grams) {
      throw new Error("Not enough stock");
    }

    item.stockCount -= grams;
  }

  restock(teaName, grams) {
    const item = this.items.get(teaName);

    if (!item) {
      throw new Error(`Tea not found: ${teaName}`);
    }

    if (grams <= 0) {
      throw new Error("Grams must be positive");
    }

    item.stockCount += grams;
  }

  getStock(teaName) {
    const item = this.items.get(teaName);
    if (!item) throw new Error(`Tea not found: ${teaName}`);
    return item.stockCount;
  }

  getLowStock(threshold) {
    return Array.from(this.items.values()).filter(
      (item) => item.stockCount < threshold,
    );
  }

  getTotalValue() {
    return Array.from(this.items.values()).reduce((total, item) => {
      return total + item.tea.pricePerGram * item.stockCount;
    }, 0);
  }
}
const teaInstances = teas.map(Tea.fromObject);
const inventory = new Inventory();

teaInstances.forEach((tea) => {
  const data = teas.find((t) => t.name === tea.name);
  inventory.add(tea, data.stockCount);
});

console.log("Sencha stock:", inventory.getStock("Sencha"));

inventory.sell("Sencha", 50);
console.log("After selling 50g:", inventory.getStock("Sencha"));

console.log("Low stock (< 50):");
inventory.getLowStock(50).forEach((item) => {
  console.log(`- ${item.tea.name}: ${item.stockCount}g`);
});

console.log(
  "Total inventory value:",
  inventory.getTotalValue().toFixed(2),
  "DKK",
);
