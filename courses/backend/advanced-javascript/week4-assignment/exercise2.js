import { teas } from "../data/teas.js";
import { Tea } from "./exercise1.js";

export class OrderItem {
  constructor(tea, grams) {
    if (!(tea instanceof Tea)) {
      throw new Error("Tea mist be a Tea instance");
    }

    if (typeof grams !== "number" || grams <= 0) {
      throw new Error("grams must be a positive number");
    }

    this.tea = tea;
    this.grams = grams;
  }
  lineTotal() {
    return this.tea.priceFor(this.grams);
  }

  describe() {
    const total = this.lineTotal().toFixed(2);
    return `${this.grams}g ${this.tea.name} - ${total} DKK`;
  }
}

export class Order {
  constructor() {
    this.items = [];
    this.status = "pending";
  }

  addItem(orderItem) {
    if (this.status !== "pending") {
      throw new Error("Cannot add items to a completed order");
    }
    if (!(orderItem instanceof OrderItem)) {
      throw new Error("Must add an OrderItem");
    }
    this.items.push(orderItem);
  }
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.lineTotal(), 0);
  }

  getSummary() {
    const lines = this.items.map((item) => "  " + item.describe());
    lines.unshift(`Order (${this.status}) - ${this.items.length} items`);
    lines.push(`Total: ${this.getTotal().toFixed(2)} DKK`);
    return lines.join("\n");
  }
}

// Test:
const teaInstances = teas.map(Tea.fromObject);
const order = new Order();
order.addItem(new OrderItem(teaInstances[0], 200)); // Sencha
order.addItem(new OrderItem(teaInstances[7], 50)); // Matcha

console.log(order.getSummary());
console.log("Total:", order.getTotal().toFixed(2), "DKK");
