import { Component } from '@angular/core';
import { environment } from '../../environments/environment'
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public settings: SettingsService) {
  }

}
