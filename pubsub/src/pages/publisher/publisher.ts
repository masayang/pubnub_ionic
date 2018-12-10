import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { PubNubAngular } from 'pubnub-angular2';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-publisher',
  templateUrl: 'publisher.html',
})
export class PublisherPage {
  private publishKey: string;
  private subscribeKey: string;
  private channel: string;
  private name: string = "";
  private pubnub: PubNubAngular;

  constructor(public navCtrl: NavController, pubnub: PubNubAngular, public storage: Storage) {
    this.pubnub = pubnub;

    storage.ready()
      .then(() => {
        this.loadPublishKey();
        this.loadChannel();
      })
  }

  isReadyToPublish() {
    if (this.name == null) return false;
    if (this.name.length == 0) return false;
    if (this.publishKey == null) return false;
    if (this.publishKey.length == 0) return false;
    if (this.subscribeKey == null) return false;
    if (this.subscribeKey.length == 0) return false;
    if (this.channel == null) return false;
    if (this.channel.length == 0) return false;
    return true;
  }

  loadPublishKey() {
    this.storage.get("publishKey")
      .then((val) => {
        this.publishKey = val;
        this.loadSubscribeKey();
      })
  }

  loadSubscribeKey() {
    this.storage.get("subscribeKey")
      .then((val) => {
        this.subscribeKey = val;
        this.pubnub.init({
          publishKey: this.publishKey,
          subscribeKey: this.subscribeKey
        })
      })
  }

  loadChannel() {
    this.storage.get("channel")
      .then((val) => {
        this.channel = val;
      })
  }

  publish() {
    this.pubnub.publish(
      {
        message: { name: this.name },
        channel: this.channel
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
