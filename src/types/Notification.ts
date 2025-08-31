export interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  data: JSON | Record<string, any>;
  read: boolean;
  createdAt: string;
}

