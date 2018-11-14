import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ConfigPage } from '../config/config';
import { Storage } from '@ionic/storage';

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
    })

    events.subscribe("keyVal", (key, val) => {
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
}
