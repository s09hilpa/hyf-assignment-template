import { teas } from "../data/teas.js";
import { Tea } from "./exercise1.js";
import { Order } from "./exercise2.js";
import { OrderItem } from "./exercise2.js";
import { Inventory } from "./exercise3.js";
import { Customer } from "./exercise4.js";

class TeaShop {
  constructor(teaData) {
    this.catalog = teaData.map(Tea.fromObject);
    this.inventory = new Inventory();
    this.catalog.forEach((tea) => {
      const data = teaData.find((t) => t.name === tea.name);
      this.inventory.add(tea, data.stockCount);
    });
    this.customers = [];
  }

  registerCustomer(name, email) {
    const customer = new Customer(name, email);
    this.customers.push(customer);
    return customer;
  }

  createOrder(customer, items) {
    if (!(customer instanceof Customer)) {
      throw new Error(`Must provide a valid Customer`);
    }
    const order = new Order();
    items.forEach(({ teaName, grams }) => {
      const tea = this.catalog.find((t) => t.name === teaName);
      if (!tea) throw new Error(`Tea not found: ${teaName}`);
      if (grams > this.inventory.getStock(teaName))
        throw new Error(`Not enough stock for ${teaName}`);

      const orderItem = new OrderItem(tea, grams);
      order.addItem(orderItem);
      this.inventory.sell(teaName, grams);
      return orderItem;
    });

    customer.placeOrder(order);
    return order;
  }

  getReport() {
    const totalCustomers = this.customers.length;
    const totalOrders = this.customers.reduce(
      (sum, c) => sum + c.orders.length,
      0,
    );
    const totalRevenue = this.customers.reduce(
      (sum, c) => sum + c.totalSpent(),
      0,
    );
    const lowStock = this.inventory
      .getLowStock(50)
      .map((item) => `${item.tea.name}: ${item.stockCount}g`);

    return `
Tea Shop Report:
- Total customers: ${totalCustomers}
- Total orders: ${totalOrders}
- Total revenue: ${totalRevenue.toFixed(2)} DKK
- Low stock items (<50g):
  ${lowStock.join("\n  ")}
`.trim();
  }
}

// Test:
const shop = new TeaShop(teas);

const alex = shop.registerCustomer("Alex", "alex@example.com");
const maria = shop.registerCustomer("Maria", "maria@example.com");

const order1 = shop.createOrder(alex, [
  { teaName: "Sencha", grams: 100 },
  { teaName: "Matcha", grams: 30 },
]);
console.log(order1.getSummary());

const order2 = shop.createOrder(maria, [{ teaName: "Earl Grey", grams: 200 }]);
console.log(order2.getSummary());

console.log(shop.getReport());
