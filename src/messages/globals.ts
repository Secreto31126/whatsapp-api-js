import { ClientLimitedMessageComponent } from "../types.js";
import type { AtLeastOne } from "../utils";

/**
 * TS knowledge intensifies
 * @internal
 */
export function isProductSections(obj: unknown[]): obj is ProductSection[] {
    return obj[0] instanceof ProductSection;
}

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
export abstract class Section<
    T,
    N extends number
> extends ClientLimitedMessageComponent<T, N> {
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
     * @throws If more than N elements are provided
     * @throws If title is over 24 characters if provided
     */
    constructor(
        name: string,
        keys_name: string,
        elements: AtLeastOne<T>,
        max: N,
        title?: string,
        title_length = 24
    ) {
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
        this.product_items = products;
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
}
