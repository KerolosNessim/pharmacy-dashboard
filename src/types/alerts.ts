
    
export interface Alert {
        title: string,
        body: string,
        updated_at: string,
        created_at: string,
        id: number
}

export interface CreateAlertResponse{
  status: string,
  message: string,
  data: Alert
}

export interface GetAlertsResponse{
  status: string,
  message: string,
  data: Alert[]
}