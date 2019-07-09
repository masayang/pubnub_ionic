import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { PubNubAngular } from 'pubnub-angular2';
import { environment } from '../../environments/environment';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class PubnubService {
  public counter: any = {};

  constructor(public settings: SettingsService, public pubnub: PubNubAngular, public event: Events) {
    this.pubnub.init({
      publishKey: environment.pubnub.publisher_key,
      subscribeKey: environment.pubnub.subscriber_key
    })
  }

  subscribe() {
    console.log(this.settings.channelName)
    this.pubnub.subscribe({
      channels: [this.settings.channelName],
      triggerEvents: ['message']
    });

    this.pubnub.getMessage(this.settings.channelName, (msg) => {
      if (msg.message.command == "countUp") {
        this.countUp(msg.message.name)
      }

      if (msg.message.command == "clear") {
        this.clear(msg.message.name)
      }
    })

    console.log("subscriber ready")
  }

  countUp(name: string) {
    if (!(name in this.counter)) {
      this.counter[name] = 1;
    } else {
      this.counter[name] += 1;
    }

    console.log(this.counter);

    this.event.publish('message', {counter: this.counter});

  }

  clear(name) {
    this.counter[name] = 0;

    console.log(this.counter);
    this.event.publish('message', {counter: this.counter});
  }
}
