export interface Delivery {
    id: number,
    name: string,
    phone: string,
    status: string,
    created_at: string,
    updated_at: string
}

export interface GetDeliveriesResponse {
    message: string,
    data: Delivery[],
    status: string,
}

export interface AddDeliveryResponse {
    message: string,
    data: Delivery,
    status: string,
}