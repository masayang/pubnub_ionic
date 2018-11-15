import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublisherPage } from './publisher';

@NgModule({
  declarations: [
    PublisherPage,
  ],
  imports: [
    IonicPageModule.forChild(PublisherPage),
  ],
})
export class PublisherPageModule {}
