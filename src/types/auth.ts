export type registerResponse = {
  message: string;
  token: string;
  admin?: {
    id: number;
    name: string;
    id_number: string;
    role: string;
  }
}

export type loginResponse = {
    status: string,
    message: string,
    data: {
        token: string,
        admin: {
            id: number,
            name: string,
            id_number: string,
            role: string,
            pharmacy_id: number | null| string
        }
    }
}

export type logoutResponse = {
    status: string,
    message: string,
}

export type user = {
    id: number,
    name: string,
    id_number: string,
    role: string,
    pharmacy_id: number | null| string
    pharmacy_name: string | null
}

export type userState = {
    user: user | null,
    setUser: (user:user) => void,
    removeUser: () => void
}
