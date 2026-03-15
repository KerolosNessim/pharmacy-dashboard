export type addDepartmentResponse = {
    success: string;
    message: string;
    data: {
        name: string;
        phone: string;
        updated_at: string;
        created_at: string;
        id: number;
    }
}

export type Department = {
    id: number,
    name: string,
    phone: string,
    created_at: string,
    updated_at: string,
    doctors_count: number
}

export type getDepartmentsResponse = {
    success: string;
    message: string;
    data: Department[];
}

export type addClinicResponse = {
    success: string;
    message: string;
    data: {
        name: string;
        phone: string;
        address: string;
        updated_at: string;
        created_at: string;
        id: number;
    }
}

export type Clinic = {
    id: number,
    name: string,
    phone: string,
    address: string,
    created_at: string,
    updated_at: string,
    doctors_count: number
}

export type getClinicsResponse = {
    success: string;
    message: string;
    data: Clinic[];
}

export type addDoctorExtensionResponse = {
    status: string;
    message: string;
    data: {
        name: string;
        phone: string;
        clinic_id: number;
        updated_at: string;
        created_at: string;
        id: number;
        department: null;
        clinic: {
            id: number;
            name: string;
            phone: string;
            address: string;
            created_at: string;
            updated_at: string;
        }
    }

}


export type singleClinic =        {
            id: number,
            name: string,
            phone: string,
            address: string,
            created_at: string,
            updated_at: string,
            doctors_count: number,
            doctors: [
                {
                    id: number,
                    name: string,
                    phone: string,
                    medical_department_id: number,
                    created_at: string,
                    updated_at: string,
                    clinic_id: number
                },
            ]
        }

export type ClinicResponse = {
    status: string;
    message: string;
    data: singleClinic[]
}