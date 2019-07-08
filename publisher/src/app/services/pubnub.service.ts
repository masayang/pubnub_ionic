import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { PubNubAngular } from 'pubnub-angular2';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PubnubService {
  constructor(public settings: SettingsService, public pubnub: PubNubAngular) {
    console.log(environment)
    this.pubnub = pubnub;
    const r = this.pubnub.init({
      publishKey: environment.pubnub.publisher_key,
      subscribeKey: environment.pubnub.subscriber_key
    })
    console.log(r);
  }

  countUp(name: string) {
    this.pubnub.publish(
      {
        message: { command: 'countUp', name: name },
        channel: this.settings.channelName
      }
    ), (status, response) => {
      if (status.error) {
        console.log(status);
      } else {
        console.log('message Published w/ timetoken', response.timetoken);
      }
    }
  }

  clear(name: string) {
    this.pubnub.publish(
      {
        message: { command: 'clear', name: name },
        channel: this.settings.channelName
      }
    ), (status, response) => {
      if (status.error) {
        console.log(status);
      } else {
        console.log('message Published w/ timetoken', response.timetoken);
      }
    }
  }
}
