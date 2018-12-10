import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ConfigPage } from '../config/config';
import { Storage } from '@ionic/storage';
import { SubscriberPage } from '../subscriber/subscriber';
import { PublisherPage } from '../publisher/publisher';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private keyVal: any = {};

  constructor(public navCtrl: NavController, public storage: Storage, public events: Events) {
    storage.ready()
    .then(() => {
      this.loadVariable("publishKey");
      this.loadVariable("subscribeKey");
      this.loadVariable("channel");
    })

    events.subscribe("KeyVal", (key, val) => {
      this.saveVariable(key, val);
    })
    
  }

  config() {
    this.navCtrl.push(ConfigPage, {
      keyVal: this.keyVal
    });
  }

  loadVariable(key) {
    this.storage.get(key)
    .then((val) => {
      this.keyVal[key] = val;
    })
  }

  saveVariable(key, val) {
    this.keyVal[key] = val;
    this.storage.set(key, val);
  }

  isConfigReady() {
    if (this.keyVal["publishKey"] == null) return false;
    if (this.keyVal["subscribeKey"] == null) return false;
    if (this.keyVal["channel"] == null) return false;
    return true;
  }

  subscriber() {
    this.navCtrl.push(SubscriberPage);
  }

  publisher() {
    this.navCtrl.push(PublisherPage);
  }
}
