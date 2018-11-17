import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PubNubAngular } from 'pubnub-angular2';
import { Storage } from '@ionic/storage';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import 'd3-transition';


// Inspired by http://edupala.com/how-to-used-d3-in-ionic-3/

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

  private svg: any;
  private g: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };

  private width: number;
  private height: number;

  private x: any;
  private y: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, pubnub: PubNubAngular, public storage: Storage, public platform: Platform) {
    this.pubnub = pubnub;

    storage.ready()
      .then(() => {
        this.loadPublishKey();
      })

    platform.ready().then(() => {
      this.width = platform.width() - this.margin.left - this.margin.right;
      this.height = platform.height() - this.margin.top - this.margin.bottom;
    })
  }


  ionViewDidLoad() {
    this.initSvg();
  }

  initSvg() {
    this.svg = d3.select("#barChart")
      .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox', '0 0 2000 2000');
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis() {
    if (Object.keys(this.clients).length > 0) {
      this.x = d3Scale
        .scaleBand()
        .domain(Object.keys(this.clients))
        .rangeRound([0, this.width])
        .paddingInner(0.1);

      this.y = d3Scale
        .scaleLinear()
        .domain([0, d3Array.max(Object.keys(this.clients).map(key => this.clients[key]))])
        .rangeRound([this.height, 0])
    }
  }

  drawAxis() {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  }

  redrawAxis() {
    this.x.domain(Object.keys(this.clients))
    this.y.domain([0, d3Array.max(Object.keys(this.clients).map(key => this.clients[key]))])
    this.svg.selectAll("g.axis.axis--x").call(d3Axis.axisBottom(this.x))
    this.svg.selectAll("g.axis.axis--y").call(d3Axis.axisLeft(this.y))
  }


  drawBars() {
    this.g.selectAll("rect")
      .remove()
      .exit()
      .data(Object.keys(this.clients))
      .enter()
      .append("rect")
      .attr("x", (d) => this.x(d))
      .attr("y", (d) => this.y(this.clients[d]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(this.clients[d]))
  }

  redrawBars() {
    let bars = this.g.selectAll("rect").data(Object.keys(this.clients));

    bars
      .enter()
      .append("rect")
      .attr("x", (d) => {
        console.log(d);
        return this.width;
      })
      .attr("y", (d) => {
        console.log(this.clients[d])
        console.log(this.y(this.clients[d]))
        return this.y(this.clients[d])
      })
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(this.clients[d]))
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.x(d))
      .attr("y", (d) => this.y(this.clients[d]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(this.clients[d]));

  }


  names() {
    return Object.keys(this.clients);
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
      this.addMessage(msg.message.name)
    })
  }

  addMessage(name) {
    if (name in this.clients) {
      this.clients[name]++
      this.redrawAxis();
      this.drawBars();
    } else {
      this.clients[name] = 1;
      if (this.x == null) {
        this.initAxis();
        this.drawAxis();
        this.drawBars();
      } else {
        this.redrawAxis();
        this.redrawBars();
      }
    }
  }

}
