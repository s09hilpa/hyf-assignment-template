import { Tea } from "./exercise1.js";
import { teas } from "../data/teas.js";
import { Order } from "./exercise2.js";
import { OrderItem } from "./exercise2.js";
export class Customer {
  constructor(name, email) {
    if (!name) {
      throw new Error(`Name is mandatory`);
    }
    if (!email) {
      throw new Error(`Email is required`);
    }
    this.name = name;
    this.email = email;
    this.orders = [];
  }

  placeOrder(order) {
    if (!(order instanceof Order)) {
      throw new Error(`Must provide an order`);
    }
    order.status = `confirmed`;
    this.orders.push(order);
    return order;
  }

  totalSpent() {
    return this.orders.reduce((total, order) => {
      return total + order.getTotal();
    }, 0);
  }

  getOrderHistory() {
    const lines = [];
    lines.push(`${this.name} (${this.email}) - ${this.orders.length} orders`);
    lines.push("");
    this.orders.forEach((order, index) => {
      lines.push(
        `Order ${index + 1} (${order.status}) - ${order.items.length} item${order.items.length > 1 ? "s" : ""}`,
      );
      order.items.forEach((item) => {
        lines.push(`  ${item.describe()}`);
      });

      lines.push(`Total: ${order.getTotal().toFixed(2)} DKK`);
      lines.push("");
    });

    lines.push(`Lifetime total: ${this.totalSpent().toFixed(2)} DKK`);

    return lines.join("\n");
  }
}

// Test:
const teaInstances = teas.map(Tea.fromObject);
const customer = new Customer("Alex", "alex@example.com");

const order1 = new Order();
order1.addItem(new OrderItem(teaInstances[0], 100)); // Sencha
customer.placeOrder(order1);

const order2 = new Order();
order2.addItem(new OrderItem(teaInstances[7], 50)); // Matcha
customer.placeOrder(order2);

console.log(customer.getOrderHistory());
console.log("Total spent:", customer.totalSpent().toFixed(2), "DKK");
