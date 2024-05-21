"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var globals_exports = {};
__export(globals_exports, {
  Product: () => Product,
  ProductSection: () => ProductSection,
  isProductSections: () => isProductSections
});
module.exports = __toCommonJS(globals_exports);
var import_types = require("../types.js");
function isProductSections(obj) {
  return obj[0] instanceof ProductSection;
}
class ProductSection extends import_types.Section {
  /**
   * The products of the section
   */
  product_items;
  /**
   * Builds a product section component
   *
   * @param title - The title of the product section
   * @param products - The products to add to the product section
   * @throws If title is over 24 characters if provided
   * @throws If more than 30 products are provided
   */
  constructor(title, ...products) {
    super("ProductSection", "products", products, 30, title);
    this.product_items = products;
  }
}
class Product {
  /**
   * The id of the product
   */
  product_retailer_id;
  /**
   * Builds a product component
   *
   * @param product_retailer_id - The id of the product
   */
  constructor(product_retailer_id) {
    this.product_retailer_id = product_retailer_id;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Product,
  ProductSection,
  isProductSections
});
//# sourceMappingURL=globals.js.map
