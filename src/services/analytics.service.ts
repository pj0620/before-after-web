import { Constants, Environment } from '@/constants';
import { useGtag } from 'vue-gtag-next';

export class AnalyticsService {
  static event = useGtag().event;

  static async analyticsEvent(eventText: string): Promise<void> {
    if (Constants.ENV === Environment.LOCAL) {
      console.log('GA event: ' + eventText);
    }
    else {
      this.event(eventText);
    }
  }
}