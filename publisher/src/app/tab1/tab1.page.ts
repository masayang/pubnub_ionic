import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SettingsService } from '../services/settings.service';
import { PubnubService } from '../services/pubnub.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public name: string;

  constructor(public settings: SettingsService, public pubnub: PubnubService) {
    settings.channelName = environment.pubnub.channel;

    console.log(settings)  
  }

  isReadyToPublish() {
    if (this.name == null) return false;
    if (this.name.length == 0) return false;
    return true;
  }

  countUp() {
    this.pubnub.countUp(this.name)
  }

  clear() {
    this.pubnub.clear(this.name);
  }
}
