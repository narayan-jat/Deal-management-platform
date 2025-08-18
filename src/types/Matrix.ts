export interface MatrixLoginCredentials {
  username: string;
  password: string;
}

export interface MatrixUserModel {
  id: string;
  userId: string;
  matrixUserId: string;
  matrixPassword: string;
  matrixAccessToken: string;
  matrixRefreshToken: string;
  createdAt: string;
}

export interface DealMember {
  userId: string;
  matrixUserId?: string;
  displayName?: string;
  role: 'owner' | 'member' | 'viewer';
}

export interface DealRoomOptions {
  dealId: string;
  dealTitle: string;
  dealDescription?: string;
  members: DealMember[];
  isPublic?: boolean;
}

export interface MatrixRoom {
  roomId: string;
  name: string;
  normalizedName: string | null;
  topic?: string;
  memberCount: number;
  avatarUrl?: string | null;
  lastMessage?: string;
  lastMessageDate?: Date;
  unreadMessages: number;
}

export interface MatrixMessage {
  eventId: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: number;
  type: 'm.text' | 'm.image' | 'm.file' | 'm.audio' | 'm.video';
}

export interface MatrixUser {
  matrixUserId: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface MatrixCreateRoomOptions {
  name: string;
  topic?: string;
  isPublic?: boolean;
  preset?: 'private_chat' | 'public_chat' | 'trusted_private_chat';
  invite?: string[];
}

export interface MatrixSendMessageOptions {
  roomId: string;
  content: string;
  type?: 'm.text' | 'm.image' | 'm.file' | 'm.audio' | 'm.video';
}

export interface CreateClientOpts {
  baseUrl: string;
  accessToken?: string;
  userId?: string;
}