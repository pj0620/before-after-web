import { useCookies } from 'vue3-cookies';
import { Storage } from '@capacitor/storage';
import { Constants, Environment } from '@/constants';

export class StorgeService {
  static cookies = useCookies().cookies;

  static async set(key: string, value: string): Promise<void> {
    switch (Constants.ENV) {
      case Environment.LOCAL:
        this.cookies.set(key, value);
        break;
      case  Environment.WEB:
        this.cookies.set(key, value);
        break;
      case Environment.IOS:
        Storage.set({ key, value });
        break;
      case Environment.ANDROID:
        Storage.set({ key, value });
        break;
      default:
        console.error('error: invalid environment ' + Constants.ENV);
    }
  }

  static async get(key: string): Promise<string|null> {
    switch (Constants.ENV) {
      case Environment.LOCAL:
        return this.cookies.get(key);
      case Environment.WEB:
        return this.cookies.get(key);
      case Environment.IOS:
        return await this.getFromStorage(key);
      case Environment.ANDROID:
        return await this.getFromStorage(key);
      default:
        console.error('error: invalid environment ' + Constants.ENV);
        return null;
    }
  }

  static async getFromStorage(key: string) {
    const resp = await Storage.get({ key })
      .catch(e => console.error('error getting key from storage >> ', e));
    return resp ? resp.value : null;
  }
}