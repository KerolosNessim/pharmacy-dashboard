export interface NotificationData {
  title: string;
  body: string;
  additional_property?: string;
}

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPagination {
  current_page: number;
  last_page: number;
  total: number;
}

export interface GetNotificationsResponse {
  status: number;
  message: string;
  data: {
    data: Notification[];
    pagination: NotificationPagination;
  };
}

export interface UnreadCountResponse {
  status: number;
  message: string;
  data: number;
}
