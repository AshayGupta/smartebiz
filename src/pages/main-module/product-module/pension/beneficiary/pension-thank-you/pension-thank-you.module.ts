import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PensionThankYouPage } from './pension-thank-you';
import { ComponentsModule } from '../../../../../../common/components/components.module';

@NgModule({
  declarations: [
    PensionThankYouPage,
  ],
  imports: [
    IonicPageModule.forChild(PensionThankYouPage),
    ComponentsModule
  ],
})
export class PensionThankYouPageModule {}
