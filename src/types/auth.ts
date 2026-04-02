export type registerResponse = {
  message: string;
  token: string;
  admin?: user
}

export type loginResponse = {
    status: string,
    message: string,
    data: {
        token: string,
        admin?: user
        pharmacist?: user
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
    pharmacy_id?: number | null| string
    pharmacy_name?: string | null
}

export type userState = {
    user: user | null,
    clientToken: string | null,
    setClientToken: (token: string | undefined) => void,
    setUser: (user:user | undefined) => void,
    removeUser: () => void
}
