import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InitialWithdrawThankyouPage } from './initial-withdraw-thankyou';
import { ComponentsModule } from '../../../../../../common/components/components.module';

@NgModule({
  declarations: [
    InitialWithdrawThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(InitialWithdrawThankyouPage),
    ComponentsModule
  ],
})
export class InitialWithdrawThankyouPageModule {}
