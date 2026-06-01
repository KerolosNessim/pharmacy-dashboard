/**
 * Default `per_page` per Laravel list endpoint.
 */
export const API_PAGINATION = {
  transfers: 10,
  products: 200,
  list: 10,
} as const;

export const TRANSFER_PER_PAGE = API_PAGINATION.transfers;
export const LIST_PER_PAGE = API_PAGINATION.list;
export const PRODUCTS_PER_PAGE = API_PAGINATION.products;
