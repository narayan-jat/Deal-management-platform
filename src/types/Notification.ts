export interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  data: JSON;
  read: boolean;
  createdAt: Date;
}

