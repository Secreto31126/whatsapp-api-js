import { type AtLeastOne, hasAtLeastOne } from "../../utils.js";

import * as M from "../index.js";

export function ProductSection({
  title,
  children: products,
}: {
  title?: string;
  children: M.Product[];
}) {
  if (!hasAtLeastOne(products)) {
    throw new Error("product section must have at least one product");
  }

  return new M.ProductSection(title, ...products);
}

export function Product({ id: product_retailer_id }: { id: string }) {
  return new M.Product(product_retailer_id);
}

export function CatalogProduct({
  id: product_retailer_id,
  catalog_id,
}: {
  id: string;
  catalog_id: string;
}) {
  return new M.CatalogProduct(product_retailer_id, catalog_id);
}
