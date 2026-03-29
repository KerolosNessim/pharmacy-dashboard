export type addCategoryResponse = {
    status: string,
    message: string,
    data: {
        name: string,
        updated_at: string,
        created_at: string,
        id: number
    }
}

export type category = {
  id: number,
  name: string,
  pharmacy_id: null,
  parent_id: null,
  status: string,
  created_at: string,
  updated_at: string,
  products_count: number,
  children?: {
    id: number,
    name: string,
    pharmacy_id: null,
    parent_id: null,
    status: string,
    created_at: string,
    updated_at: string,
    products_count: number,
  }[]
}


  export type getCategoriesResponse = {
    status: string,
    message: string,
    data: category[]|[]
  }