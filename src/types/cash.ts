export interface Cash {
    id: number,
    invoice_number: string,
    amount: number,
    status: string,
    pharmacy_id: number,
    pharmacy_name: string,
    delivery_representative_id: number,
    delivery_representative: {
        id: number,
        name: string,
        phone: string
    },
    products_information: string,
    created_by: {
        id: number,
        name: string
    },
    created_at: string,
    updated_at: string
}

export interface AddCashResponse {
    status: string,
    message: string,
    data: Cash
}


export interface GetCashResponse {
    status: string,
    message: string,
    data: {
        data: Cash[],
    }
}