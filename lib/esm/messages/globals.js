import { Section } from "../types.js";
function isProductSections(obj) {
  return obj[0] instanceof ProductSection;
}
class ProductSection extends Section {
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
export {
  Product,
  ProductSection,
  isProductSections
};
//# sourceMappingURL=globals.js.map
