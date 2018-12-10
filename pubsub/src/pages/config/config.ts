import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {
  private keyVal: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    this.keyVal = navParams.data['keyVal'];
  }

  save() {
    this.events.publish("KeyVal", "publishKey", this.keyVal["publishKey"]);
    this.events.publish("KeyVal", "subscribeKey", this.keyVal["subscribeKey"]);
    this.events.publish("KeyVal", "channel", this.keyVal["channel"]);

    this.navCtrl.pop();
  }
}
