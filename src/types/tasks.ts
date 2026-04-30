export interface Task {
                id: number,
                refill_code: string,
                pharmacy: {
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
    remark_1: string | null,
    remark_2: string | null,
    remark_3: string | null,
                uploaded_by: {
                    id: number,
                    name: string,
                    email: string,
                    id_number: string,
                    fcm_token: string | null,
                    role: "supervisor",
                    pharmacy_id: number,
                    status: "active"
    },
    assigned_to: {
    name: string
},
                file_name: string | null,
                file_url: string | null,
                file_link: string,
                description: string,
                notes: string | null,
                status: string,
                result_text: string | null,
                result_file_url: string | null,
                result_file_name: string | null,
                result_submitted_at: string | null,
                created_at: string,
                updated_at: string
}
            
export interface getTasksResponse {
    data: {
        data: Task[],
    },
    status: string,
    message: string,
}

export interface getSingleTaskResponse {
    data: Task,
    status: string,
    message: string,
}