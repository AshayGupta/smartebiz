import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThankYouPage } from './thank-you';
import { ComponentsModule } from '../../../common/components/components.module';

@NgModule({
  declarations: [
    ThankYouPage,
  ],
  imports: [
    IonicPageModule.forChild(ThankYouPage),
    ComponentsModule
  ],
})
export class ThankYouPageModule {}
