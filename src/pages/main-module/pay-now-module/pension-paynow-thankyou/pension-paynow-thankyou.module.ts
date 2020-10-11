import { ComponentsModule } from './../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PensionPaynowThankyouPage } from './pension-paynow-thankyou';

@NgModule({
  declarations: [
    PensionPaynowThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(PensionPaynowThankyouPage),
    ComponentsModule
  ],
})
export class PensionPaynowThankyouPageModule {}
