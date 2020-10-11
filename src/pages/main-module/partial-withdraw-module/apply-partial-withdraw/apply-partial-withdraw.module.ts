import { PartialWithdrawVerifyPageModule } from './../partial-withdraw-verify/partial-withdraw-verify.module';
import { PartialWithdrawHistoryPageModule } from './../partial-withdraw-history/partial-withdraw-history.module';
import { GeneratePartialAmountService } from '../../../../providers/services/main-module-services/partial-withdraw-module-services/get-partial-amount.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyPartialwithdrawPage } from './apply-partial-withdraw';
import { PartialWithdrawPayoutPageModule } from '../partial-withdraw-payout/partial-withdraw-payout.module';
import { ComponentsModule } from '../../../../common/components/components.module';


@NgModule({
  declarations: [
    ApplyPartialwithdrawPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyPartialwithdrawPage),
    ComponentsModule,
    PartialWithdrawPayoutPageModule,
    PartialWithdrawVerifyPageModule,
    PartialWithdrawHistoryPageModule
  ],
  providers: [
    GeneratePartialAmountService
  ]
})
export class ApplyPartialwithdrawPageModule {}
