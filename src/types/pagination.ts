export type LaravelPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ParsedListResult<T> = {
  items: T[];
  pagination: LaravelPagination;
};
