import { MatrixClient, createClient, ClientEvent } from 'matrix-js-sdk';
import { MatrixLoginCredentials, CreateClientOpts, MatrixUser } from '@/types/Matrix';
import { ErrorService } from './ErrorService';

export class MatrixService {
  private static client: MatrixClient | null = null;
  private static homeserverUrl = 'https://matrix.org';
  static homeserverDomain = 'matrix.org';

  static async initializeClient(): Promise<MatrixClient> {
    try {
      if (this.client) return this.client; // already initialized

      const userId = localStorage.getItem('matrixUserId');
      const accessToken = localStorage.getItem('matrixAccessToken');

      if (!userId || !accessToken) {
        throw new Error('Matrix client not initialized. Please login first.');
      }

      const opts: CreateClientOpts = {
        baseUrl: this.homeserverUrl,
        accessToken,
        userId,
      };
      this.client = createClient(opts);

      // Start client and wait until prepared once
      this.client.startClient({ initialSyncLimit: 20 });

      await new Promise<void>((resolve, reject) => {
        (this.client as MatrixClient).once(ClientEvent.Sync as any, (state: string) => {
          if (state === 'PREPARED') {
            resolve();
          } else if (state === 'ERROR') {
            reject(new Error('Matrix sync failed'));
          }
        });
      });
      return this.client;
    } catch (error) {
      ErrorService.logError(error, 'MatrixService.initializeClient');
      throw error;
    }
  }

  static async login(credentials: MatrixLoginCredentials) {
    try {
      const tempClient = createClient({ baseUrl: this.homeserverUrl });

      const response = await tempClient.login('m.login.password', {
        user: credentials.username,
        password: credentials.password,
      });

      if (!response.access_token) throw new Error('Login failed');

      localStorage.setItem('matrixUserId', response.user_id!);
      localStorage.setItem('matrixAccessToken', response.access_token);

      // re-init with real creds
      this.client = null;
      await this.initializeClient();

      return { userId: response.user_id!, accessToken: response.access_token };
    } catch (error) {
      ErrorService.logError(error, 'MatrixService.login');
      throw error;
    }
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
      ErrorService.logError(error, 'MatrixService.getMatrixUserProfile');
      throw error;
    }
  }

  static isLoggedIn(): boolean {
    return this.client !== null && this.client.getAccessToken() !== null;
  }
} 