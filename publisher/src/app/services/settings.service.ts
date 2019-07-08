import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public channelName: string;

  constructor() {
    this.channelName = "default channel";
   }
}


