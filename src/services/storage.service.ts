import { useCookies } from 'vue3-cookies';
import { Storage } from '@capacitor/storage';
import { Constants, Environment } from '@/constants';

export class StorgeService {
  static cookies = useCookies().cookies;

  static async set(key: string, value: string): Promise<void> {
    console.log(`setting ${key} -> ${value}`);
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
      default:
        console.error('error: invalid environment ' + Constants.ENV);
    }
  }

  static async get(key: string): Promise<string|null> {
    console.log(`getting ${key}`);
    switch (Constants.ENV) {
      case Environment.LOCAL:
        return this.cookies.get(key);
      case Environment.WEB:
        return this.cookies.get(key);
      case Environment.IOS:
        const resp = await Storage.get({ key });
        return resp.value;
      default:
        console.error('error: invalid environment ' + Constants.ENV);
        return null;
    }
  }
}