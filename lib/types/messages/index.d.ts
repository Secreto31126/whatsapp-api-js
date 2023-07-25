import { ClientLimitedMessageComponent } from "../types.js";
import { AtLeastOne } from "../utils.js";
export { default as Text } from "./text.js";
export { default as Location } from "./location.js";
export { default as Reaction } from "./reaction.js";
export * from "./contacts.js";
export * from "./interactive.js";
export * from "./media.js";
export * from "./template.js";
/**
 * TS knowledge intensifies
 * @internal
 */
export declare function isProductSections(obj: unknown[]): obj is ProductSection[];
/**
 * Section API abstract object
 *
 * All sections are structured the same way, so this abstract class is used to reduce code duplication
 *
 * @remarks
 * - All sections must have between 1 and N elements
 * - All sections must have a title if more than 1 section is provided
 *
 * @internal
 * @group Globals
 *
 * @typeParam T - The type of the components of the section
 * @typeParam N - The maximum number of elements in the section
 */
export declare abstract class Section<T, N extends number> extends ClientLimitedMessageComponent<T, N> {
    /**
     * The title of the section
     */
    readonly title?: string;
    /**
     * Builds a section component
     *
     * @param name - The name of the section's type
     * @param keys_name - The name of the section's keys
     * @param elements - The elements of the section
     * @param max - The maximum number of elements in the section
     * @param title - The title of the section
     * @param title_length - The maximum length of the title
     */
    constructor(name: string, keys_name: string, elements: AtLeastOne<T>, max: N, title?: string, title_length?: number);
}
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
     * Builds a product section component for an {@link ActionProduct}
     *
     * @param title - The title of the product section, only required if more than 1 section will be used
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
     * Builds a product component for {@link ActionProduct}, {@link ActionCatalog} and {@link ProductSection}
     *
     * @param product_retailer_id - The id of the product
     */
    constructor(product_retailer_id: string);
}
//# sourceMappingURL=index.d.ts.map