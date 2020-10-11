import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThankYouTopupPage } from './thank-you-topup';

@NgModule({
  declarations: [
    ThankYouTopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ThankYouTopupPage),
    ComponentsModule
  ],
})
export class ThankYouTopupPageModule {}
