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
    this.product_items = products.map(Product.create);
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
  /**
   * Clone a product object (useful for lambdas and scoping down {@link CatalogProduct})
   *
   * @param product - The product to create a new object from
   * @returns A new product object
   */
  static create(product) {
    return new Product(product.product_retailer_id);
  }
}
class CatalogProduct extends Product {
  /**
   * Builds a cataloged product component
   *
   * @param product_retailer_id - The id of the product
   * @param catalog_id - The id of the catalog the product belongs to
   */
  constructor(product_retailer_id, catalog_id) {
    super(product_retailer_id);
    this.catalog_id = catalog_id;
  }
}
export {
  CatalogProduct,
  Product,
  ProductSection,
  isProductSections
};
//# sourceMappingURL=globals.js.map
