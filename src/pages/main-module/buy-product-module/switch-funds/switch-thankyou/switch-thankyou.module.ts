import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchThankyouPage } from './switch-thankyou';

@NgModule({
  declarations: [
    SwitchThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchThankyouPage),
    ComponentsModule
  ],
})
export class SwitchThankyouPageModule {}
