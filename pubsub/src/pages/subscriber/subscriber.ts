import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PubNubAngular } from 'pubnub-angular2';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-subscriber',
  templateUrl: 'subscriber.html',
})
export class SubscriberPage {
  private publishKey: string;
  private subscribeKey: string;
  private channel: string;
  private pubnub: PubNubAngular;
  private clients: any = {}

  constructor(public navCtrl: NavController, public navParams: NavParams, pubnub: PubNubAngular, public storage: Storage) {
    this.pubnub = pubnub;

    storage.ready()
      .then(() => {
        this.loadPublishKey();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriberPage');
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
        this.loadChannel();
      })
  }

  loadChannel() {
    this.storage.get("channel")
      .then((val) => {
        this.channel = val;
        this.pubnub.init({
          publishKey: this.publishKey,
          subscribeKey: this.subscribeKey
        })
        this.subscribe();
      })
  }

  subscribe() {
    this.pubnub.subscribe({
      channels: [this.channel],
      triggerEvents: ['message']
    });

    this.pubnub.getMessage(this.channel, (msg) => {
      console.log(msg.message);
      this.addMessage(msg.message.name)
    })
  }

  addMessage(name) {
    if (name in this.clients) {
      this.clients[name]++
    } else {
      this.clients[name] = 1;
    }
    console.log(this.clients)
  }

}
