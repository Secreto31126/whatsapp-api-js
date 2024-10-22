import { Section, type ClientTypedMessageComponent } from "../types.js";
import type { AtLeastOne } from "../utils";
/**
 * TS knowledge intensifies
 * @internal
 * @deprecated - Unused with the release of ActionProductList
 */
export declare function isProductSections(obj: unknown[]): obj is ProductSection[];
/**
 * Section API object
 *
 * @group Globals
 */
export declare class ProductSection extends Section<Product, 30> {
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
    constructor(title: string | undefined, ...products: AtLeastOne<Product>);
}
/**
 * Product API object
 *
 * @group Globals
 */
export declare class Product implements ClientTypedMessageComponent {
    /**
     * The id of the product
     */
    readonly product_retailer_id: string;
    /**
     * @override
     * @internal
     */
    get _type(): "product";
    /**
     * Builds a product component
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id: string);
    /**
     * Clone a product object (useful for lambdas and scoping down {@link CatalogProduct})
     *
     * @param product - The product to create a new object from
     * @returns A new product object
     */
    static create(product: Product): Product;
}
/**
 * Product API object
 *
 * @group Globals
 */
export declare class CatalogProduct extends Product {
    readonly catalog_id: string;
    /**
     * Builds a cataloged product component
     *
     * @param product_retailer_id - The id of the product
     * @param catalog_id - The id of the catalog the product belongs to
     */
    constructor(product_retailer_id: string, catalog_id: string);
}
//# sourceMappingURL=globals.d.ts.map