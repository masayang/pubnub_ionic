import { Component } from '@angular/core';
import { PubnubService } from '../services/pubnub.service';
import { environment } from '../../environments/environment';
import { SettingsService } from '../services/settings.service';
import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import 'd3-transition';
import { Platform, Events } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  private svg: any;
  private g: any;
  private width: number;
  private height: number;
  private margin: any = { top: 50, right: 20, bottom: 50, left: 40 };
  private x: any;
  private y: any;
  private lastClients: []

  constructor(public settings: SettingsService, public pubnub: PubnubService, public platform: Platform, public event: Events) {
    settings.channelName = environment.pubnub.channel;

    console.log(settings)
    this.pubnub.subscribe();

    platform.ready().then(() => {
      this.width = platform.width() - this.margin.left - this.margin.right;
      this.height = platform.height() - this.margin.top - this.margin.bottom;
    })

    this.event.subscribe('message', (counter) => {
      console.log(counter);
      if (this.lastClients == Object.keys(counter.counter)) {
        this.redrawAxis(counter.counter);
        this.drawBars(counter.counter);
      } else {
        if (this.x == null) {
          this.initAxis(counter.counter);
          this.drawAxis();
          this.drawBars(counter.counter);
        } else {
          this.redrawAxis(counter.counter);
          this.redrawBars(counter.counter);
        }
      }
    })

  }

  ngOnInit() {
    this.initSvg();
  }

  initSvg() {
    console.log("initSvg")
    this.svg = d3.select("#barChart")
      .append("svg")
      .attr("width", '100%')
      //      .attr("height", '100%')
      .attr('viewBox', '0 0 ' + this.width *1.2 + ' ' + this.height*1.2);
    this.g = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  initAxis(counter: any) {
    if (Object.keys(counter).length > 0) {
      this.x = d3Scale
        .scaleBand()
        .domain(Object.keys(counter))
        .rangeRound([0, this.width])
        .paddingInner(0.1);

      this.y = d3Scale
        .scaleLinear()
        .domain([0, d3Array.max(Object.keys(counter).map(key => counter[key]))])
        .rangeRound([this.height, 0])
    }
  }

  drawAxis() {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .style("font", "50px times")
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

  drawBars(counter) {
    console.log(Object.keys(counter))
    this.g.selectAll("rect")
      .remove()
      .exit()
      .data(Object.keys(counter))
      .enter()
      .append("rect")
      .attr("x", (d) => { console.log(d); this.x(d) })
      .attr("y", (d) => this.y(counter[d]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(counter[d]))
      .attr("fill", (d) => this.stringToColour(d))
  }

  stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    console.log(colour)
    return colour;
  }

  redrawAxis(counter) {
    this.x.domain(Object.keys(counter))
    this.y.domain([0, d3Array.max(Object.keys(counter).map(key => counter[key]))])
    this.svg.selectAll("g.axis.axis--x").call(d3Axis.axisBottom(this.x))
    this.svg.selectAll("g.axis.axis--y").call(d3Axis.axisLeft(this.y))
  }

  redrawBars(counter) {
    let bars = this.g.selectAll("rect").data(Object.keys(counter));

    bars
      .enter()
      .append("rect")
      .attr("x", (d) => this.width)
      .attr("y", (d) => this.y(counter[d]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(counter[d]))
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.x(d))
      .attr("y", (d) => this.y(counter[d]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.height - this.y(counter[d]))
      .attr("fill", (d) => this.stringToColour(d))
  }
}
