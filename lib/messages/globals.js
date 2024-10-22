// src/types.ts
var ClientLimitedMessageComponent = class {
  /**
   * Throws an error if the array length is greater than the specified number.
   *
   * @param p - The parent component name
   * @param c - The component name
   * @param a - The array to check the length of
   * @param n - The maximum length
   * @throws `${p} can't have more than ${n} ${c}`
   */
  constructor(p, c, a, n) {
    if (a.length > n) {
      throw new Error(`${p} can't have more than ${n} ${c}`);
    }
  }
};
var Section = class extends ClientLimitedMessageComponent {
  /**
   * The title of the section
   */
  title;
  /**
   * Builds a section component
   *
   * @param name - The name of the section's type
   * @param keys_name - The name of the section's keys
   * @param elements - The elements of the section
   * @param max - The maximum number of elements in the section
   * @param title - The title of the section
   * @param title_length - The maximum length of the title
   * @throws If more than N elements are provided
   * @throws If title is over 24 characters if provided
   */
  constructor(name, keys_name, elements, max, title, title_length = 24) {
    super(name, keys_name, elements, max);
    if (title) {
      if (title.length > title_length) {
        throw new Error(
          `${name} title must be ${title_length} characters or less`
        );
      }
      this.title = title;
    }
  }
};

// src/messages/globals.ts
function isProductSections(obj) {
  return obj[0] instanceof ProductSection;
}
var ProductSection = class extends Section {
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
};
var Product = class _Product {
  /**
   * The id of the product
   */
  product_retailer_id;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "product";
  }
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
    return new _Product(product.product_retailer_id);
  }
};
var CatalogProduct = class extends Product {
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
};
export {
  CatalogProduct,
  Product,
  ProductSection,
  isProductSections
};
