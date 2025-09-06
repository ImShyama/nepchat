export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}