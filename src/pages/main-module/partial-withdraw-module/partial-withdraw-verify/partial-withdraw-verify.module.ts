import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartialWithdrawVerifyPage } from './partial-withdraw-verify';
import { ComponentsModule } from '../../../../common/components/components.module';
import { ProcessPartialWithdrawalService } from '../../../../providers/services/main-module-services/partial-withdraw-module-services/process-partial-withdrawal.service';

@NgModule({
  declarations: [
    PartialWithdrawVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(PartialWithdrawVerifyPage),
    ComponentsModule
  ],
  providers: [
    ProcessPartialWithdrawalService
  ]
})
export class PartialWithdrawVerifyPageModule {}
