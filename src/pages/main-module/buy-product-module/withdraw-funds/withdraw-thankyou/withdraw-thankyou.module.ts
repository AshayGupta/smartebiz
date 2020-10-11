import { ComponentsModule } from './../../../../../common/components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawThankyouPage } from './withdraw-thankyou';

@NgModule({
  declarations: [
    WithdrawThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawThankyouPage),
    ComponentsModule
  ]
})
export class WithdrawThankyouPageModule {}
