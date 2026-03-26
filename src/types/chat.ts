export interface Message {
            id: number,
            message: string,
            file_url: string | null,
            file_type: string | null,
            is_read: boolean,
            created_at: string,
            sender: {
                id: number,
                name: string,
                role: string,
                pharmacy_name: string
            }
}
 

export interface getMessagesResponse {
  status: string;
  message: string;
  messages: Message[];
}

export interface InboxItem {
            conversation_id: number,
            other_party_id: number,
            other_party_name: string,
            last_message: string | null,
            last_message_at: string | null
}
export interface InboxResponse {
            status: string,
            message: string,
            inbox: InboxItem[]
}
