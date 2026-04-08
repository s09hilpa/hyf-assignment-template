import { teas } from "../data/teas.js";
export class Tea {
  constructor(name, type, origin, pricePerGram, organic) {
    this.name = name;
    this.type = type;
    this.origin = origin;
    this.pricePerGram = pricePerGram;
    this.organic = organic;
    this.validate();
  }
  validate() {
    const validTypes = ["green", "black", "herbal", "oolong", "white"];

    // name must be non-empty
    if (!this.name) {
      throw new Error("Name is required");
    }

    // type must be valid
    if (!validTypes.includes(this.type)) {
      throw new Error(`Invalid type: ${this.type}`);
    }

    // price must be positive
    if (this.pricePerGram <= 0) {
      throw new Error("Price must be a positive number");
    }
  }

  priceFor(grams) {
    return grams * this.pricePerGram;
  }

  describe() {
    const pricePer100g = (this.pricePerGram * 100).toFixed(2);

    let result = `${this.name} (${this.type}) from ${this.origin} - ${pricePer100g} DKK/100g`;

    if (this.organic) {
      result += " [organic]";
    }

    return result;
  }
  static fromObject(obj) {
    // Create a Tea from a plain object
    return new Tea(
      obj.name,
      obj.type,
      obj.origin,
      obj.pricePerGram,
      obj.organic,
    );
  }
}

// Test validation:
try {
  new Tea("", "green", "Japan", 0.12, true);
} catch (e) {
  console.log(e.message);
} // "Name is required"

try {
  new Tea("Test", "purple", "Japan", 0.12, true);
} catch (e) {
  console.log(e.message);
} // "Invalid type: purple"

// Test factory method:
const teaInstances = teas.map(Tea.fromObject);
console.log(teaInstances.length); // 20
console.log(teaInstances[0].describe());
// "Sencha (green) from Japan - 12.00 DKK/100g [organic]"
console.log(teaInstances[1].describe());
// "Earl Grey (black) from India - 8.00 DKK/100g"
