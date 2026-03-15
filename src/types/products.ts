export type AddProductResponse = {
    status: string;
    message: string;
    data: {
        name: string;
        code: string;
        active_ingredients: string;
        dosage_form: string;
        price: number;
        manufacturer: string;
        category_id: number;
        status: string;
        id: number;
    }
}

export type PerCategoreyItem = {
    id: number,
    name: string,
    products_count: number
}

export type CategoryStatsResponse = 
{
    status: string,
    message: string,
    data: {
        total_products: number,
        total_categories: number,
        products_with_price: number,
        per_category: PerCategoreyItem[]
    }
}


export type ProductItem = {
                id: number,
                name: string,
                description: string|null,
                code: string,
                image: string|null,
                sku: string|null,
                active_ingredients: string,
                type: string|null,
                dosage_form: string,
                concentration: string|null,
                price: string,
                side_effects: string|null,
                storage_instructions: string|null,
                manufacturer: string,
                pharmacy_id: string,
                category_id: number,
                status: string,
                category: {
                    id: number,
                    name: string,
                    pharmacy_id: string,
                    parent_id: string,
                    status: string,
                    created_at: string,
                    updated_at: string
                }
}

export type ProductsListResponse = {
    status: string,
    message: string,
    data: {
        data: ProductItem[],
        current_page: number,
        last_page: number,
        per_page: number,
        total: number
    }
}

export type SingleProductResponse = {
    status: string,
    message: string,
    data: ProductItem
}

