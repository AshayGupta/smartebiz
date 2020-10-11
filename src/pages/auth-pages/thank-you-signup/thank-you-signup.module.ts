import { ComponentsModule } from './../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThankYouSignupPage } from './thank-you-signup';

@NgModule({
  declarations: [
    ThankYouSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(ThankYouSignupPage),
    ComponentsModule
  ],
})
export class ThankYouSignupPageModule {}
