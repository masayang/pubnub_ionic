import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  public keys = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    storage.ready().then(() => {
      this.loadPublishKey();
      this.loadSubscribeKey();
    })
    .catch((e) => {
      console.log("storage error", e)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  save() {
    console.log(this.keys);
    this.savePublishKey(this.keys['publishKey']);
    this.saveSubscribeKey(this.keys['subscribeKey']);
  }

  loadPublishKey() {
    this.storage.get("publishKey")
    .then((d) => {
      this.keys['publishKey'] = d;
    })
  }

  loadSubscribeKey() {
    this.storage.get("subscribeKey")
    .then((d) => {
      this.keys['subscribeKey'] = d;
    })
  }

  savePublishKey(publishKey) {
    this.storage.set("publishKey", publishKey);
  }

  saveSubscribeKey(subscribeKey) {
    this.storage.set("subscribeKey", subscribeKey);
  }

  getKeys() {
    return this.keys;
  }
}
