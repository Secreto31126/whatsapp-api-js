import { Section } from "../types.js";
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
export declare class Product {
    /**
     * The id of the product
     */
    readonly product_retailer_id: string;
    /**
     * Builds a product component
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id: string);
}
//# sourceMappingURL=globals.d.ts.map