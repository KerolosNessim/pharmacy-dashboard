import type { ProductItem } from "@/types/products";

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/** True if product matches query by name, code, or SKU. */
export function productMatchesSearch(
  product: ProductItem,
  query: string,
): boolean {
  const q = normalize(query);
  if (!q) return true;

  return (
    normalize(product.name).includes(q) ||
    normalize(product.code).includes(q) ||
    normalize(product.sku).includes(q)
  );
}

/**
 * Lower = better. Exact code/sku first, then partial code/sku, then name.
 */
export function rankProductMatch(product: ProductItem, query: string): number {
  const q = normalize(query);
  if (!q) return 99;

  const code = normalize(product.code);
  const sku = normalize(product.sku);
  const name = normalize(product.name);

  if (code && code === q) return 0;
  if (sku && sku === q) return 1;
  if (code && code.includes(q)) return 2;
  if (sku && sku.includes(q)) return 3;
  if (name.includes(q)) return 4;
  return 99;
}

/** Filter + sort so code/sku matches (any of them) come first. */
export function filterAndRankProducts(
  products: ProductItem[],
  query: string,
): ProductItem[] {
  const q = query.trim();
  if (!q) return products;

  return products
    .filter((product) => productMatchesSearch(product, q))
    .sort(
      (a, b) => rankProductMatch(a, q) - rankProductMatch(b, q),
    );
}
