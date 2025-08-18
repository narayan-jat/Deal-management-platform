import { MatrixClient, createClient, NotificationCountType } from 'matrix-js-sdk';
import { MatrixLoginCredentials, MatrixRoom, MatrixMessage, MatrixCreateRoomOptions, MatrixSendMessageOptions, CreateClientOpts, MatrixUser } from '@/types/Matrix';
import { ErrorService } from './ErrorService';

export class MatrixService {
  private static client: MatrixClient | null = null;
  private static homeserverUrl = 'https://matrix.org';

  static async initializeClient(): Promise<MatrixClient> {
    try {
      const userId = localStorage.getItem('matrixUserId');
      const accessToken = localStorage.getItem('matrixAccessToken');

      console.log("userId", userId);
      console.log("accessToken", accessToken);
      if (userId && accessToken) {
        const opts: CreateClientOpts = {
          baseUrl: this.homeserverUrl,
          accessToken,
          userId,
        };
        this.client = createClient(opts);
        await this.client.startClient();
        return this.client;
      }
      else {
        throw new Error('Matrix client not initialized. Please login first.');
      }
    } catch (error) {
      ErrorService.logError(error, "MatrixService.initializeClient");
      throw error;
    }

  }


  static async login(credentials: MatrixLoginCredentials): Promise<{ userId: string; accessToken: string }> {
    try {
      const client = await this.initializeClient();
      const response = await client.login('m.login.password', {
        user: credentials.username,
        password: credentials.password,
      });

      if (response.access_token) {
        client.setAccessToken(response.access_token);
        await client.startClient();
        return {
          userId: response.user_id!,
          accessToken: response.access_token,
        };
      }
      throw new Error('Login failed: No access token received');
    } catch (error) {
      ErrorService.logError(error, "MatrixService.login");
      throw error;
    }
  }

  static async createRoom(options: Partial<MatrixCreateRoomOptions>): Promise<string> {
    try {
      if (!this.client) throw new Error('Matrix client not initialized. Please login first.');

      const roomOptions: any = {
        preset: options.preset || 'private_chat',
        visibility: options.isPublic ? 'public' : 'private',
        name: options.name,
      };

      if (options.topic) roomOptions.topic = options.topic;
      if (options.invite?.length) roomOptions.invite = options.invite;

      const roomId = await this.client.createRoom(roomOptions);
      return roomId.room_id;
    } catch (error) {
      ErrorService.logError(error, "MatrixService.createRoom");
      throw error;
    }
  }

  static async sendMessage(options: MatrixSendMessageOptions): Promise<string> {
    if (!this.client) throw new Error('Matrix client not initialized. Please login first.');

    const eventId = await this.client.sendEvent(options.roomId, 'm.room.message' as any, {
      body: options.content,
      msgtype: 'm.text',
    });

    return eventId.event_id;
  }


  static async getMatrixUserProfile(matrixUserId: string): Promise<MatrixUser> {
    try {
      await this.initializeClient();
      if (!this.client) throw new Error('Matrix client not initialized. Please login first.');

      const profile = await this.client.getProfileInfo(matrixUserId);
      return {
        matrixUserId: matrixUserId,
        displayName: profile.displayname,
        avatarUrl: profile.avatar_url,
      };
    } catch (error) {
      ErrorService.logError(error, "MatrixService.getMatrixUserProfile");
      throw error;
    }
  }

  static async getMessages(roomId: string, limit: number = 50): Promise<MatrixMessage[]> {
    if (!this.client) throw new Error('Matrix client not initialized. Please login first.');

    const room = this.client.getRoom(roomId);
    if (!room) throw new Error('Room not found');

    const timeline = room.getLiveTimeline();
    const events = timeline.getEvents().slice(-limit);

    return events
      .filter(event => event.getType() === 'm.room.message')
      .map(event => ({
        eventId: event.getId()!,
        roomId: event.getRoomId()!,
        sender: event.getSender()!,
        content: event.getContent().body || '',
        timestamp: event.getTs(),
        type: (event.getContent().msgtype as 'm.text' | 'm.image' | 'm.file' | 'm.audio' | 'm.video') || 'm.text',
      }));
  }

  static async getRooms(): Promise<MatrixRoom[]> {
    try {
      // initialize client if not initialized
      await this.initializeClient();
      if (!this.client) {
        throw new Error('Matrix client not initialized. Please login first.');
      }

      const rooms = this.client.getRooms();
      const baseUrl = this.client.baseUrl; // needed for avatar URLs

      return rooms.map(room => {
        const avatarUrl = room.getAvatarUrl(baseUrl, 40, 40, "crop", true, false);
        const unreadMessages = room.getUnreadNotificationCount(NotificationCountType.Total);
        // or NotificationCountType.Highlight if you only want mentions/highlights

        return {
          roomId: room.roomId,
          name: room.name || "Unnamed Room",
          normalizedName: room.normalizedName || null,
          topic: (room as any).topic,
          memberCount: room.getJoinedMemberCount(),
          avatarUrl,
          unreadMessages
        };
      });
    } catch (error) {
      ErrorService.logError(error, "MatrixService.getRooms");
      throw error;
    }
  }


  static isLoggedIn(): boolean {
    return this.client !== null && this.client.getAccessToken() !== null;
  }

  static getCurrentUserId(): string | null {
    return this.client?.getUserId() || null;
  }

  static async logout(): Promise<void> {
    if (this.client) {
      await this.client.logout();
      this.client.stopClient();
      this.client = null;
    }
    // Clear localStorage
    localStorage.removeItem('matrixUserId');
    localStorage.removeItem('matrixAccessToken');
  }
} 