import { Section } from "../types.js";
import type { AtLeastOne } from "../utils";

/**
 * TS knowledge intensifies
 * @internal
 * @deprecated - Unused with the release of ActionProductList
 */
export function isProductSections(obj: unknown[]): obj is ProductSection[] {
    return obj[0] instanceof ProductSection;
}

/**
 * Section API object
 *
 * @group Globals
 */
export class ProductSection extends Section<Product, 30> {
    /**
     * The products of the section
     */
    readonly product_items: Product[];

    /**
     * Builds a product section component
     *
     * @param title - The title of the product section
     * @param products - The products to add to the product section
     * @throws If title is over 24 characters if provided
     * @throws If more than 30 products are provided
     */
    constructor(title: string | undefined, ...products: AtLeastOne<Product>) {
        super("ProductSection", "products", products, 30, title);
        this.product_items = products.map(Product.clone);
    }
}

/**
 * Product API object
 *
 * @group Globals
 */
export class Product {
    /**
     * The id of the product
     */
    readonly product_retailer_id: string;

    /**
     * Builds a product component
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id: string) {
        this.product_retailer_id = product_retailer_id;
    }

    /**
     * Clone a product object (useful for lambdas and scoping down {@link CatalogProduct})
     *
     * @param product - The product to create a new object from
     * @returns A new product object
     */
    static clone(product: Product): Product {
        return new Product(product.product_retailer_id);
    }
}

/**
 * Product API object
 *
 * @group Globals
 */
export class CatalogProduct extends Product {
    /**
     * Builds a cataloged product component
     *
     * @param product_retailer_id - The id of the product
     * @param catalog_id - The id of the catalog the product belongs to
     */
    constructor(
        product_retailer_id: string,
        readonly catalog_id: string
    ) {
        super(product_retailer_id);
    }
}
