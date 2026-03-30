export type AddRequestResponse={
    status: string,
    message: string,
    data: {
        from_pharmacy_id: number,
        to_pharmacy_id: number,
        status: string,
        notes: string,
        created_at: string,
        id: number,
        creator_name: string,
        to_pharmacy: {
            id: number,
            name: string,
            address: string,
            phone: string,
            city: string | null,
            area: string | null,
            status: string,
            created_at: string,
            updated_at: string
        },
        items:{
            id: number,
                transfer_id: number,
                product_id: number,
                quantity: number,
                price: string,
                created_at: string,
                updated_at: string,
                product: {
                    id: number,
                    name: string,
                    description: string | null,
                    code: string,
                    image: string | null,
                    sku: string | null,
                    active_ingredients: string,
                    type: string | null,
                    dosage_form: string,
                    concentration: string | null,
                    price: string,
                    side_effects: string | null,
                    storage_instructions: string | null,
                    manufacturer: string,
                    pharmacy_id: number | null,
                    category_id: number,
                    status: string
                }
        }[],
        created_by: {
            id: number,
            name: string,
            email: string | null,
            id_number: string,
            fcm_token: string | null,
            role: string,
            pharmacy_id: number,
            status: string
        }
    }
}

export type AddRequestData= {
      from_pharmacy_id: number,
      items: {
        product_id: number,
        quantity: number,
      }[],
    };


    export type TransferResponse={
    status: string,
    message: string,
    data: {
        data: RequestItem[],
        current_page: number,
        totals: {
            total_in: number,
            total_out: number,
        },
        last_page: number,
        total: number
    }
}

export type RequestItem=            {
                id: number,
                created_at: string,
                creator_name: string,
                from_pharmacy: string,
                to_pharmacy: string,
                medications: 
                    {
                        name: string,
                        quantity: number
                    }[],
                status: string
}
            

export type SendReportData= {
    email: string,
    from_date: string,
    to_date: string,
}